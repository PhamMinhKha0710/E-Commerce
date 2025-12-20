# Troubleshooting - Hệ Thống "Bạn Có Thể Thích"

## Vấn Đề: Không Load Được Sản Phẩm

### Các Nguyên Nhân Có Thể

#### 1. CategoryId Không Tìm Được

**Triệu chứng:**
- Console log: `Cannot find categoryId for slug "..." or name "..."`
- Component hiển thị: "Chưa có sản phẩm nào trong danh mục này"

**Cách kiểm tra:**
1. Mở Developer Console (F12)
2. Tìm log: `[CategoryProductService] Finding categoryId`
3. Kiểm tra xem category có tồn tại không

**Giải pháp:**
- Kiểm tra slug/name category có đúng không
- Kiểm tra API `/api/Categories` có trả về category này không
- Thêm category vào `slugToCategoryName` map trong `categoryService.ts` nếu cần

#### 2. API Recommendations Không Trả Về Dữ Liệu

**Triệu chứng:**
- Console log: `No recommendations returned from API`
- Component hiển thị: "Chưa có sản phẩm nào trong danh mục này"

**Cách kiểm tra:**
1. Mở Network tab trong Developer Tools
2. Tìm request: `GET /api/recommendations/recommend`
3. Kiểm tra response:
   - Status code: 200?
   - Response body: có dữ liệu không?

**Giải pháp:**
- Kiểm tra backend API có hoạt động không
- Kiểm tra Redis cache có hoạt động không
- Kiểm tra database có sản phẩm trong category không
- Gọi `/api/recommendations/update-similarities` để cập nhật similarity

#### 3. Backend Không Có Sản Phẩm Trong Category

**Triệu chứng:**
- API trả về status 200 nhưng mảng rỗng `[]`
- Console log: `Received 0 recommendations`

**Cách kiểm tra:**
```sql
-- Kiểm tra có sản phẩm trong category không
SELECT COUNT(*) FROM Products WHERE ProductCategoryId = {categoryId};
```

**Giải pháp:**
- Thêm sản phẩm vào category
- Hoặc sử dụng category khác có sản phẩm

#### 4. Lỗi Kết Nối API

**Triệu chứng:**
- Console log: `Error fetching recommendations`
- Network tab: Request failed hoặc timeout

**Cách kiểm tra:**
1. Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env`
2. Kiểm tra backend có đang chạy không
3. Kiểm tra CORS settings

**Giải pháp:**
- Đảm bảo backend đang chạy
- Kiểm tra URL API đúng
- Kiểm tra CORS configuration

## Các Bước Debug

### Bước 1: Kiểm Tra Console Logs

Mở Developer Console và tìm các log sau:

```
[ProductTab] Fetching products for tab: tab-1, slug: phu-kien-thoi-trang-nu, label: Phụ kiện thời trang nữ
[CategoryProductService] Finding categoryId for slug: "phu-kien-thoi-trang-nu", name: "Phụ kiện thời trang nữ"
[CategoryProductService] Found category by slug: 123 - Phụ kiện thời trang nữ
[CategoryProductService] Fetching recommendations with params: {categoryId: 123, limit: 10}
[CategoryProductService] Received 6 recommendations
[ProductTab] Fetched 6 products for tab tab-1 (recommendations)
```

### Bước 2: Kiểm Tra Network Requests

1. Mở Network tab
2. Tìm request: `/api/recommendations/recommend?categoryId=...`
3. Kiểm tra:
   - Request URL đúng chưa?
   - Status code là gì?
   - Response body có dữ liệu không?

### Bước 3: Kiểm Tra Backend

**Test API trực tiếp:**
```bash
# Test với categoryId
curl "http://localhost:5130/api/recommendations/recommend?categoryId=5&limit=6"

# Test không có categoryId
curl "http://localhost:5130/api/recommendations/recommend?limit=6"
```

**Kiểm tra logs backend:**
- Xem logs trong console backend
- Kiểm tra có lỗi gì không

### Bước 4: Kiểm Tra Database

```sql
-- Kiểm tra category có tồn tại không
SELECT * FROM ProductCategories WHERE Id = {categoryId};

-- Kiểm tra có sản phẩm trong category không
SELECT COUNT(*) FROM Products WHERE ProductCategoryId = {categoryId};

-- Kiểm tra ProductSimilarity đã được tính chưa
SELECT COUNT(*) FROM ProductSimilarities;
```

## Giải Pháp Tự Động (Fallback)

Hệ thống đã được cải thiện với **fallback mechanism**:

1. **Nếu Recommendations API không trả về sản phẩm:**
   - Tự động fallback sang API Products trực tiếp
   - Vẫn hiển thị sản phẩm trong category

2. **Nếu không tìm được categoryId:**
   - Log warning chi tiết
   - Component hiển thị thông báo phù hợp

## Các Lệnh Hữu Ích

### Cập Nhật Product Similarity

```bash
# Gọi API để cập nhật similarity
curl -X POST "http://localhost:5130/api/recommendations/update-similarities"
```

### Xóa Cache

**Frontend:**
- Clear browser cache
- Hoặc đợi 5 phút (cache tự động expire)

**Backend:**
- Xóa Redis cache nếu cần
- Hoặc đợi 6 giờ (cache tự động expire)

### Test Component Trực Tiếp

```tsx
// Test với categoryId trực tiếp
<YouMightLike 
  categoryId={5}  // Dùng ID trực tiếp thay vì slug
  limit={6}
/>
```

## Checklist Debug

- [ ] Backend API đang chạy
- [ ] Redis đang hoạt động
- [ ] Database có sản phẩm trong category
- [ ] CategoryId được tìm thấy (check console logs)
- [ ] API Recommendations trả về dữ liệu (check Network tab)
- [ ] ProductSimilarity đã được tính toán
- [ ] Không có lỗi CORS
- [ ] NEXT_PUBLIC_API_URL đúng

## Liên Hệ Hỗ Trợ

Nếu vẫn không giải quyết được, cung cấp thông tin sau:

1. Console logs đầy đủ
2. Network requests (screenshot)
3. Backend logs
4. Database query results
5. Environment variables (ẩn sensitive data)






