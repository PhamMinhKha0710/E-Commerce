# ⚡ Quick Fix: Sync Sản Phẩm Vào Elasticsearch

## 🎯 Vấn Đề: API Trả Về OK Nhưng Elasticsearch Vẫn Trống

### 🔍 Kiểm Tra Nhanh (5 Phút)

#### 1. RabbitMQ Đang Chạy?

```bash
# Kiểm tra
docker ps | grep rabbitmq

# Nếu không có, chạy:
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

**Test:** Mở `http://localhost:15672` → Login `guest`/`guest`

---

#### 2. Message Có Vào Queue?

1. Mở `http://localhost:15672`
2. Vào **Queues** → `product_sync_queue`
3. Xem số **Ready** messages

**Nếu Ready > 0:** ✅ Message đã vào → Xem bước 3  
**Nếu Ready = 0:** ❌ Message chưa vào → Kiểm tra Backend logs

---

#### 3. Product Sync Worker Đang Chạy?

```bash
# Kiểm tra process
ps aux | grep product_sync_worker  # Linux/Mac
tasklist | findstr python          # Windows

# Nếu không có, chạy:
cd E-Commerce/ImageSearchService
venv\Scripts\activate  # Windows
# hoặc: source venv/bin/activate  # Linux/Mac
cd src
python product_sync_worker.py
```

**Logs mong đợi:**
```
INFO: Starting RabbitMQ consumer for product_sync_queue...
INFO: Processing message: productId=1...
```

---

#### 4. Elasticsearch Đang Chạy?

```bash
# Kiểm tra
curl http://localhost:9200

# Nếu không có, chạy:
cd E-Commerce/Docker/Elashtich_Pluggin_Duy_Do
docker-compose up -d
```

---

#### 5. Có Lỗi Trong Dead Letter Queue?

1. Mở `http://localhost:15672`
2. Vào **Queues** → `product_sync_dead_letter_queue`
3. Xem có messages không

**Nếu có:** Click vào → **Get messages** → Xem lỗi gì

---

## 🚀 Giải Pháp Nhanh

### Scenario 1: Worker Chưa Chạy

**Triệu chứng:**
- Message vào queue (Ready > 0)
- Nhưng không được xử lý

**Giải pháp:**
```bash
cd E-Commerce/ImageSearchService/src
python product_sync_worker.py
```

---

### Scenario 2: Image URL Null

**Triệu chứng:**
- Messages vào dead letter queue
- Lỗi: "Missing image_url in message data"

**Giải pháp:**
1. Kiểm tra database:
```sql
SELECT Id, Name, ImageUrl FROM ProductItems WHERE ProductId = 1
```

2. Update ImageUrl nếu null:
```sql
UPDATE ProductItems 
SET ImageUrl = 'https://example.com/image.jpg' 
WHERE ProductId = 1 AND IsDefault = 1
```

3. Sync lại:
```bash
curl -X POST http://localhost:5130/api/products/1/sync \
  -H "Content-Type: application/json" \
  -d '"update"'
```

---

### Scenario 3: Elasticsearch Không Kết Nối

**Triệu chứng:**
- Worker logs: "Elasticsearch connection failed"

**Giải pháp:**
```bash
cd E-Commerce/Docker/Elashtich_Pluggin_Duy_Do
docker-compose up -d

# Kiểm tra
curl http://localhost:9200
```

---

### Scenario 4: RabbitMQ Không Chạy

**Triệu chứng:**
- Backend logs: "Failed to publish message"
- Không truy cập được `http://localhost:15672`

**Giải pháp:**
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

---

## ✅ Test Sau Khi Fix

### 1. Gọi API Sync

```bash
curl -X POST http://localhost:5130/api/products/1/sync \
  -H "Content-Type: application/json" \
  -d '"add"'
```

**Response mong đợi:**
```json
{
  "message": "Product sync message sent to queue"
}
```

### 2. Kiểm Tra Queue

1. Mở `http://localhost:15672`
2. Vào **Queues** → `product_sync_queue`
3. Xem **Ready** messages giảm xuống (worker đang xử lý)

### 3. Kiểm Tra Worker Logs

**Phải thấy:**
```
INFO: Processing message: productId=1, itemId=1, action=add
INFO: Downloaded image from URL: ...
INFO: Synced product 1 for action add
```

### 4. Kiểm Tra Elasticsearch

**Trong Kibana Dev Tools:**
```json
GET /ecommerce_product_item/_count
```

**Kết quả mong đợi:**
```json
{
  "count": 1,  // ← Phải > 0
  ...
}
```

---

## 📋 Checklist Cuối Cùng

- [ ] ✅ RabbitMQ chạy (port 5672, 15672)
- [ ] ✅ Elasticsearch chạy (port 9200)
- [ ] ✅ Product Sync Worker đang chạy
- [ ] ✅ Message vào queue sau khi gọi API
- [ ] ✅ Worker consume messages (Ready giảm)
- [ ] ✅ Không có messages trong dead letter queue
- [ ] ✅ Documents xuất hiện trong Elasticsearch (`_count > 0`)

---

## 🆘 Vẫn Không Được?

1. **Xem logs chi tiết:**
   - Backend logs
   - Worker logs
   - RabbitMQ Management UI
   - Dead letter queue messages

2. **Kiểm tra từng bước:**
   - Backend → RabbitMQ (message vào queue?)
   - RabbitMQ → Worker (worker consume?)
   - Worker → Elasticsearch (index thành công?)

3. **Xem file:** `TROUBLESHOOTING_SYNC.md` để debug chi tiết hơn

---

**Xem thêm:**
- `TROUBLESHOOTING_SYNC.md` - Debug chi tiết
- `RABBITMQ_GUIDE.md` - Hướng dẫn RabbitMQ
- `ADD_DATA_TO_ELASTICSEARCH.md` - Hướng dẫn add dữ liệu












