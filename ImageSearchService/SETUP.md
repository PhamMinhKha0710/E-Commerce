# Hướng dẫn Setup ImageSearchService

## Các bước cần thực hiện trước khi chạy:

### 1. Cài đặt Dependencies

```bash
# Kích hoạt virtual environment (nếu chưa có)
cd ImageSearchService
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Cài đặt packages
pip install -r src/requirement.txt
```

### 2. Khởi động Elasticsearch

**Yêu cầu:** Elasticsearch phải chạy tại `http://localhost:9200`

```bash
# Nếu dùng Docker
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.7.0

# Hoặc cài đặt và chạy Elasticsearch trực tiếp
```

### 3. Tạo Index trong Elasticsearch

Chạy script để tạo index với mapping đúng:

```bash
python src/setup_elasticsearch.py
```

Hoặc tạo thủ công bằng API:

```bash
curl -X PUT "localhost:9200/products" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "feature_vector": {
        "type": "dense_vector",
        "dims": 512
      },
      "name": {"type": "text"},
      "url": {"type": "keyword"},
      "category": {"type": "keyword"},
      "image_path": {"type": "keyword"}
    }
  }
}'
```

### 4. Khởi động RabbitMQ (nếu dùng product_sync_worker)

```bash
# Nếu dùng Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Hoặc cài đặt và chạy RabbitMQ trực tiếp
```

### 5. Chạy các Service

**Terminal 1 - FastAPI Service (main.py):**
```bash
cd src
python main.py
```
Service sẽ chạy tại: `http://localhost:8000`

**Terminal 2 - Product Sync Worker (nếu cần):**
```bash
cd src
python product_sync_worker.py
```

**Terminal 3 - Thêm sample products (tùy chọn):**
```bash
cd src
python add_sample_products.py
```

## Kiểm tra Service

- FastAPI docs: http://localhost:8000/docs
- Elasticsearch: http://localhost:9200
- RabbitMQ Management (nếu dùng): http://localhost:15672 (guest/guest)

## Lưu ý

- Đảm bảo Elasticsearch đang chạy trước khi start các service
- Index "products" phải được tạo với mapping đúng cho vector search
- Nếu dùng product_sync_worker, cần RabbitMQ đang chạy




























