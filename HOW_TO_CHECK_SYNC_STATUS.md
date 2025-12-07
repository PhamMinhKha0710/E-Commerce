# 🔍 Hướng Dẫn Kiểm Tra Trạng Thái Sync Sản Phẩm

## 📋 Tổng Quan

Sau khi gọi API sync sản phẩm (`POST /api/Products/{id}/sync`), bạn cần kiểm tra xem:
1. ✅ Message đã được gửi vào RabbitMQ queue
2. ✅ Worker đã nhận và xử lý message
3. ✅ Sản phẩm đã được thêm vào Elasticsearch
4. ✅ Frontend có thể tìm thấy sản phẩm

---

## 🎯 Cách 1: Kiểm Tra Bằng Script Python (Khuyến Nghị)

### Chạy Script Kiểm Tra

```bash
cd E-Commerce/ImageSearchService/src
source ../venv/bin/activate
python check_sync_status.py
```

### Script sẽ hiển thị:
- ✅ Tổng số sản phẩm trong index
- ✅ Sản phẩm cụ thể có trong Elasticsearch không
- ✅ Danh sách tất cả sản phẩm
- ✅ Trạng thái RabbitMQ queue

---

## 🎯 Cách 2: Kiểm Tra Bằng Kibana Dev Tools

### Bước 1: Mở Kibana
```
http://localhost:5601
```
Vào **Dev Tools** → **Console**

### Bước 2: Kiểm Tra Sản Phẩm Cụ Thể

```json
GET /ecommerce_product_item/_doc/7
```

**Kết quả mong đợi:**
- ✅ `"found": true` → Sản phẩm đã có trong Elasticsearch
- ❌ `"found": false` → Sản phẩm chưa được sync

### Bước 3: Đếm Tổng Số Sản Phẩm

```json
GET /ecommerce_product_item/_count
```

**Kết quả:** Số lượng sản phẩm trong index

### Bước 4: Xem Tất Cả Sản Phẩm

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match_all": {}
  },
  "size": 20
}
```

---

## 🎯 Cách 3: Kiểm Tra Log Của Worker

### Xem Log Trong Terminal Chạy Worker

Khi worker xử lý thành công, bạn sẽ thấy các log sau:

```
INFO - Processing message: productId=7, itemId=..., action=add
INFO - Downloaded image from URL: ...
INFO - Synced product 7 for action add
```

### Các Dấu Hiệu Thành Công:
- ✅ `Processing message: productId=7` → Worker đã nhận message
- ✅ `Downloaded image from URL` → Đã tải ảnh thành công
- ✅ `Synced product 7 for action add` → Đã thêm vào Elasticsearch thành công

### Các Dấu Hiệu Lỗi:
- ❌ `Error processing message: ...` → Có lỗi xảy ra
- ❌ `Missing image_url in message data` → Thiếu URL ảnh
- ❌ `Local image file not found` → Không tìm thấy file ảnh

---

## 🎯 Cách 4: Kiểm Tra RabbitMQ Queue

### Bước 1: Mở RabbitMQ Management UI
```
http://localhost:15672
```
Đăng nhập: `guest` / `guest`

### Bước 2: Kiểm Tra Queue `product_sync_queue`

**Trạng thái bình thường:**
- ✅ **Ready:** 0 (không có message chờ)
- ✅ **Unacked:** 0 (không có message đang xử lý)

**Trạng thái có vấn đề:**
- ⚠️ **Ready > 0:** Có message chờ xử lý (worker có thể không chạy)
- ⚠️ **Unacked > 0:** Có message đang xử lý (có thể bị treo)

### Bước 3: Kiểm Tra Dead Letter Queue

Nếu có lỗi, message sẽ được chuyển vào `product_sync_dead_letter_queue`

---

## 🎯 Cách 5: Kiểm Tra Bằng Backend API

### Test Search API

```bash
curl -X POST http://localhost:5130/api/Search/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "",
    "filters": {},
    "sort": "",
    "page": 1,
    "pageSize": 10
  }'
```

**Kết quả mong đợi:**
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "results": [
    {
      "product_id": 7,
      "name": "...",
      ...
    }
  ]
}
```

---

## 🔍 Checklist Kiểm Tra

Sau khi sync sản phẩm ID 7, kiểm tra:

- [ ] ✅ Backend log: `Sent message to product_sync_queue for productId=7`
- [ ] ✅ Worker log: `Processing message: productId=7`
- [ ] ✅ Worker log: `Synced product 7 for action add`
- [ ] ✅ Elasticsearch: `GET /ecommerce_product_item/_doc/7` → `found: true`
- [ ] ✅ RabbitMQ: Queue `product_sync_queue` → Ready: 0
- [ ] ✅ Search API: Tìm thấy sản phẩm khi search
- [ ] ✅ Frontend: Sản phẩm hiển thị trên trang web

---

## ⚠️ Xử Lý Lỗi Thường Gặp

### 1. Worker Không Nhận Được Message

**Triệu chứng:**
- Backend log: `Sent message to queue` ✅
- Worker log: Không có log xử lý ❌
- RabbitMQ: Ready > 0

**Giải pháp:**
- Kiểm tra worker có đang chạy không
- Kiểm tra kết nối RabbitMQ
- Restart worker

### 2. Worker Xử Lý Lỗi

**Triệu chứng:**
- Worker log: `Error processing message: ...`

**Giải pháp:**
- Xem chi tiết lỗi trong log
- Kiểm tra `image_url` có hợp lệ không
- Kiểm tra kết nối Elasticsearch

### 3. Sản Phẩm Không Hiển Thị Trên Frontend

**Triệu chứng:**
- Elasticsearch có sản phẩm ✅
- Search API không tìm thấy ❌

**Giải pháp:**
- Kiểm tra index name: `ecommerce_product_item`
- Kiểm tra mapping của index
- Kiểm tra query trong SearchController

---

## 📝 Ví Dụ Kiểm Tra Nhanh

```bash
# 1. Kiểm tra sản phẩm ID 7 trong Elasticsearch
curl http://localhost:9200/ecommerce_product_item/_doc/7

# 2. Đếm số sản phẩm
curl http://localhost:9200/ecommerce_product_item/_count

# 3. Test search API
curl -X POST http://localhost:5130/api/Search/search \
  -H "Content-Type: application/json" \
  -d '{"query": "", "filters": {}, "sort": "", "page": 1, "pageSize": 10}'
```

---

## 🎯 Kết Luận

**Sync thành công khi:**
1. ✅ Worker log hiển thị `Synced product X`
2. ✅ Elasticsearch có document với ID tương ứng
3. ✅ Search API tìm thấy sản phẩm
4. ✅ Frontend hiển thị sản phẩm

**Nếu không thành công:**
- Kiểm tra log của worker để xem lỗi cụ thể
- Kiểm tra RabbitMQ queue status
- Kiểm tra kết nối Elasticsearch























