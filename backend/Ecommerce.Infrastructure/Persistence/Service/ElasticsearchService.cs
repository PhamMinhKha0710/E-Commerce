using Nest;
using Ecommerce.Application.Common.DTOs;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

namespace Ecommerce.Infrastructure.Elasticsearch
{
    public class ElasticsearchService : IElasticsearchService
    {
        private readonly IElasticClient _client;
        private readonly HttpClient _httpClient;
        private const string IndexName = "ecommerce_product_item";
        private const string FeatureExtractionUrl = "http://localhost:8000/extract-features";

        public ElasticsearchService(IElasticClient client, HttpClient httpClient)
        {
            _client = client;
            _httpClient = httpClient;
        }

        public async Task<ProductSearchResponseDto> SearchProductsAsync(ProductSearchRequestDto request)
        {
            var filters = new List<QueryContainer>();

            var query = new BoolQuery
            {
                Must = request.Query != null ? new QueryContainer[] {
                    new BoolQuery
                    {
                        Should = new QueryContainer[]
                        {
                            new MultiMatchQuery
                            {
                                Query = request.Query,
                                Fields = new[] { "name^3", "description", "variant_name", "name.multilingual^1.5" },
                                Analyzer = "vietnamese_search_analyzer",
                                Fuzziness = Fuzziness.Auto,
                                Type = TextQueryType.MostFields
                            },
                            new MatchQuery
                            {
                                Field = "name",
                                Query = request.Query,
                                Analyzer = "vietnamese_search_analyzer",
                                Fuzziness = Fuzziness.Auto,
                                Boost = 2.0
                            }
                        },
                        MinimumShouldMatch = 1
                    }
                } : null,
                Filter = filters
            };

            // Apply filters
            if (request.Filters?.Category?.Any() == true)
                filters.Add(new TermsQuery { Field = "category", Terms = request.Filters.Category });
            if (request.Filters?.SubCategory?.Any() == true)
                filters.Add(new TermsQuery { Field = "sub_category", Terms = request.Filters.SubCategory });
            if (request.Filters?.Brand?.Any() == true)
                filters.Add(new TermsQuery { Field = "brand", Terms = request.Filters.Brand });
            if (request.Filters?.PriceRange != null)
                filters.Add(new NumericRangeQuery { Field = "price", GreaterThanOrEqualTo = request.Filters.PriceRange.Min, LessThanOrEqualTo = request.Filters.PriceRange.Max });
            if (request.Filters?.Variations?.Any() == true)
            {
                foreach (var variation in request.Filters.Variations)
                {
                    var variationMust = new List<QueryContainer>();
                    var variationQuery = new BoolQuery { Must = variationMust };

                    if (variation.OptionId.HasValue)
                        variationMust.Add(new TermQuery { Field = "variations.option_id", Value = variation.OptionId });
                    if (!string.IsNullOrEmpty(variation.OptionValue))
                        variationMust.Add(new TermQuery { Field = "variations.option_value", Value = variation.OptionValue });
                    if (variation.VariationId.HasValue)
                        variationMust.Add(new TermQuery { Field = "variations.variation_id", Value = variation.VariationId });
                    if (!string.IsNullOrEmpty(variation.VariationValue))
                        variationMust.Add(new TermQuery { Field = "variations.variation_value", Value = variation.VariationValue });

                    filters.Add(new NestedQuery
                    {
                        Path = "variations",
                        Query = variationQuery
                    });
                }
            }

            // Sorting
            var response = await _client.SearchAsync<ProductItemDto>(s => s
                .Index(IndexName)
                .Query(q => query)
                .Sort(sort =>
                {
                    if (request.Sort == "price_asc")
                        sort.Field(f => f.Field("price").Order(SortOrder.Ascending));
                    else if (request.Sort == "price_desc")
                        sort.Field(f => f.Field("price").Order(SortOrder.Descending));
                    else if (request.Sort == "popularity")
                        sort.Field(f => f.Field("popularity_score").Order(SortOrder.Descending));
                    return sort;
                })
                .From((request.Page - 1) * request.PageSize)
                .Size(request.PageSize)
            );

            var results = response.Hits.Select(h => h.Source).ToList();

            return new ProductSearchResponseDto
            {
                Total = response.Total,
                Page = request.Page,
                PageSize = request.PageSize,
                Results = results
            };
        }

        public async Task<ProductSearchResponseDto> SearchByImageAsync(byte[] imageData)
        {
            if (imageData == null || imageData.Length == 0)
                throw new ArgumentException("Image data is empty or null");

            using var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(imageData), "file", "image.jpg");

            try
            {
                var response = await _httpClient.PostAsync(FeatureExtractionUrl, content);
                response.EnsureSuccessStatusCode();
                var featureVector = await response.Content.ReadFromJsonAsync<float[]>();

                if (featureVector == null || featureVector.Length != 512)
                    throw new InvalidOperationException($"Invalid feature vector: length {featureVector?.Length ?? 0}, expected 512");

                // Gỡ lỗi: In vector đặc trưng
                Console.WriteLine($"Feature Vector: {JsonSerializer.Serialize(featureVector.Take(10))}... (first 10 elements)");

                var maxDistance = 0.3; // Tương ứng cosineSimilarity > 0.5
                var esResponse = await _client.SearchAsync<ProductItemDto>(s => s
                    .Index(IndexName)
                    .Query(q => q
                        .FunctionScore(fs => fs
                            .Query(qq => qq.MatchAll())
                            .Functions(f => f
                                .ScriptScore(ss => ss
                                    .Script(sc => sc
                                        .Source("cosineSimilarity(params.query_vector, 'feature_vector') + 1.0")
                                        .Params(p => p.Add("query_vector", featureVector))
                                    )
                                )
                            )
                        )
                    )
                    .Sort(sort => sort
                        .Field(f => f.Field("_score").Order(SortOrder.Descending))
                    )
                    .Size(20)
                );

                // Gỡ lỗi: In số lượng hits và điểm số
                Console.WriteLine($"Elasticsearch Hits: {esResponse.Hits.Count}, Total: {esResponse.Total}");
                foreach (var hit in esResponse.Hits)
                {
                    Console.WriteLine($"Product: {hit.Source.Name}, Score: {hit.Score}, CosineSimilarity: {hit.Score - 1.0}");
                }

                // Lọc kết quả dựa trên max_distance
                var results = esResponse.Hits
                    .Where(hit => hit.Score - 1.0 >= 1.0 - maxDistance)
                    .Select(h => new
                    {
                        h.Source,
                        Distance = 1.0 - (h.Score - 1.0),
                        CosineSimilarity = h.Score - 1.0
                    })
                    .OrderByDescending(x => x.CosineSimilarity)
                    .Select(x => x.Source)
                    .ToList();

                Console.WriteLine($"Filtered Results Count: {results.Count}");

                return new ProductSearchResponseDto
                {
                    Total = results.Count,
                    Page = 1,
                    PageSize = 20,
                    Results = results
                };
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HTTP Error: {ex.Message}");
                throw new InvalidOperationException($"Failed to extract features from image: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error: {ex.Message}");
                throw new InvalidOperationException($"Search by image failed: {ex.Message}", ex);
            }
        }

        // public async Task<SuggestResponseDto> SuggestAsync(string query)
        // {
        //     var response = await _client.SearchAsync<ProductItemDto>(s => s
        //         .Index(IndexName)
        //         .Suggest(su => su
        //             .Completion("product-suggest", c => c
        //                 .Field("suggestion")
        //                 .Prefix(query)
        //                 .Size(5)
        //                 .Fuzzy(f => f.Fuzziness(Fuzziness.Auto))
        //             )
        //         )
        //         .Query(q => q
        //             .MultiMatch(m => m
        //                 .Query(query)
        //                 .Fields(new[] { "name^2", "variant_name", "name.multilingual" })
        //                 .Analyzer("vietnamese_search_analyzer")
        //                 .Type(TextQueryType.PhrasePrefix)
        //                 .Fuzziness(Fuzziness.Auto)
        //                 .MaxExpansions(10)
        //             )
        //         )
        //         .Source(src => src.Includes(f => f.Field("name")))
        //         .Size(5)
        //     );
        //     if (!response.Suggest.ContainsKey("product-suggest"))
        //     {
        //         var suggestResponse = System.Text.Json.JsonSerializer.Serialize(response.Suggest);
        //         throw new Exception($"Suggest response does not contain 'product-suggest'. Full response: {suggestResponse}");
        //     }

        //     var suggestions = response.Suggest["product-suggest"]
        //         .SelectMany(s => s.Options)
        //         .Select(o => o.Text)
        //         .ToList();
        //     var productNames = response.Hits
        //         .Select(h => h.Source.Name)
        //         .ToList();

        //     return new SuggestResponseDto
        //     {
        //         Suggestions = suggestions,
        //         ProductNames = productNames
        //     };
        // }
        public async Task<SuggestResponseDto> SuggestAsync(string query)
        {
            // Truy vấn chỉ lấy gợi ý
            var suggestResponse = await _client.SearchAsync<ProductItemDto>(s => s
                .Index(IndexName)
                .Suggest(su => su
                    .Completion("product-suggest", c => c
                        .Field("suggestion")
                        .Prefix(query)
                        .Size(5)
                        .Fuzzy(f => f.Fuzziness(Fuzziness.Auto))
                    )
                )
            );

            // Gỡ lỗi chi tiết
            if (!suggestResponse.Suggest.ContainsKey("product-suggest"))
            {
                var suggestRawResponse = JsonSerializer.Serialize(suggestResponse.ApiCall.ResponseBodyInBytes != null 
                    ? System.Text.Encoding.UTF8.GetString(suggestResponse.ApiCall.ResponseBodyInBytes) 
                    : "No response body");
                var debugInfo = new
                {
                    Query = query,
                    SuggestResponse = JsonSerializer.Serialize(suggestResponse.Suggest),
                    RawElasticsearchResponse = suggestRawResponse
                };
                Console.WriteLine($"Debug Info: {JsonSerializer.Serialize(debugInfo, new JsonSerializerOptions { WriteIndented = true })}");
                throw new Exception($"Suggest response does not contain 'product-suggest'. Full response: {JsonSerializer.Serialize(suggestResponse.Suggest)}");
            }

            var suggestions = suggestResponse.Suggest["product-suggest"]
                .SelectMany(s => s.Options)
                .Select(o => o.Text)
                .ToList();

            // Truy vấn riêng để lấy productNames
            var searchResponse = await _client.SearchAsync<ProductItemDto>(s => s
                .Index(IndexName)
                .Query(q => q
                    .Bool(b => b
                        .Should(
                            sh => sh.Match(m => m
                                .Field("name")
                                .Query(query)
                                .Analyzer("vietnamese_search_analyzer")
                                .Fuzziness(Fuzziness.Auto)
                                .Boost(3.0)
                            ),
                            sh => sh.MultiMatch(m => m
                                .Query(query)
                                .Fields(new[] { "name^2", "variant_name", "name.multilingual" })
                                .Analyzer("vietnamese_search_analyzer")
                                .Type(TextQueryType.BestFields)
                                .Fuzziness(Fuzziness.Auto)
                                .MaxExpansions(10)
                            )
                        )
                        .MinimumShouldMatch(1)
                    )
                )
                .Source(src => src.Includes(f => f.Field("name")))
                .Size(5)
            );

            // Gỡ lỗi chi tiết
            var searchRawResponse = searchResponse.ApiCall.ResponseBodyInBytes != null 
                ? System.Text.Encoding.UTF8.GetString(searchResponse.ApiCall.ResponseBodyInBytes) 
                : "No response body";
            Console.WriteLine($"Raw Search Response: {searchRawResponse}");
            Console.WriteLine($"Search Response Hits: {JsonSerializer.Serialize(searchResponse.Hits)}");
            Console.WriteLine($"Search Response Source: {JsonSerializer.Serialize(searchResponse.Hits.Select(h => h.Source))}");

            var productNames = searchResponse.Hits
                .Select(h => h.Source.Name)
                .Where(name => !string.IsNullOrEmpty(name))
                .ToList();

            return new SuggestResponseDto
            {
                Suggestions = suggestions,
                ProductNames = productNames
            };
        }
    }
}