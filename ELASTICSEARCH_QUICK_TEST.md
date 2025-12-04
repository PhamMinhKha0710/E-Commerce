# ⚡ Quick Test: Add Dữ Liệu Vào Elasticsearch

## 🎯 Test Nhanh Trên Kibana Dev Tools

### Bước 1: Mở Kibana Dev Tools

1. Mở: `http://localhost:5601`
2. Vào **Dev Tools** → **Console**

### Bước 2: Copy & Paste Query Dưới Đây

#### Test 1: Add Sản Phẩm Đơn Giản

```json
POST /ecommerce_product_item/_doc/1
{
  "product_id": 1,
  "item_id": 1,
  "name": "Tai Nghe Bluetooth Edifier W820NB PLUS",
  "description": "Tai nghe chống ồn chủ động, pin 49 giờ, kết nối Bluetooth 5.0",
  "category": "Điện Thoại - Máy Tính Bảng",
  "sub_category": "Phụ Kiện",
  "brand": "Edifier",
  "price": 1399000,
  "old_price": 1999000,
  "stock": 50,
  "sku": "ED-W820NB-PLUS",
  "image_url": "https://example.com/images/tai-nghe-edifier.jpg",
  "popularity_score": 225.0,
  "has_variation": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "tags": ["tai nghe", "bluetooth", "chống ồn", "edifier"],
  "rating": 4.5,
  "total_rating_count": 120,
  "status": true,
  "variations": [],
  "suggestion": {
    "input": ["tai nghe", "edifier", "bluetooth", "tai nghe bluetooth"],
    "weight": 1
  }
}
```

**Click nút ▶️ (Send request)** → Kết quả sẽ hiển thị bên phải

#### Test 2: Add Thêm Sản Phẩm

```json
POST /ecommerce_product_item/_doc/2
{
  "product_id": 2,
  "item_id": 2,
  "name": "Laptop Dell XPS 13 2024",
  "description": "Laptop cao cấp, màn hình 13.4 inch OLED, Intel Core i7-1355U, RAM 16GB, SSD 512GB",
  "category": "Laptop - Máy Vi Tính - Linh kiện",
  "sub_category": "Laptop",
  "brand": "Dell",
  "price": 25000000,
  "old_price": 28000000,
  "stock": 20,
  "sku": "DELL-XPS13-2024",
  "image_url": "https://example.com/images/laptop-dell.jpg",
  "popularity_score": 1200.0,
  "has_variation": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "tags": ["laptop", "dell", "xps", "intel"],
  "rating": 4.8,
  "total_rating_count": 250,
  "status": true,
  "variations": [
    {
      "variation_id": 1,
      "variation_value": "Màu sắc",
      "option_id": 1,
      "option_value": "Đen"
    },
    {
      "variation_id": 2,
      "variation_value": "RAM",
      "option_id": 2,
      "option_value": "16GB"
    }
  ],
  "suggestion": {
    "input": ["laptop", "dell", "xps", "laptop dell"],
    "weight": 1
  }
}
```

#### Test 3: Kiểm Tra Số Lượng

```json
GET /ecommerce_product_item/_count
```

**Kết quả mong đợi:**
```json
{
  "count": 2,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  }
}
```

#### Test 4: Xem Tất Cả Sản Phẩm

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10
}
```

#### Test 5: Tìm Kiếm Sản Phẩm

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match": {
      "name": "tai nghe"
    }
  }
}
```

#### Test 6: Lọc Theo Category

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "term": {
      "category": "Điện Thoại - Máy Tính Bảng"
    }
  }
}
```

#### Test 7: Lọc Theo Giá

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 1000000,
        "lte": 5000000
      }
    }
  }
}
```

---

## 🔄 Test Update Dữ Liệu

### Update Giá

```json
POST /ecommerce_product_item/_update/1
{
  "doc": {
    "price": 1299000,
    "stock": 45,
    "updated_at": "2024-01-16T10:00:00Z"
  }
}
```

### Xem Document Sau Khi Update

```json
GET /ecommerce_product_item/_doc/1
```

---

## 🗑️ Test Delete

### Xóa Một Document

```json
DELETE /ecommerce_product_item/_doc/1
```

### Kiểm Tra Đã Xóa

```json
GET /ecommerce_product_item/_count
```

---

## 🧪 Test Backend API

### Sync Sản Phẩm Từ Database

```bash
# Sync sản phẩm ID = 1
curl -X POST http://localhost:5130/api/products/1/sync \
  -H "Content-Type: application/json" \
  -d '"add"'
```

**Hoặc dùng Postman:**
- Method: `POST`
- URL: `http://localhost:5130/api/products/1/sync`
- Headers: `Content-Type: application/json`
- Body (raw JSON): `"add"`

**Response:**
```json
{
  "message": "Product sync message sent to queue"
}
```

**Lưu ý:** Cần Product Sync Worker đang chạy để xử lý message từ RabbitMQ.

---

## ✅ Checklist Test

- [ ] ✅ Add sản phẩm thành công
- [ ] ✅ Đếm số documents (`_count`)
- [ ] ✅ Xem tất cả documents (`_search`)
- [ ] ✅ Tìm kiếm bằng text (`match`)
- [ ] ✅ Lọc theo category (`term`)
- [ ] ✅ Lọc theo giá (`range`)
- [ ] ✅ Update document (`_update`)
- [ ] ✅ Delete document (`DELETE`)
- [ ] ✅ Test Backend API sync

---

## 🎯 Kết Quả Mong Đợi

Sau khi test xong, bạn sẽ thấy:

1. **Index có dữ liệu:** `count > 0`
2. **Search hoạt động:** Tìm thấy sản phẩm khi search
3. **Filter hoạt động:** Lọc được theo category, giá
4. **Backend API hoạt động:** Sync được sản phẩm từ database

---

**Xem thêm:**
- `ADD_DATA_TO_ELASTICSEARCH.md` - Hướng dẫn chi tiết
- `ELASTICSEARCH_GUIDE.md` - Hướng dẫn đầy đủ
- `KIBANA_QUERIES.md` - Các query thường dùng


















