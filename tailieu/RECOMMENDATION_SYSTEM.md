# Hệ Thống Khuyến Nghị "Bạn Có Thể Thích"

## Tổng Quan

Tính năng "Bạn có thể thích" (You Might Also Like) là một hệ thống khuyến nghị sản phẩm thông minh được triển khai trong nền tảng thương mại điện tử này. Hệ thống sử dụng **Hybrid Recommendation System** kết hợp ba thuật toán chính để đưa ra gợi ý sản phẩm chính xác và phù hợp nhất cho từng người dùng.

## Mục Đích

### 1. Tăng Tỷ Lệ Chuyển Đổi và Doanh Số
- Khuyến khích người dùng mua thêm sản phẩm ngoài những gì họ đang xem
- Tăng giá trị đơn hàng trung bình (Average Order Value - AOV)
- Hỗ trợ chiến lược cross-selling và up-selling

### 2. Cải Thiện Trải Nghiệm Người Dùng
- Giúp khách hàng khám phá sản phẩm mới một cách nhanh chóng
- Cá nhân hóa trải nghiệm mua sắm
- Tăng sự hài lòng và lòng trung thành của khách hàng

### 3. Tăng Thời Gian Lưu Lại Trên Trang
- Khuyến khích người dùng duyệt thêm các trang chi tiết sản phẩm
- Cải thiện các chỉ số SEO và hiệu suất nền tảng

## Kiến Trúc Hệ Thống

### Backend Architecture

Hệ thống được xây dựng trên nền tảng **.NET** với kiến trúc Clean Architecture:

```
Ecommerce.Api/
  └── Controllers/
      └── RecommendationsController.cs  # API endpoint

Ecommerce.Application/
  └── QueryHandlers/
      └── Recommendations/
          └── GetRecommendationQueryHandler.cs  # Logic xử lý chính

Ecommerce.Infrastructure/
  └── Services/
      └── ProductSimilarityService.cs  # Tính toán độ tương đồng
```

### Frontend Architecture

```
frontend/src/
  ├── components/
  │   └── product/
  │       └── ProductTab.tsx  # Component "Bạn có thể thích" với tabs
  ├── app/products/
  │   └── ProductRelated.tsx  # Component sản phẩm liên quan
  └── services/
      └── categoryProductService.ts  # Service fetch sản phẩm
```

## Các Thuật Toán Khuyến Nghị

### 1. Popularity-Based Filtering (Lọc Dựa Trên Độ Phổ Biến)

**Cách hoạt động:**
- Phân tích thống kê độ phổ biến của sản phẩm dựa trên:
  - Số lượt xem
  - Số lượt mua
  - Đánh giá và rating
  - Tỷ lệ chuyển đổi
- Đề xuất các sản phẩm bán chạy nhất trong danh mục

**Ưu điểm:**
- Đơn giản, hiệu quả với người dùng mới (cold start problem)
- Không cần dữ liệu cá nhân hóa
- Phù hợp cho các sản phẩm trending

**Triển khai:**
```csharp
private async Task<List<Product>> GetPopularityBasedAsync(int? categoryId, CancellationToken cancellationToken)
{
    // Lấy sản phẩm phổ biến từ PopularityStatRepository
    products = await _popularityStatRepository.GetPopularProductsAsync(categoryId, 10);
    
    // Fallback: Lấy sản phẩm trong category nếu chưa có thống kê
    if ((products == null || !products.Any()) && categoryId.HasValue)
    {
        products = await _productRepository.GetByCategoryIdAsync(categoryId.Value, 10, cancellationToken);
    }
}
```

### 2. Content-Based Filtering (Lọc Dựa Trên Nội Dung)

**Cách hoạt động:**
- Xây dựng profile sản phẩm dựa trên đặc tính:
  - **Category ID**: Danh mục sản phẩm
  - **Brand ID**: Thương hiệu
  - **Price Bucket**: Khoảng giá (sử dụng logarithmic scale)
  - **Product Name**: Từ khóa trong tên sản phẩm (tokenization)
- Tính độ tương đồng giữa các sản phẩm bằng **Cosine Similarity**
- Lưu trữ kết quả trong bảng `ProductSimilarity` để tối ưu hiệu suất

**Vector đặc trưng:**
```csharp
private Dictionary<string, double> BuildFeatureVector(Product product)
{
    var vector = new Dictionary<string, double>();
    
    // Category
    Add($"cat:{product.ProductCategoryId}");
    
    // Brand
    if (product.BrandId > 0)
        Add($"brand:{product.BrandId}");
    
    // Price bucket (logarithmic scale)
    var price = (double)defaultItem.Price;
    var bucket = price <= 0 ? 0 : (int)Math.Clamp(Math.Log10(price + 1), 0, 8);
    Add($"price_bucket:{bucket}");
    
    // Product name tokens
    foreach (var token in Tokenize(product.Name))
    {
        Add($"name:{token}", 1);
    }
}
```

**Tính toán Cosine Similarity:**
```csharp
private double CalculateCosineSimilarity(
    Dictionary<string, double> vec1,
    Dictionary<string, double> vec2)
{
    // Dot product
    var dot = vec1.Keys.Intersect(vec2.Keys)
        .Sum(key => vec1[key] * vec2[key]);
    
    // Magnitudes
    var mag1 = Math.Sqrt(vec1.Values.Sum(v => v * v));
    var mag2 = Math.Sqrt(vec2.Values.Sum(v => v * v));
    
    return mag1 * mag2 > 0 ? dot / (mag1 * mag2) : 0;
}
```

**Ưu điểm:**
- Hiệu quả với người dùng mới
- Không phụ thuộc vào dữ liệu từ người dùng khác
- Đề xuất sản phẩm tương tự về đặc tính

**Nhược điểm:**
- Có thể hạn chế sự đa dạng (filter bubble)
- Chỉ đề xuất sản phẩm quen thuộc

### 3. Collaborative Filtering (Lọc Hợp Tác)

**Cách hoạt động:**
- Phân tích hành vi của người dùng tương tự
- Sử dụng lịch sử xem sản phẩm (`UserViewHistory`)
- Đề xuất sản phẩm dựa trên sở thích của nhóm người dùng tương đồng

**Điều kiện kích hoạt:**
- Chỉ hoạt động khi có đủ dữ liệu (tối thiểu 50 lượt xem trong hệ thống)
- Yêu cầu người dùng đã đăng nhập và có lịch sử xem

**Triển khai:**
```csharp
private async Task<List<Product>> GetCollaborativeBasedAsync(int? userId, int? categoryId)
{
    if (!userId.HasValue || await _userViewHistoryRepository.GetCountAsync() < 50)
        return new List<Product>();

    // Lấy sản phẩm đã xem của người dùng
    var viewedProductIds = await _userViewHistoryRepository.GetViewedProductIdsAsync(userId.Value);
    
    // Tìm sản phẩm tương tự dựa trên similarity
    var similar = await _productSimilarityRepository.GetSimilarProductsAsync(viewedProductIds, 15);
    
    // Ưu tiên sản phẩm cùng category nếu có
    if (categoryId.HasValue && similar.Any())
    {
        var sameCategory = similar.Where(p => p.ProductCategoryId == categoryId.Value).ToList();
        var otherCategory = similar.Where(p => p.ProductCategoryId != categoryId.Value).Take(5).ToList();
        sameCategory.AddRange(otherCategory);
        return sameCategory;
    }
    
    return similar;
}
```

**Ưu điểm:**
- Khám phá sản phẩm mới mà người dùng chưa biết
- Dựa trên hành vi cộng đồng
- Cá nhân hóa cao

**Nhược điểm:**
- Gặp vấn đề cold start với người dùng/sản phẩm mới
- Có thể ưu tiên sản phẩm phổ biến

### 4. Hybrid System (Hệ Thống Lai)

**Cách hoạt động:**
Kết hợp cả ba thuật toán trên với trọng số động:

**Khi có CategoryId:**
- Content-based: 45-50%
- Popularity-based: 35-40%
- Collaborative: 0-20% (nếu có dữ liệu)

**Khi không có CategoryId:**
- Content-based: 35-40%
- Popularity-based: 25-50%
- Collaborative: 0-40% (nếu có dữ liệu)

**Tính điểm tổng hợp:**
```csharp
foreach (var product in allProducts)
{
    double score = 0;
    
    // Content-based score
    if (contentProducts.Contains(product))
    {
        score += wContent;
        // Bonus nếu cùng category
        if (request.CategoryId.HasValue && product.ProductCategoryId == request.CategoryId.Value)
            score += 0.1;
    }
    
    // Popularity score
    if (popularProducts.Contains(product))
    {
        score += wPopular;
        // Bonus nếu cùng category
        if (request.CategoryId.HasValue && product.ProductCategoryId == request.CategoryId.Value)
            score += 0.1;
    }
    
    // Collaborative score
    if (collaborativeProducts.Contains(product))
    {
        score += wCollaborative;
    }
    
    combinedScores[product.Id] = score;
}
```

**Fallback Logic:**
Đảm bảo luôn có tối thiểu 7 sản phẩm được đề xuất:
1. Lấy thêm sản phẩm phổ biến
2. Lấy sản phẩm từ danh mục liên quan
3. Lấy sản phẩm ngẫu nhiên (nếu vẫn chưa đủ)

## Quy Trình Hoạt Động

### 1. Thu Thập Dữ Liệu

**Dữ liệu rõ ràng (Explicit):**
- Ratings và reviews
- Wishlist
- Đánh giá sản phẩm

**Dữ liệu ngầm (Implicit):**
- Lịch sử xem sản phẩm (`UserViewHistory`)
- Lịch sử tìm kiếm (`UserSearch`)
- Hành vi mua hàng
- Thời gian xem trang

**Thuộc tính sản phẩm:**
- Category, Brand, Price
- Tên sản phẩm, mô tả
- Hình ảnh (có thể sử dụng cho image-based recommendation)

### 2. Lưu Trữ Dữ Liệu

- **Database**: SQL Server cho dữ liệu chính
- **Redis Cache**: Cache kết quả recommendation (6 giờ)
- **ProductSimilarity Table**: Lưu độ tương đồng đã tính toán

### 3. Xử Lý Và Phân Tích

**Tính toán Product Similarity:**
- Chạy định kỳ qua endpoint `/api/recommendations/update-similarities`
- Tính cosine similarity cho tất cả cặp sản phẩm
- Lưu top 20 sản phẩm tương tự nhất cho mỗi sản phẩm

**Caching Strategy:**
- Cache key format: `recommend:{userId}:{productId}:{categoryId}`
- Cache duration: 6 giờ
- Cache popularity: 6 giờ

### 4. Tạo Và Hiển Thị Đề Xuất

**API Endpoint:**
```
GET /api/recommendations/recommend
Query Parameters:
  - productId (optional): ID sản phẩm đang xem
  - categoryId (optional): ID danh mục
  - limit (default: 6): Số lượng sản phẩm đề xuất
```

**Response Format:**
```json
[
  {
    "categoryId": 1,
    "productId": 123,
    "productName": "Tên sản phẩm",
    "href": "/products/123-slug",
    "slug": "slug",
    "imageUrl": "url",
    "price": "100000 VND",
    "comparePrice": "120000 VND",
    "discount": "17%",
    "hasVariations": false,
    "contact": false,
    "productItemId": 456
  }
]
```

## Các Vị Trí Hiển Thị

### 1. Trang Chủ - "Bạn Có Thể Thích"

**Component:** `ProductTab.tsx`

**Đặc điểm:**
- Hiển thị theo tabs danh mục
- Mỗi tab hiển thị 10 sản phẩm
- Sử dụng API với `categoryId` và `useRecommendations: true`

**Các tab:**
- Phụ kiện thời trang nữ
- Chăm sóc da mặt
- Ngoại Vi
- Trang phục thể thao
- Chăm sóc cơ thể
- Điện thoại Smartphone
- Chăm sóc thú cưng
- Pin - Sạc dự phòng
- Dược mỹ phẩm

### 2. Trang Chi Tiết Sản Phẩm - "Sản Phẩm Cùng Loại"

**Component:** `ProductRelated.tsx`

**Đặc điểm:**
- Hiển thị 6 sản phẩm liên quan
- Sử dụng Swiper carousel
- Dựa trên `productId` và `categoryId` của sản phẩm đang xem
- Hỗ trợ wishlist integration

### 3. Trang Khác

**Component:** `RecommendProduct.tsx`

- Hiển thị 12 sản phẩm gợi ý chung
- Không yêu cầu context cụ thể

## Tối Ưu Hóa Hiệu Suất

### 1. Caching

- **Redis Cache**: Cache kết quả recommendation
- **In-memory Cache**: Cache trong `categoryProductService` (5 phút)
- **Database Indexing**: Index trên `ProductSimilarity` table

### 2. Lazy Loading

- Sử dụng `useInView` hook để chỉ load khi component vào viewport
- Lazy load images với Next.js Image component

### 3. Batch Processing

- Tính toán similarity theo batch
- Cập nhật similarity định kỳ (không real-time)

## Cải Tiến Tương Lai

### 1. Machine Learning Nâng Cao

- Sử dụng Deep Learning models (Neural Collaborative Filtering)
- Matrix Factorization với ALS (Alternating Least Squares)
- Sequence-based recommendation (RNN/LSTM)

### 2. Real-time Personalization

- Cập nhật recommendation theo thời gian thực
- Xử lý streaming data với Apache Kafka

### 3. Multi-armed Bandit

- A/B testing tự động
- Tối ưu hóa CTR (Click-Through Rate)

### 4. Image-Based Recommendation

- Sử dụng Computer Vision để tìm sản phẩm tương tự về hình ảnh
- Tích hợp với ImageSearchService hiện có

### 5. Context-Aware Recommendation

- Xem xét thời gian trong ngày, mùa, sự kiện
- Location-based recommendation

## Kết Luận

Hệ thống khuyến nghị "Bạn có thể thích" là một thành phần quan trọng trong nền tảng thương mại điện tử, giúp:
- Tăng doanh số và tỷ lệ chuyển đổi
- Cải thiện trải nghiệm người dùng
- Tối ưu hóa hiệu suất bán hàng

Với kiến trúc hybrid hiện tại, hệ thống đã đạt được sự cân bằng giữa độ chính xác, hiệu suất và khả năng mở rộng.






