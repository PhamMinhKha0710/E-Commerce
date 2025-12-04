# 📚 Hướng Dẫn Sử Dụng Elasticsearch trong E-Commerce Project

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
3. [Cài Đặt và Khởi Động](#cài-đặt-và-khởi-động)
4. [Sử Dụng Kibana](#sử-dụng-kibana)
5. [API Endpoints](#api-endpoints)
6. [Đồng Bộ Dữ Liệu](#đồng-bộ-dữ-liệu)
7. [Tìm Kiếm Sản Phẩm](#tìm-kiếm-sản-phẩm)
8. [Tìm Kiếm Bằng Hình Ảnh](#tìm-kiếm-bằng-hình-ảnh)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan

Project này sử dụng **Elasticsearch** để:
- ✅ Tìm kiếm sản phẩm theo text (tiếng Việt)
- ✅ Tìm kiếm sản phẩm bằng hình ảnh (Image Search)
- ✅ Gợi ý tìm kiếm (Search Suggestions)
- ✅ Lọc và sắp xếp sản phẩm nâng cao

**Index chính:** `ecommerce_product_item`

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────┐
│   Frontend  │ (Next.js - localhost:3000)
│  (React)    │
└──────┬──────┘
       │ HTTP API
       ▼
┌─────────────┐
│   Backend   │ (.NET Core - localhost:5130)
│  (C# API)   │
└──────┬──────┘
       │
       ├──► Elasticsearch (localhost:9200)
       │
       ├──► RabbitMQ (localhost:5672)
       │    └──► ImageSearchService (Python - localhost:8000)
       │
       └──► SQL Server Database
```

### Các Service:
1. **Backend API** (`Ecommerce.Api`): Xử lý search requests từ frontend
2. **ElasticsearchService** (C#): Kết nối và query Elasticsearch
3. **ImageSearchService** (Python FastAPI): Extract image features và vector search
4. **Product Sync Worker** (Python): Đồng bộ product data từ RabbitMQ → Elasticsearch

---

## 🚀 Cài Đặt và Khởi Động

### 1. Khởi Động Elasticsearch

#### Option A: Docker Compose (Khuyến nghị)
```bash
# Kiểm tra xem có file docker-compose.yml trong thư mục Docker
cd E-Commerce/Docker/Elashtich_Pluggin_Duy_Do

# Khởi động Elasticsearch + Kibana
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

#### Option B: Cài Đặt Thủ Công
1. Download Elasticsearch từ [elastic.co](https://www.elastic.co/downloads/elasticsearch)
2. Giải nén và chạy:
```bash
# Windows
bin\elasticsearch.bat

# Linux/Mac
./bin/elasticsearch
```

### 2. Kiểm Tra Elasticsearch Đang Chạy

```bash
# Kiểm tra health
curl http://localhost:9200

# Hoặc mở browser:
http://localhost:9200
```

**Kết quả mong đợi:**
```json
{
  "name": "...",
  "cluster_name": "elasticsearch",
  "version": {
    "number": "8.x.x"
  }
}
```

### 3. Khởi Động Các Service Khác

#### Backend API (.NET)
```bash
cd E-Commerce/backend/Ecommerce.Api
dotnet run
# Hoặc
dotnet watch run
```

**Cấu hình trong `appsettings.json`:**
```json
{
  "Elasticsearch": {
    "Uri": "http://localhost:9200"
  }
}
```

#### ImageSearchService (Python)
```bash
cd E-Commerce/ImageSearchService

# Kích hoạt virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Cài đặt dependencies (nếu chưa có)
pip install -r src/requirement.txt

# Chạy service
cd src
uvicorn main:app --reload --port 8000
```

#### Product Sync Worker (Python)
```bash
cd E-Commerce/ImageSearchService/src

# Đảm bảo virtual environment đã được kích hoạt
python product_sync_worker.py
```

#### RabbitMQ
```bash
# Nếu dùng Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Hoặc cài đặt thủ công từ rabbitmq.com
```

#### Frontend (Next.js)
```bash
cd E-Commerce/frontend
npm install
npm run dev
```

---

## 🔍 Sử Dụng Kibana

### 1. Truy Cập Kibana

Mở browser và vào:
```
http://localhost:5601
```

**Default credentials** (nếu có):
- Username: `elastic`
- Password: `changeme` (hoặc password bạn đã set)

### 2. Tạo Index Pattern

1. Vào **Stack Management** → **Index Patterns**
2. Click **Create index pattern**
3. Nhập pattern: `ecommerce_product_item`
4. Click **Next step**
5. Chọn **Time field**: `created_at` (hoặc `@timestamp`)
6. Click **Create index pattern**

### 3. Xem Dữ Liệu Sản Phẩm

1. Vào **Discover** (menu bên trái)
2. Chọn index pattern: `ecommerce_product_item`
3. Xem danh sách sản phẩm đã được index

**Các trường quan trọng:**
- `product_id`: ID sản phẩm
- `item_id`: ID product item
- `name`: Tên sản phẩm
- `category`: Danh mục
- `brand`: Thương hiệu
- `price`: Giá
- `feature_vector`: Vector đặc trưng hình ảnh (512 dimensions)
- `popularity_score`: Điểm phổ biến

### 4. Dev Tools - Query Elasticsearch

Vào **Dev Tools** (menu bên trái) để chạy queries:

#### Xem tất cả sản phẩm:
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10
}
```

#### Tìm kiếm sản phẩm:
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "multi_match": {
      "query": "tai nghe",
      "fields": ["name^3", "description"]
    }
  }
}
```

#### Xem cấu trúc index:
```json
GET /ecommerce_product_item/_mapping
```

#### Xem số lượng documents:
```json
GET /ecommerce_product_item/_count
```

#### Tìm kiếm theo category:
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

#### Tìm kiếm theo giá:
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 100000,
        "lte": 500000
      }
    }
  }
}
```

### 5. Xem Logs và Monitoring

- **Stack Monitoring**: Xem health của Elasticsearch cluster
- **Logs**: Xem application logs (nếu đã cấu hình)

---

## 🔌 API Endpoints

### Backend API (localhost:5130)

#### 1. Tìm Kiếm Sản Phẩm (Text Search)
```http
POST http://localhost:5130/api/Search/search
Content-Type: application/json

{
  "query": "tai nghe bluetooth",
  "filters": {
    "category": ["Điện Thoại - Máy Tính Bảng"],
    "brand": ["Edifier"],
    "priceRange": {
      "min": 100000,
      "max": 2000000
    }
  },
  "sort": "price_asc",
  "page": 1,
  "pageSize": 24
}
```

**Response:**
```json
{
  "total": 150,
  "page": 1,
  "pageSize": 24,
  "results": [
    {
      "productId": 1,
      "itemId": 1,
      "name": "Tai Nghe Bluetooth Edifier W820NB PLUS",
      "price": 1399000,
      "category": "Điện Thoại - Máy Tính Bảng",
      "brand": "Edifier",
      "imageUrl": "...",
      ...
    }
  ]
}
```

#### 2. Tìm Kiếm Bằng Hình Ảnh
```http
POST http://localhost:5130/api/Search/search-by-image
Content-Type: multipart/form-data

file: [image file]
```

#### 3. Gợi Ý Tìm Kiếm
```http
GET http://localhost:5130/api/Search/suggest?query=tai
```

**Response:**
```json
{
  "suggestions": [
    "tai nghe",
    "tai nghe bluetooth",
    "tai nghe không dây"
  ]
}
```

### ImageSearchService API (localhost:8000)

#### 1. Extract Image Features
```http
POST http://localhost:8000/extract-features
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "feature_vector": [0.123, 0.456, ...] // 512 dimensions
}
```

#### 2. Search Similar Images
```http
POST http://localhost:8000/search-similar
Content-Type: multipart/form-data

file: [image file]
category: "Điện Thoại - Máy Tính Bảng" (optional)
max_distance: 0.5 (optional)
limit: 10 (optional)
```

---

## 🔄 Đồng Bộ Dữ Liệu

### Cơ Chế Đồng Bộ

1. **Khi tạo/cập nhật sản phẩm** trong Backend:
   - Backend gửi message vào RabbitMQ queue: `product_sync_queue`
   - Message format:
   ```json
   {
     "productId": 123,
     "itemId": 456,
     "action": "add", // hoặc "update", "delete"
     "data": {
       "name": "Tên sản phẩm",
       "category": "Danh mục",
       "brand": "Thương hiệu",
       "price": 100000,
       "image_url": "http://...",
       ...
     }
   }
   ```

2. **Product Sync Worker** (Python):
   - Lắng nghe queue `product_sync_queue`
   - Download/load image từ `image_url`
   - Extract feature vector bằng ResNet34
   - Index vào Elasticsearch với `feature_vector`

### Đồng Bộ Thủ Công

#### Từ Backend API:
```http
POST http://localhost:5130/api/products/{productId}/sync
Content-Type: application/json

{
  "action": "add" // hoặc "update", "delete"
}
```

### Kiểm Tra Đồng Bộ

1. **Kiểm tra RabbitMQ Queue:**
   - Vào `http://localhost:15672` (RabbitMQ Management)
   - Login: `guest` / `guest`
   - Xem queue `product_sync_queue`

2. **Kiểm tra Elasticsearch:**
   ```bash
   # Xem số lượng documents
   curl http://localhost:9200/ecommerce_product_item/_count
   
   # Hoặc trong Kibana Dev Tools:
   GET /ecommerce_product_item/_count
   ```

---

## 🔎 Tìm Kiếm Sản Phẩm

### Frontend Usage

#### 1. Text Search
```typescript
// File: frontend/src/app/collections/all/ProductGrid.tsx
const response = await fetch(`http://localhost:5130/api/Search/search`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query: "tai nghe",
    filters: {
      category: ["Điện Thoại - Máy Tính Bảng"],
      brand: ["Edifier"],
      priceRange: { min: 100000, max: 2000000 }
    },
    sort: "price_asc",
    page: 1,
    pageSize: 24,
  }),
});
```

#### 2. Image Search
```typescript
// File: frontend/src/components/layout/Header.tsx
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5130/api/Search/search-by-image', {
  method: 'POST',
  body: formData,
});
```

### Backend Implementation

File: `Ecommerce.Infrastructure/Persistence/Service/ElasticsearchService.cs`

**Các tính năng:**
- ✅ Multi-match search với Vietnamese analyzer
- ✅ Fuzzy search (tự động sửa lỗi chính tả)
- ✅ Filter theo category, brand, price range
- ✅ Sort theo price, popularity
- ✅ Pagination

---

## 🖼️ Tìm Kiếm Bằng Hình Ảnh

### Quy Trình

1. **User upload ảnh** → Frontend
2. **Frontend gửi ảnh** → Backend API (`/api/Search/search-by-image`)
3. **Backend gọi ImageSearchService** → Extract features (`/extract-features`)
4. **Backend query Elasticsearch** → Vector similarity search
5. **Trả về kết quả** → Frontend hiển thị

### Vector Search Query

```csharp
// Backend sử dụng script_score query với cosine similarity
var query = new ScriptScoreQuery
{
    Query = new MatchAllQuery(),
    Script = new InlineScript(
        "cosineSimilarity(params.query_vector, 'feature_vector') + 1.0")
    {
        Params = new Dictionary<string, object>
        {
            { "query_vector", featureVector }
        }
    }
};
```

### Test Image Search

1. **Dùng Postman/curl:**
```bash
curl -X POST http://localhost:5130/api/Search/search-by-image \
  -F "image=@/path/to/image.jpg"
```

2. **Hoặc từ Frontend:**
   - Vào trang chủ
   - Click icon camera trong search bar
   - Upload ảnh
   - Xem kết quả

---

## 🛠️ Troubleshooting

### 1. Elasticsearch Không Kết Nối Được

**Lỗi:** `Connection refused` hoặc `Connection timeout`

**Giải pháp:**
```bash
# Kiểm tra Elasticsearch đang chạy
curl http://localhost:9200

# Kiểm tra port
netstat -an | findstr 9200  # Windows
lsof -i :9200                # Linux/Mac

# Kiểm tra firewall
# Windows: Control Panel → Windows Defender Firewall
# Linux: sudo ufw status
```

### 2. Index Không Tồn Tại

**Lỗi:** `index_not_found_exception`

**Giải pháp:**
```bash
# Tạo index thủ công (nếu cần)
curl -X PUT http://localhost:9200/ecommerce_product_item

# Hoặc để Backend tự tạo khi sync sản phẩm đầu tiên
```

### 3. ImageSearchService Không Extract Được Features

**Lỗi:** `Failed to extract features`

**Giải pháp:**
```bash
# Kiểm tra service đang chạy
curl http://localhost:8000/docs

# Kiểm tra model đã load chưa
# Xem logs của ImageSearchService

# Test extract features thủ công
curl -X POST http://localhost:8000/extract-features \
  -F "file=@test_image.jpg"
```

### 4. RabbitMQ Queue Không Hoạt Động

**Lỗi:** `Connection refused` hoặc message không được xử lý

**Giải pháp:**
```bash
# Kiểm tra RabbitMQ
curl http://localhost:15672

# Kiểm tra queue
# Vào http://localhost:15672 → Queues → product_sync_queue

# Kiểm tra consumer đang chạy
# Xem logs của product_sync_worker.py
```

### 5. Không Tìm Thấy Sản Phẩm

**Nguyên nhân:**
- Sản phẩm chưa được sync vào Elasticsearch
- Index pattern sai trong Kibana
- Query syntax sai

**Giải pháp:**
```bash
# Kiểm tra số lượng documents
GET /ecommerce_product_item/_count

# Xem một document mẫu
GET /ecommerce_product_item/_search
{
  "size": 1
}

# Kiểm tra mapping
GET /ecommerce_product_item/_mapping
```

### 6. Kibana Không Hiển Thị Dữ Liệu

**Giải pháp:**
1. Kiểm tra index pattern đã tạo đúng chưa
2. Refresh field list trong Kibana
3. Kiểm tra time range filter (có thể đang filter quá hẹp)

---

## 📊 Monitoring và Debugging

### 1. Xem Logs

**Backend (.NET):**
- Logs được ghi vào console hoặc file (tùy cấu hình Serilog)
- Xem trong `appsettings.json` → `Serilog`

**ImageSearchService (Python):**
```bash
# Logs hiển thị trên console khi chạy uvicorn
# Hoặc check file logs nếu đã cấu hình
```

**Product Sync Worker:**
```bash
# Logs hiển thị trên console
# Tìm các message: "Processing message", "Synced product", etc.
```

### 2. Kiểm Tra Performance

**Elasticsearch:**
```json
# Xem cluster health
GET /_cluster/health

# Xem index stats
GET /ecommerce_product_item/_stats

# Xem search performance
GET /ecommerce_product_item/_search
{
  "query": {...},
  "profile": true  // Enable profiling
}
```

### 3. Debug Queries

**Trong Kibana Dev Tools:**
```json
# Test query với explain
GET /ecommerce_product_item/_search
{
  "explain": true,
  "query": {
    "match": {
      "name": "tai nghe"
    }
  }
}
```

---

## 📝 Checklist Kiểm Tra

- [ ] Elasticsearch đang chạy trên port 9200
- [ ] Kibana đang chạy trên port 5601
- [ ] Backend API đang chạy trên port 5130
- [ ] ImageSearchService đang chạy trên port 8000
- [ ] RabbitMQ đang chạy trên port 5672
- [ ] Product Sync Worker đang chạy và consume messages
- [ ] Index `ecommerce_product_item` đã được tạo
- [ ] Có ít nhất một số sản phẩm đã được sync vào Elasticsearch
- [ ] Kibana index pattern đã được tạo
- [ ] Frontend có thể gọi API search thành công

---

## 🔗 Tài Liệu Tham Khảo

- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Kibana User Guide](https://www.elastic.co/guide/en/kibana/current/index.html)
- [NEST Client (.NET)](https://www.elastic.co/guide/en/elasticsearch/client/net-api/current/index.html)
- [Elasticsearch Python Client](https://elasticsearch-py.readthedocs.io/)

---

## 💡 Tips & Best Practices

1. **Index Aliases**: Sử dụng aliases để dễ dàng reindex khi cần
2. **Bulk Operations**: Khi sync nhiều sản phẩm, dùng bulk API
3. **Refresh Policy**: Cân nhắc `refresh=wait_for` cho real-time search
4. **Caching**: Elasticsearch tự động cache queries, không cần config thêm
5. **Monitoring**: Setup monitoring alerts cho cluster health

---

**Chúc bạn sử dụng Elasticsearch thành công! 🚀**



















