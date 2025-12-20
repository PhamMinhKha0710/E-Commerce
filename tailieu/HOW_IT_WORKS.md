# Cách Hoạt Động Của Hệ Thống "Bạn Có Thể Thích"

## Tổng Quan

Hệ thống "Bạn có thể thích" hoạt động theo quy trình 5 bước chính, từ khi người dùng truy cập trang web đến khi hiển thị sản phẩm gợi ý.

## Quy Trình Hoạt Động Chi Tiết

### Bước 1: Người Dùng Truy Cập Trang Web

```
Người dùng → Mở trang web → Component được render
```

**Ví dụ:**
- Người dùng mở trang chủ → Component `ProductTab` được render
- Người dùng xem chi tiết sản phẩm → Component `YouMightLike` hoặc `ProductRelated` được render

### Bước 2: Component Gọi Service

```
Component → categoryProductService.getProductsByCategory() → Kiểm tra Cache
```

**Code Flow:**
```typescript
// Trong component
useEffect(() => {
  const fetchProducts = async () => {
    const products = await categoryProductService.getProductsByCategory({
      categoryId: 5,
      productId: 123,  // Nếu đang xem sản phẩm
      limit: 6,
      useRecommendations: true
    });
    setProducts(products);
  };
  fetchProducts();
}, [categoryId, productId]);
```

**Kiểm tra Cache:**
- Service kiểm tra xem đã có kết quả trong cache chưa (cache 5 phút)
- Nếu có → Trả về ngay lập tức (không cần gọi API)
- Nếu không → Tiếp tục bước 3

### Bước 3: Service Gọi API Backend

```
categoryProductService → API Client → Backend API
```

**Request:**
```http
GET /api/recommendations/recommend?categoryId=5&productId=123&limit=6
Headers:
  Authorization: Bearer {token} (nếu đã đăng nhập)
```

**Backend nhận request:**
```csharp
// RecommendationsController.cs
[HttpGet("recommend")]
public async Task<IActionResult> GetRecommendations(
    [FromQuery] int? productId, 
    [FromQuery] int? categoryId, 
    [FromQuery] int limit = 6)
{
    var query = new GetRecommendationsQuery
    {
        ProductId = productId,
        CategoryId = categoryId,
        Limit = limit
    };
    var products = await _mediator.Send(query);
    return Ok(products);
}
```

### Bước 4: Backend Xử Lý Thuật Toán (GetRecommendationQueryHandler)

#### 4.1. Kiểm Tra Cache Redis

```
Handler → Redis Cache → Có kết quả?
```

**Cache Key Format:**
```
recommend:{userId}:{productId}:{categoryId}
```

**Ví dụ:**
- `recommend:0:123:5` (user chưa đăng nhập, productId=123, categoryId=5)
- `recommend:456:123:5` (userId=456, productId=123, categoryId=5)

**Nếu có cache:**
- Trả về kết quả ngay (cache 6 giờ)
- Bỏ qua các bước tính toán

**Nếu không có cache:**
- Tiếp tục tính toán

#### 4.2. Thu Thập Dữ Liệu Từ 3 Nguồn

Backend chạy **song song** 3 thuật toán:

```
┌─────────────────────────────────────────────────┐
│  GetPopularityBasedAsync()                      │
│  - Lấy sản phẩm bán chạy nhất                   │
│  - Dựa trên thống kê views, sales, ratings      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  GetContentBasedAsync()                         │
│  - Tìm sản phẩm tương tự                       │
│  - Dựa trên ProductSimilarity table             │
│  - Cosine similarity của feature vectors        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  GetCollaborativeBasedAsync()                   │
│  - Phân tích hành vi người dùng tương tự        │
│  - Dựa trên UserViewHistory                     │
│  - Chỉ hoạt động nếu có đủ dữ liệu (≥50 views) │
└─────────────────────────────────────────────────┘
```

**Chi tiết từng thuật toán:**

##### A. Popularity-Based (Độ Phổ Biến)

```csharp
// Lấy từ PopularityStatRepository
var products = await _popularityStatRepository
    .GetPopularProductsAsync(categoryId, 10);

// Nếu chưa có thống kê, lấy sản phẩm trong category
if (!products.Any() && categoryId.HasValue)
{
    products = await _productRepository
        .GetByCategoryIdAsync(categoryId.Value, 10);
}
```

**Kết quả:** Danh sách 10 sản phẩm phổ biến nhất

##### B. Content-Based (Dựa Trên Nội Dung)

```csharp
// Nếu có productId, tìm sản phẩm tương tự
if (productId.HasValue)
{
    var similar = await _productSimilarityRepository
        .GetSimilarProductsAsync(new List<int> { productId.Value }, 15);
    
    // Ưu tiên sản phẩm cùng category
    if (categoryId.HasValue)
    {
        var sameCategory = similar
            .Where(p => p.ProductCategoryId == categoryId.Value)
            .ToList();
        var otherCategory = similar
            .Where(p => p.ProductCategoryId != categoryId.Value)
            .Take(5)
            .ToList();
        results.AddRange(sameCategory);
        results.AddRange(otherCategory);
    }
}

// Nếu user đã đăng nhập, dùng lịch sử xem
if (userId.HasValue)
{
    var viewed = await _userViewHistoryRepository
        .GetViewedProductIdsAsync(userId.Value);
    var similar = await _productSimilarityRepository
        .GetSimilarProductsAsync(viewed.Take(3).ToList(), 15);
    results.AddRange(similar);
}
```

**Kết quả:** Danh sách 15 sản phẩm tương tự về đặc tính

**Cách tính Product Similarity:**

1. **Xây dựng Feature Vector:**
```
Sản phẩm A:
  - Category: cat:5
  - Brand: brand:12
  - Price bucket: price_bucket:6
  - Name tokens: name:iphone, name:14, name:pro, name:max

Sản phẩm B:
  - Category: cat:5
  - Brand: brand:12
  - Price bucket: price_bucket:6
  - Name tokens: name:iphone, name:15, name:pro, name:max
```

2. **Tính Cosine Similarity:**
```
similarity = dot_product(vecA, vecB) / (magnitude(vecA) * magnitude(vecB))
```

3. **Lưu vào Database:**
- Bảng `ProductSimilarity` lưu top 20 sản phẩm tương tự nhất
- Được tính toán định kỳ qua endpoint `/api/recommendations/update-similarities`

##### C. Collaborative Filtering (Lọc Hợp Tác)

```csharp
// Chỉ hoạt động nếu có đủ dữ liệu
if (!userId.HasValue || await _userViewHistoryRepository.GetCountAsync() < 50)
    return new List<Product>();

// Lấy sản phẩm user đã xem
var viewedProductIds = await _userViewHistoryRepository
    .GetViewedProductIdsAsync(userId.Value);

// Tìm sản phẩm tương tự dựa trên similarity
var similar = await _productSimilarityRepository
    .GetSimilarProductsAsync(viewedProductIds, 15);
```

**Kết quả:** Danh sách 15 sản phẩm mà người dùng tương tự đã xem/mua

#### 4.3. Kết Hợp Kết Quả (Hybrid System)

**Tính điểm tổng hợp cho mỗi sản phẩm:**

```csharp
// Xác định trọng số
double wContent, wPopular, wCollaborative;

if (categoryId.HasValue)
{
    // Khi có categoryId: Ưu tiên content và popularity
    wContent = 0.45;      // 45%
    wPopular = 0.35;     // 35%
    wCollaborative = 0.2; // 20% (nếu có)
}
else
{
    // Khi không có categoryId: Cân bằng hơn
    wContent = 0.35;      // 35%
    wPopular = 0.25;      // 25%
    wCollaborative = 0.4; // 40% (nếu có)
}

// Tính điểm cho mỗi sản phẩm
foreach (var product in allProducts)
{
    double score = 0;
    
    if (contentProducts.Contains(product))
        score += wContent;
    
    if (popularProducts.Contains(product))
        score += wPopular;
    
    if (collaborativeProducts.Contains(product))
        score += wCollaborative;
    
    // Bonus nếu cùng category
    if (categoryId.HasValue && product.ProductCategoryId == categoryId.Value)
        score += 0.1;
    
    combinedScores[product.Id] = score;
}
```

**Ví dụ tính điểm:**

```
Sản phẩm X:
  - Có trong content-based: +0.45
  - Có trong popularity-based: +0.35
  - Cùng category: +0.1
  → Tổng điểm: 0.9

Sản phẩm Y:
  - Có trong content-based: +0.45
  - Có trong collaborative: +0.2
  - Khác category: +0
  → Tổng điểm: 0.65

Sản phẩm Z:
  - Có trong popularity-based: +0.35
  - Cùng category: +0.1
  → Tổng điểm: 0.45
```

**Sắp xếp theo điểm:**
```csharp
var sortedProductIds = combinedScores
    .OrderByDescending(x => x.Value)  // Sắp xếp giảm dần
    .Select(x => x.Key)
    .ToList();
```

#### 4.4. Fallback Logic (Đảm Bảo Đủ Sản Phẩm)

Nếu sau khi tính toán chưa đủ 7 sản phẩm:

**Bước 1:** Lấy thêm sản phẩm phổ biến
```csharp
var additionalPopular = await _popularityStatRepository
    .GetPopularProductsAsync(null, remainingCount);
```

**Bước 2:** Lấy từ danh mục liên quan
```csharp
var relatedCategories = await _productRepository
    .GetRelatedCategoriesAsync(categoryId.Value);
foreach (var catId in relatedCategories)
{
    var relatedProducts = await _productRepository
        .GetByCategoryIdAsync(catId, remainingCount);
}
```

**Bước 3:** Lấy sản phẩm ngẫu nhiên
```csharp
var randomProducts = await _productRepository
    .GetRandomProductsAsync(remainingCount);
```

#### 4.5. Format Dữ Liệu Trả Về

```csharp
foreach (var id in sortedProductIds.Take(limit))
{
    var product = await _productRepository.GetByIdAsync(id);
    var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
    
    // Tính discount
    string discount = null;
    if (defaultItem.OldPrice > defaultItem.Price && defaultItem.OldPrice > 0)
    {
        var discountPercent = Math.Round(
            ((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice) * 100
        );
        discount = $"{discountPercent}%";
    }
    
    result.Add(new ProductRecommendationDto
    {
        CategoryId = product.ProductCategoryId,
        ProductId = product.Id,
        ProductName = product.Name,
        Href = $"/products/{product.Id}-{product.Slug}",
        Slug = product.Slug,
        ImageUrl = defaultItem.ImageUrl ?? primaryImage,
        Price = $"{defaultItem.Price:N0} {product.Currency}",
        ComparePrice = defaultItem.OldPrice > 0 
            ? $"{defaultItem.OldPrice:N0} {product.Currency}" 
            : null,
        Discount = discount,
        HasVariations = product.HasVariation,
        Contact = defaultItem.Price <= 0,
        ProductItemId = defaultItem.Id
    });
}
```

#### 4.6. Lưu Vào Cache Redis

```csharp
var resultJson = JsonSerializer.Serialize(result);
await _redisService.SetAsync(cacheKey, resultJson, TimeSpan.FromHours(6));
```

### Bước 5: Frontend Nhận Và Hiển Thị

```
API Response → Service → Component → Render UI
```

**Response từ API:**
```json
[
  {
    "categoryId": 5,
    "productId": 456,
    "productName": "iPhone 15 Pro Max",
    "href": "/products/456-iphone-15-pro-max",
    "slug": "iphone-15-pro-max",
    "imageUrl": "https://...",
    "price": "34.000.000 VND",
    "comparePrice": "36.000.000 VND",
    "discount": "6%",
    "hasVariations": true,
    "contact": false,
    "productItemId": 789
  },
  ...
]
```

**Service xử lý:**
```typescript
// categoryProductService.ts
const data = response.data;
return data.map((item: any) => this.mapApiProductToCategoryProduct(item));
```

**Component hiển thị:**
```tsx
// YouMightLike.tsx hoặc ProductTab.tsx
{products.map((product) => (
  <SwiperSlide key={product.productId}>
    <div className="item_product_main">
      <Image src={product.imageUrl} alt={product.productName} />
      <h3>{product.productName}</h3>
      <div className="price-box">
        <span>{product.price}</span>
        {product.comparePrice && (
          <span className="compare-price">{product.comparePrice}</span>
        )}
      </div>
      {product.discount && (
        <span className="smart">{product.discount}</span>
      )}
    </div>
  </SwiperSlide>
))}
```

## Sơ Đồ Luồng Hoạt Động

```
┌─────────────┐
│   User      │
│  Truy cập   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Component     │
│  (ProductTab/   │
│  YouMightLike)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────┐
│  Service        │─────▶│  Cache?  │
│  (categoryProd) │      └────┬─────┘
└──────┬──────────┘           │
       │                      │ Có → Trả về ngay
       │ Không                │
       ▼                      │
┌─────────────────┐           │
│   API Client    │           │
│   (axios)       │           │
└──────┬──────────┘           │
       │                      │
       ▼                      │
┌─────────────────┐           │
│  Backend API    │           │
│  /recommend     │           │
└──────┬──────────┘           │
       │                      │
       ▼                      │
┌─────────────────┐           │
│  Query Handler  │           │
│  (GetRecommend) │           │
└──────┬──────────┘           │
       │                      │
       ▼                      │
┌─────────────────┐           │
│  Redis Cache?   │───────────┘
└──────┬──────────┘
       │ Không
       ▼
┌─────────────────────────────────┐
│  Chạy 3 Thuật Toán Song Song    │
│  ┌──────────┐  ┌──────────┐   │
│  │Popularity│  │ Content  │   │
│  └────┬─────┘  └────┬──────┘   │
│       │            │           │
│       └──────┬─────┘           │
│              │                 │
│       ┌──────▼──────┐          │
│       │Collaborative│          │
│       └──────┬──────┘          │
└──────────────┼─────────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Kết Hợp & Tính Điểm         │
│  (Hybrid System)             │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Sắp Xếp Theo Điểm           │
│  (OrderByDescending)          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Fallback (nếu chưa đủ)      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Format & Lưu Cache Redis    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Trả Về JSON Response        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Frontend Nhận & Hiển Thị    │
└──────────────────────────────┘
```

## Ví Dụ Cụ Thể

### Scenario 1: Người dùng xem iPhone 14 Pro Max

**Input:**
- `productId = 123` (iPhone 14 Pro Max)
- `categoryId = 5` (Điện thoại Smartphone)
- `userId = 456` (Đã đăng nhập)

**Quy trình:**

1. **Content-Based:**
   - Tìm trong `ProductSimilarity` table
   - Tìm thấy: iPhone 15 Pro Max, iPhone 13 Pro Max, Samsung Galaxy S24 Ultra
   - Ưu tiên cùng category (Điện thoại)

2. **Popularity-Based:**
   - Lấy top 10 điện thoại bán chạy nhất
   - Kết quả: iPhone 15 Pro Max, Samsung Galaxy S24, Xiaomi 14 Pro...

3. **Collaborative:**
   - Xem lịch sử user 456 đã xem: iPhone 13, Samsung Galaxy S23
   - Tìm sản phẩm tương tự: iPhone 14, iPhone 15, Samsung Galaxy S24

4. **Kết hợp:**
   ```
   iPhone 15 Pro Max:
     - Content: ✓ (+0.45)
     - Popularity: ✓ (+0.35)
     - Collaborative: ✓ (+0.2)
     - Cùng category: ✓ (+0.1)
     → Điểm: 1.1 (Cao nhất)
   
   Samsung Galaxy S24:
     - Content: ✗
     - Popularity: ✓ (+0.35)
     - Collaborative: ✓ (+0.2)
     - Cùng category: ✓ (+0.1)
     → Điểm: 0.65
   ```

5. **Kết quả:** Top 6 sản phẩm được sắp xếp theo điểm

### Scenario 2: Người dùng chưa đăng nhập, chỉ có categoryId

**Input:**
- `categoryId = 5` (Điện thoại Smartphone)
- `productId = null`
- `userId = null`

**Quy trình:**

1. **Content-Based:** Không chạy (không có productId)
2. **Popularity-Based:** Lấy top 10 điện thoại bán chạy
3. **Collaborative:** Không chạy (chưa đăng nhập)
4. **Kết hợp:**
   - Chỉ có Popularity-Based
   - Trọng số: Popularity = 50%
5. **Kết quả:** Top 6 điện thoại bán chạy nhất

## Tối Ưu Hóa Hiệu Suất

### 1. Caching Strategy

**Frontend Cache (5 phút):**
- Tránh gọi API nhiều lần
- Cache key bao gồm tất cả parameters

**Backend Redis Cache (6 giờ):**
- Tránh tính toán lại thuật toán
- Cache key: `recommend:{userId}:{productId}:{categoryId}`

**Product Similarity Cache:**
- Tính toán định kỳ (không real-time)
- Lưu trong database và Redis

### 2. Lazy Loading

- Component chỉ load khi vào viewport (`useInView`)
- Images lazy load với Next.js Image component

### 3. Batch Processing

- Tính toán similarity theo batch
- Không block request của user

## Kết Luận

Hệ thống "Bạn có thể thích" hoạt động theo quy trình 5 bước, sử dụng Hybrid Recommendation System để kết hợp 3 thuật toán chính. Với caching và tối ưu hóa hiệu suất, hệ thống có thể đưa ra gợi ý chính xác và nhanh chóng cho người dùng.






