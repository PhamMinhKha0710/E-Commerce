# Hướng Dẫn Thêm Sản Phẩm Mới - Admin Panel

## 📋 Tổng Quan

Hệ thống admin cho phép thêm sản phẩm mới thông qua giao diện web tại trang `/dashboard/products/add`. Quy trình bao gồm điền thông tin sản phẩm, thêm hình ảnh, và lưu vào hệ thống.

---

## 🚀 Các Bước Thực Hiện

### Bước 1: Truy Cập Trang Thêm Sản Phẩm

1. **Đăng nhập vào Admin Panel**
   - Truy cập: `http://localhost:3000/dashboard` (hoặc URL admin của bạn)
   - Đăng nhập với tài khoản admin

2. **Điều hướng đến trang thêm sản phẩm**
   - Cách 1: Vào menu **Sản phẩm** → Click nút **"Thêm sản phẩm mới"**
   - Cách 2: Truy cập trực tiếp: `http://localhost:3000/dashboard/products/add`

### Bước 2: Điền Thông Tin Cơ Bản

Trong phần **"Thông tin cơ bản"**, điền các trường bắt buộc:

#### ✅ Các trường bắt buộc:
- **Tên sản phẩm**: Tên đầy đủ của sản phẩm
  - Ví dụ: "iPhone 15 Pro Max 256GB"
  
- **Mã sản phẩm (SKU)**: Mã định danh duy nhất
  - Ví dụ: "IPHONE-15PM-256GB-BLACK"
  - Lưu ý: SKU phải là duy nhất trong hệ thống

- **Mô tả sản phẩm**: Mô tả chi tiết về sản phẩm
  - Có thể bao gồm: thông số kỹ thuật, tính năng, ưu điểm
  - Hỗ trợ HTML formatting

### Bước 3: Thêm Hình Ảnh Sản Phẩm

Trong phần **"Hình ảnh sản phẩm"**:

1. **Nhập URL hình ảnh**
   - Nhập URL của hình ảnh vào ô input
   - Ví dụ: `https://example.com/images/product1.jpg`

2. **Thêm hình ảnh**
   - Click nút **"Thêm"** để thêm hình ảnh vào danh sách
   - Có thể thêm nhiều hình ảnh (khuyến nghị: 3-5 hình)

3. **Xóa hình ảnh** (nếu cần)
   - Click nút **X** ở góc trên bên phải của hình ảnh

**Lưu ý:**
- Hình ảnh đầu tiên sẽ là hình ảnh chính của sản phẩm
- Hình ảnh nên có kích thước tối thiểu 800x800px
- Định dạng hỗ trợ: JPG, PNG, WebP

### Bước 4: Điền Thông Tin Giá & Tồn Kho

Trong phần **"Giá & Tồn kho"** (sidebar bên phải):

#### ✅ Các trường bắt buộc:
- **Giá bán (VND)**: Giá bán của sản phẩm
  - Ví dụ: `34900000` (34.900.000 VND)
  - Phải lớn hơn 0

- **Số lượng tồn kho**: Số lượng sản phẩm có sẵn
  - Ví dụ: `50`
  - Nếu = 0, sản phẩm sẽ tự động có status "Out of Stock"

#### ⚪ Trường tùy chọn:
- **Giá khuyến mãi (VND)**: Giá giảm (nếu có)
  - Ví dụ: `32900000` (32.900.000 VND)
  - Phải nhỏ hơn giá bán

### Bước 5: Chọn Phân Loại

Trong phần **"Phân loại"**:

#### ✅ Các trường bắt buộc:
- **Danh mục**: Chọn danh mục sản phẩm từ dropdown
  - Ví dụ: "Điện thoại Smartphone", "Laptop", "Tai nghe"
  - Nếu chưa có danh mục, cần tạo danh mục trước

- **Thương hiệu**: Chọn thương hiệu từ dropdown
  - Ví dụ: "Apple", "Samsung", "Sony"
  - Nếu chưa có thương hiệu, cần tạo thương hiệu trước

### Bước 6: Thêm Thuộc Tính Sản Phẩm (Tùy chọn)

Trong phần **"Thuộc tính sản phẩm"**:

1. **Click nút "Thêm thuộc tính"**
2. **Điền thông tin thuộc tính:**
   - **Tên thuộc tính**: Ví dụ "Màu sắc", "Kích thước", "Dung lượng"
   - **Giá trị**: Ví dụ "Đen", "128GB", "XL"

3. **Thêm nhiều thuộc tính** (nếu cần)
   - Click "Thêm thuộc tính" để thêm thuộc tính mới
   - Click nút **X** để xóa thuộc tính

**Ví dụ thuộc tính:**
- Màu sắc: Đen
- Dung lượng: 256GB
- Kích thước màn hình: 6.7 inch

### Bước 7: Tùy Chọn Thêm

Trong phần **"Tùy chọn thêm"**:

- **Sản phẩm nổi bật**: Bật/tắt switch để đánh dấu sản phẩm nổi bật
  - Sản phẩm nổi bật sẽ được hiển thị ở trang chủ và các vị trí đặc biệt

### Bước 8: Lưu Sản Phẩm

1. **Kiểm tra lại thông tin**
   - Đảm bảo tất cả các trường bắt buộc đã được điền
   - Kiểm tra giá, tồn kho, danh mục, thương hiệu

2. **Click nút "Lưu sản phẩm"**
   - Nút ở góc trên bên phải của trang
   - Hoặc scroll xuống và click nút "Lưu sản phẩm"

3. **Chờ xử lý**
   - Hệ thống sẽ hiển thị loading "Đang lưu..."
   - Sau khi thành công, sẽ tự động chuyển đến trang chi tiết sản phẩm

---

## 📝 Ví Dụ Điền Form

### Sản phẩm: iPhone 15 Pro Max 256GB

**Thông tin cơ bản:**
- Tên sản phẩm: `iPhone 15 Pro Max 256GB`
- SKU: `IPHONE-15PM-256GB`
- Mô tả: `iPhone 15 Pro Max với chip A17 Pro, camera 48MP, pin lâu dài...`

**Hình ảnh:**
- URL 1: `https://example.com/iphone-15-pro-max-1.jpg`
- URL 2: `https://example.com/iphone-15-pro-max-2.jpg`
- URL 3: `https://example.com/iphone-15-pro-max-3.jpg`

**Giá & Tồn kho:**
- Giá bán: `34900000` (34.900.000 VND)
- Giá khuyến mãi: `32900000` (32.900.000 VND)
- Tồn kho: `25`

**Phân loại:**
- Danh mục: `Điện thoại Smartphone`
- Thương hiệu: `Apple`

**Thuộc tính:**
- Màu sắc: `Titanium Xanh`
- Dung lượng: `256GB`
- Kích thước màn hình: `6.7 inch`

**Tùy chọn:**
- Sản phẩm nổi bật: ✅ Bật

---

## ⚠️ Lưu Ý Quan Trọng

### Validation (Kiểm tra dữ liệu)

Hệ thống sẽ kiểm tra các điều kiện sau trước khi lưu:

1. **Tên sản phẩm**: Không được để trống
2. **SKU**: Không được để trống và phải là duy nhất
3. **Mô tả**: Không được để trống
4. **Giá bán**: Phải > 0
5. **Danh mục**: Phải chọn một danh mục hợp lệ (categoryId > 0)
6. **Thương hiệu**: Phải chọn một thương hiệu hợp lệ (brandId > 0)

### Tự Động Xử Lý

- **Status**: Tự động set thành "In Stock" nếu stock > 0, "Out of Stock" nếu stock = 0
- **Slug**: Tự động tạo từ tên sản phẩm (nếu không nhập)
- **Created At / Updated At**: Tự động set thời gian hiện tại

### Sau Khi Tạo Sản Phẩm

1. **Tự động chuyển đến trang chi tiết**
   - URL: `/dashboard/products/{productId}`
   - Có thể xem, chỉnh sửa, hoặc thêm biến thể (variants)

2. **Thêm biến thể sản phẩm** (nếu cần)
   - Vào trang chi tiết sản phẩm
   - Click "Thêm biến thể"
   - Điền thông tin biến thể (màu sắc, kích thước khác, v.v.)

3. **Đồng bộ với Elasticsearch**
   - Sản phẩm sẽ tự động được đồng bộ vào Elasticsearch
   - Có thể tìm kiếm ngay sau khi tạo

---

## 🔧 Xử Lý Lỗi

### Lỗi Thường Gặp

#### 1. "Thông tin không đầy đủ"
**Nguyên nhân:** Thiếu một trong các trường bắt buộc
**Giải pháp:** Kiểm tra lại và điền đầy đủ:
- Tên sản phẩm
- SKU
- Mô tả
- Giá bán (> 0)
- Danh mục
- Thương hiệu

#### 2. "Không thể tải danh mục và thương hiệu"
**Nguyên nhân:** API không kết nối được hoặc chưa có dữ liệu
**Giải pháp:**
- Kiểm tra backend API đang chạy
- Tạo danh mục và thương hiệu trước khi thêm sản phẩm

#### 3. "Error creating product: 400"
**Nguyên nhân:** Dữ liệu không hợp lệ (SKU trùng, categoryId/brandId không tồn tại)
**Giải pháp:**
- Kiểm tra SKU chưa được sử dụng
- Kiểm tra categoryId và brandId hợp lệ
- Xem console log để biết chi tiết lỗi

#### 4. "Error creating product: 401"
**Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn
**Giải pháp:**
- Đăng nhập lại
- Kiểm tra token authentication

---

## 📚 API Endpoint

Nếu muốn thêm sản phẩm qua API trực tiếp:

```http
POST http://localhost:5130/api/admin/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "iPhone 15 Pro Max 256GB",
  "description": "Mô tả sản phẩm...",
  "price": 34900000,
  "salePrice": 32900000,
  "sku": "IPHONE-15PM-256GB",
  "stock": 25,
  "status": "In Stock",
  "featured": true,
  "categoryId": 5,
  "brandId": 1,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "attributes": [
    {
      "name": "Màu sắc",
      "value": "Titanium Xanh"
    },
    {
      "name": "Dung lượng",
      "value": "256GB"
    }
  ]
}
```

---

## 🎯 Best Practices

1. **SKU Naming Convention**
   - Sử dụng format nhất quán: `BRAND-MODEL-VARIANT`
   - Ví dụ: `APPLE-IPHONE15PM-256GB-BLUE`

2. **Hình Ảnh**
   - Sử dụng hình ảnh chất lượng cao (tối thiểu 800x800px)
   - Tối ưu hóa kích thước file (không quá 2MB mỗi ảnh)
   - Hình ảnh đầu tiên nên là góc nhìn tốt nhất của sản phẩm

3. **Mô Tả Sản Phẩm**
   - Viết mô tả chi tiết, dễ hiểu
   - Bao gồm thông số kỹ thuật quan trọng
   - Sử dụng bullet points cho dễ đọc

4. **Thuộc Tính**
   - Sử dụng thuộc tính nhất quán (ví dụ: luôn dùng "Màu sắc" thay vì "Color" hoặc "Màu")
   - Giá trị thuộc tính nên chuẩn hóa (ví dụ: "256GB" thay vì "256 GB" hoặc "256gb")

5. **Giá Cả**
   - Đảm bảo giá khuyến mãi < giá bán
   - Cập nhật giá thường xuyên

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi thêm sản phẩm:

1. Kiểm tra console log trong browser (F12)
2. Kiểm tra backend logs
3. Xem API response trong Network tab
4. Liên hệ team phát triển với thông tin lỗi chi tiết

---

**Chúc bạn thêm sản phẩm thành công! 🎉**

