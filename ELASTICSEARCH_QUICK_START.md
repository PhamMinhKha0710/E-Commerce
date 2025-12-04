# ⚡ Elasticsearch Quick Start Guide

## 🚀 Khởi Động Nhanh (5 phút)

### Bước 1: Khởi Động Elasticsearch + Kibana

```bash
# Di chuyển đến thư mục Docker
cd E-Commerce/Docker/Elashtich_Pluggin_Duy_Do

# Khởi động services
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

**Kết quả mong đợi:**
```
NAME            STATUS
elasticsearch   Up
kibana          Up
```

### Bước 2: Kiểm Tra Elasticsearch

Mở browser: `http://localhost:9200`

**Kết quả:**
```json
{
  "name": "elasticsearch",
  "cluster_name": "es-docker-cluster",
  "version": { "number": "8.x.x" }
}
```

### Bước 3: Truy Cập Kibana

Mở browser: `http://localhost:5601`

**Lần đầu tiên:**
- Click **Explore on my own** (nếu có)
- Vào **Stack Management** → **Index Patterns**
- Tạo index pattern: `ecommerce_product_item`

### Bước 4: Khởi Động Backend

```bash
cd E-Commerce/backend/Ecommerce.Api
dotnet run
```

Kiểm tra: `http://localhost:5130/swagger`

### Bước 5: Khởi Động ImageSearchService

```bash
cd E-Commerce/ImageSearchService

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

cd src
uvicorn main:app --reload --port 8000
```

Kiểm tra: `http://localhost:8000/docs`

### Bước 6: Khởi Động Product Sync Worker

```bash
# Trong cùng terminal với ImageSearchService (hoặc terminal mới)
cd E-Commerce/ImageSearchService/src
python product_sync_worker.py
```

### Bước 7: Khởi Động Frontend

```bash
cd E-Commerce/frontend
npm run dev
```

Kiểm tra: `http://localhost:3000`

---

## 🔍 Test Nhanh

### 1. Test Elasticsearch Query (Kibana Dev Tools)

```json
GET /ecommerce_product_item/_count
```

**Kết quả:** Số lượng sản phẩm đã được index

### 2. Test Search API (Postman/curl)

```bash
curl -X POST http://localhost:5130/api/Search/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "tai nghe",
    "page": 1,
    "pageSize": 10
  }'
```

### 3. Test Image Search (Browser)

1. Vào `http://localhost:3000`
2. Click icon camera trong search bar
3. Upload một ảnh sản phẩm
4. Xem kết quả

---

## 📊 Xem Dữ Liệu Trong Kibana

### Discover Tab
1. Vào **Discover** (menu trái)
2. Chọn index: `ecommerce_product_item`
3. Xem danh sách sản phẩm

### Dev Tools - Query Examples

**Xem tất cả sản phẩm:**
```json
GET /ecommerce_product_item/_search
{
  "size": 10
}
```

**Tìm kiếm:**
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

**Lọc theo category:**
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

**Lọc theo giá:**
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 100000,
        "lte": 2000000
      }
    }
  }
}
```

---

## 🛑 Dừng Services

```bash
# Dừng Docker containers
cd E-Commerce/Docker/Elashtich_Pluggin_Duy_Do
docker-compose down

# Dừng Backend: Ctrl+C trong terminal
# Dừng ImageSearchService: Ctrl+C trong terminal
# Dừng Product Sync Worker: Ctrl+C trong terminal
# Dừng Frontend: Ctrl+C trong terminal
```

---

## ❓ Troubleshooting Nhanh

| Vấn đề | Giải pháp |
|--------|-----------|
| Elasticsearch không kết nối | `docker-compose restart elasticsearch` |
| Kibana không load được | `docker-compose restart kibana` |
| Không tìm thấy sản phẩm | Kiểm tra xem đã sync sản phẩm chưa |
| ImageSearchService lỗi | Kiểm tra port 8000 và virtual environment |

---

**Xem hướng dẫn chi tiết:** `ELASTICSEARCH_GUIDE.md`



















