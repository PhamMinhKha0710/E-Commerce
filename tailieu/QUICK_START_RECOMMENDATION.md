# Hướng Dẫn Nhanh - Hệ Thống "Bạn Có Thể Thích"

## Tóm Tắt Ngắn Gọn

Hệ thống "Bạn có thể thích" sử dụng **3 thuật toán** kết hợp để gợi ý sản phẩm:

1. **Popularity-Based** (Độ phổ biến) - Sản phẩm bán chạy
2. **Content-Based** (Dựa trên nội dung) - Sản phẩm tương tự
3. **Collaborative Filtering** (Lọc hợp tác) - Dựa trên hành vi người dùng tương tự

## Quy Trình Đơn Giản

```
1. User truy cập trang
   ↓
2. Component gọi Service
   ↓
3. Service kiểm tra Cache (5 phút)
   ├─ Có → Trả về ngay
   └─ Không → Gọi API Backend
       ↓
4. Backend kiểm tra Redis Cache (6 giờ)
   ├─ Có → Trả về ngay
   └─ Không → Tính toán:
       ├─ Popularity-Based
       ├─ Content-Based  
       └─ Collaborative
       ↓
5. Kết hợp 3 kết quả → Tính điểm → Sắp xếp
   ↓
6. Trả về top N sản phẩm
   ↓
7. Frontend hiển thị
```

## Cách Sử Dụng Component

### 1. Trang Chi Tiết Sản Phẩm

```tsx
import YouMightLike from '@/components/product/YouMightLike';

<YouMightLike 
  productId={123}        // ID sản phẩm đang xem
  categoryId={5}         // ID danh mục
  title="Sản phẩm tương tự"
  limit={6}
/>
```

### 2. Trang Danh Mục

```tsx
<YouMightLike 
  categoryId={5}
  categorySlug="dien-thoai-smartphone"
  title="Sản phẩm nổi bật"
  limit={8}
/>
```

### 3. Trang Chủ (Đã có sẵn)

```tsx
import ProductTab from '@/components/product/ProductTab';

<ProductTab />  // Tự động hiển thị với tabs
```

## Các File Tài Liệu

1. **RECOMMENDATION_SYSTEM.md** - Tài liệu chi tiết về hệ thống
2. **HOW_IT_WORKS.md** - Giải thích cách hoạt động từng bước
3. **components/product/README.md** - Hướng dẫn sử dụng components

## API Endpoint

```
GET /api/recommendations/recommend
Query Parameters:
  - productId (optional): ID sản phẩm đang xem
  - categoryId (optional): ID danh mục
  - limit (default: 6): Số lượng sản phẩm
```

## Ví Dụ Response

```json
[
  {
    "productId": 456,
    "productName": "iPhone 15 Pro Max",
    "price": "34.000.000 VND",
    "comparePrice": "36.000.000 VND",
    "discount": "6%",
    "imageUrl": "https://...",
    "href": "/products/456-iphone-15-pro-max"
  }
]
```

## Tính Năng Chính

✅ **Hybrid System** - Kết hợp 3 thuật toán  
✅ **Caching** - Cache 5 phút (frontend) + 6 giờ (backend)  
✅ **Flexible** - Hoạt động với hoặc không có productId/categoryId  
✅ **Performance** - Lazy loading, optimized queries  
✅ **User Experience** - Loading states, error handling  

## Troubleshooting

**Không có sản phẩm hiển thị?**
- Kiểm tra có sản phẩm trong category không
- Kiểm tra API endpoint có hoạt động không
- Xem console log để debug

**Sản phẩm không phù hợp?**
- Đảm bảo đã truyền đúng productId/categoryId
- Kiểm tra ProductSimilarity đã được tính toán chưa
- Gọi `/api/recommendations/update-similarities` để cập nhật

## Next Steps

1. Đọc **HOW_IT_WORKS.md** để hiểu chi tiết quy trình
2. Đọc **RECOMMENDATION_SYSTEM.md** để hiểu về thuật toán
3. Xem **components/product/README.md** để biết cách sử dụng






