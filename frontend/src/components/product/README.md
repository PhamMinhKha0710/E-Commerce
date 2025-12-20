# Components Sản Phẩm - Hướng Dẫn Sử Dụng

## Tổng Quan

Thư mục này chứa các component liên quan đến hiển thị sản phẩm và hệ thống khuyến nghị "Bạn có thể thích".

## Components

### 1. ProductTab.tsx

**Mô tả:** Component hiển thị "Bạn có thể thích" với các tab danh mục trên trang chủ.

**Vị trí sử dụng:** Trang chủ

**Tính năng:**
- Hiển thị sản phẩm theo từng tab danh mục
- Sử dụng Hybrid Recommendation System
- Tự động fetch sản phẩm khi tab được chọn
- Cache kết quả để tối ưu hiệu suất

**Cách sử dụng:**
```tsx
import ProductTab from '@/components/product/ProductTab';

<ProductTab />
```

### 2. YouMightLike.tsx

**Mô tả:** Component linh hoạt để hiển thị sản phẩm gợi ý ở bất kỳ đâu trong ứng dụng.

**Tính năng:**
- Hỗ trợ nhiều loại recommendation (popularity, content-based, collaborative, hybrid)
- Có thể sử dụng với hoặc không có productId/categoryId
- Hiển thị dạng carousel với Swiper
- Tùy chỉnh title, limit, và mô tả

**Props:**
```typescript
interface YouMightLikeProps {
  productId?: number;           // ID sản phẩm đang xem (cho content-based)
  categoryId?: number;          // ID danh mục
  categorySlug?: string;        // Slug danh mục
  title?: string;               // Tiêu đề (mặc định: "Bạn có thể thích")
  limit?: number;               // Số lượng sản phẩm (mặc định: 6)
  showDescription?: boolean;   // Hiển thị mô tả thuật toán (mặc định: false)
}
```

**Ví dụ sử dụng:**

1. Trên trang chi tiết sản phẩm:
```tsx
import YouMightLike from '@/components/product/YouMightLike';

<YouMightLike 
  productId={123}
  categoryId={5}
  title="Sản phẩm tương tự"
  limit={6}
  showDescription={true}
/>
```

2. Trên trang danh mục:
```tsx
<YouMightLike 
  categoryId={5}
  categorySlug="dien-thoai-smartphone"
  title="Sản phẩm nổi bật"
  limit={8}
/>
```

3. Trang chủ hoặc trang khác:
```tsx
<YouMightLike 
  title="Gợi ý cho bạn"
  limit={12}
/>
```

## Service: categoryProductService.ts

Service chính để fetch sản phẩm từ API Recommendations.

**Các phương thức:**

### `getProductsByCategory(options)`

Fetch sản phẩm theo category với nhiều tùy chọn.

```typescript
const products = await categoryProductService.getProductsByCategory({
  categorySlug: 'dien-thoai-smartphone',
  categoryId: 5,
  productId: 123,
  limit: 10,
  useRecommendations: true,
  recommendationType: 'hybrid'
});
```

**Options:**
- `categorySlug?: string` - Slug danh mục
- `categoryName?: string` - Tên danh mục
- `categoryId?: number` - ID danh mục
- `limit?: number` - Số lượng (mặc định: 10)
- `useRecommendations?: boolean` - Dùng API recommendations (mặc định: true)
- `productId?: number` - ID sản phẩm đang xem
- `recommendationType?: 'popularity' | 'content' | 'collaborative' | 'hybrid'` - Loại recommendation

**Cache:**
- Tự động cache kết quả trong 5 phút
- Cache key bao gồm tất cả parameters để đảm bảo tính chính xác

## Thuật Toán Khuyến Nghị

Hệ thống sử dụng **Hybrid Recommendation System** kết hợp:

1. **Content-Based Filtering**: Dựa trên đặc tính sản phẩm (category, brand, price, name)
2. **Popularity-Based Filtering**: Dựa trên độ phổ biến (views, sales, ratings)
3. **Collaborative Filtering**: Dựa trên hành vi người dùng tương tự

Xem thêm chi tiết trong file `RECOMMENDATION_SYSTEM.md` ở thư mục gốc.

## Best Practices

1. **Sử dụng productId khi có thể**: Để có gợi ý chính xác hơn, luôn truyền `productId` nếu đang ở trang chi tiết sản phẩm.

2. **Sử dụng categoryId/categorySlug**: Để giới hạn kết quả trong một danh mục cụ thể.

3. **Cache**: Service tự động cache, không cần implement thêm.

4. **Error Handling**: Component tự xử lý lỗi và hiển thị thông báo phù hợp.

5. **Loading State**: Component tự quản lý loading state.

## Tùy Chỉnh

### Thay đổi số lượng sản phẩm:
```tsx
<YouMightLike limit={12} />
```

### Thay đổi tiêu đề:
```tsx
<YouMightLike title="Sản phẩm bạn có thể quan tâm" />
```

### Hiển thị mô tả thuật toán:
```tsx
<YouMightLike showDescription={true} />
```

## Troubleshooting

### Không có sản phẩm hiển thị:
- Kiểm tra xem có sản phẩm trong category không
- Kiểm tra API endpoint có hoạt động không
- Xem console log để debug

### Sản phẩm không phù hợp:
- Đảm bảo đã truyền đúng `productId` hoặc `categoryId`
- Kiểm tra xem ProductSimilarity đã được tính toán chưa (gọi `/api/recommendations/update-similarities`)

### Performance:
- Cache tự động hoạt động, không cần lo lắng
- Nếu vẫn chậm, kiểm tra Redis cache có hoạt động không








