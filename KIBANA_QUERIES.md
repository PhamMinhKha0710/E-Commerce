# 🔍 Kibana Dev Tools - Các Query Thường Dùng

## 📋 Mục Lục
1. [Query Cơ Bản](#query-cơ-bản)
2. [Tìm Kiếm](#tìm-kiếm)
3. [Lọc và Filter](#lọc-và-filter)
4. [Aggregation](#aggregation)
5. [Vector Search (Image Search)](#vector-search-image-search)
6. [Quản Lý Index](#quản-lý-index)

---

## 🔹 Query Cơ Bản

### Xem Tất Cả Documents
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match_all": {}
  },
  "size": 10
}
```

### Đếm Số Documents
```json
GET /ecommerce_product_item/_count
```

### Xem Một Document Cụ Thể
```json
GET /ecommerce_product_item/_doc/{product_id}
```

### Xem Cấu Trúc Index (Mapping)
```json
GET /ecommerce_product_item/_mapping
```

### Xem Settings của Index
```json
GET /ecommerce_product_item/_settings
```

---

## 🔍 Tìm Kiếm

### Tìm Kiếm Đơn Giản (Match)
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

### Tìm Kiếm Nhiều Trường (Multi-Match)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "multi_match": {
      "query": "tai nghe bluetooth",
      "fields": ["name^3", "description", "brand"],
      "type": "best_fields"
    }
  }
}
```

**Giải thích:**
- `name^3`: Boost trường `name` lên 3 lần (quan trọng hơn)
- `type: "best_fields"`: Lấy điểm cao nhất từ các trường

### Tìm Kiếm Chính Xác (Term)
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

### Tìm Kiếm Nhiều Giá Trị (Terms)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "terms": {
      "brand": ["Edifier", "Sony", "JBL"]
    }
  }
}
```

### Tìm Kiếm Mờ (Fuzzy)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "fuzzy": {
      "name": {
        "value": "tai nghe",
        "fuzziness": "AUTO"
      }
    }
  }
}
```

### Tìm Kiếm Prefix
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "prefix": {
      "name": "tai"
    }
  }
}
```

---

## 🎯 Lọc và Filter

### Lọc Theo Giá (Range)
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

### Lọc Nhiều Điều Kiện (Bool Query)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "name": "tai nghe"
          }
        }
      ],
      "filter": [
        {
          "term": {
            "category": "Điện Thoại - Máy Tính Bảng"
          }
        },
        {
          "range": {
            "price": {
              "gte": 500000,
              "lte": 3000000
            }
          }
        }
      ],
      "must_not": [
        {
          "term": {
            "status": "inactive"
          }
        }
      ]
    }
  }
}
```

**Giải thích:**
- `must`: Phải match (ảnh hưởng đến score)
- `filter`: Phải match (không ảnh hưởng đến score, nhanh hơn)
- `must_not`: Không được match

### Lọc Theo Stock
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "range": {
      "stock": {
        "gt": 0
      }
    }
  }
}
```

### Lọc Sản Phẩm Có Variation
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "term": {
      "has_variation": true
    }
  }
}
```

---

## 📊 Aggregation

### Đếm Theo Category
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "categories": {
      "terms": {
        "field": "category",
        "size": 20
      }
    }
  }
}
```

### Đếm Theo Brand
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "brands": {
      "terms": {
        "field": "brand",
        "size": 20
      }
    }
  }
}
```

### Thống Kê Giá (Min, Max, Avg)
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "price_stats": {
      "stats": {
        "field": "price"
      }
    }
  }
}
```

### Phân Bổ Giá Theo Khoảng
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 100000 },
          { "from": 100000, "to": 500000 },
          { "from": 500000, "to": 2000000 },
          { "from": 2000000 }
        ]
      }
    }
  }
}
```

### Top Sản Phẩm Phổ Biến
```json
GET /ecommerce_product_item/_search
{
  "size": 10,
  "sort": [
    {
      "popularity_score": {
        "order": "desc"
      }
    }
  ]
}
```

---

## 🖼️ Vector Search (Image Search)

### Tìm Kiếm Tương Tự Bằng Vector
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "script_score": {
      "query": {
        "match_all": {}
      },
      "script": {
        "source": "cosineSimilarity(params.query_vector, 'feature_vector') + 1.0",
        "params": {
          "query_vector": [0.123, 0.456, ...] // 512 dimensions
        }
      }
    }
  },
  "size": 10
}
```

### Vector Search với Filter
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "script_score": {
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "category": "Điện Thoại - Máy Tính Bảng"
              }
            }
          ]
        }
      },
      "script": {
        "source": "cosineSimilarity(params.query_vector, 'feature_vector') + 1.0",
        "params": {
          "query_vector": [0.123, 0.456, ...]
        }
      }
    }
  }
}
```

**Lưu ý:** `query_vector` phải là mảng 512 số (feature vector từ ResNet34)

---

## 🔧 Quản Lý Index

### Xem Tất Cả Indices
```json
GET /_cat/indices?v
```

### Xóa Index (Cẩn thận!)
```json
DELETE /ecommerce_product_item
```

### Tạo Index Mới
```json
PUT /ecommerce_product_item
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "price": { "type": "float" },
      "feature_vector": {
        "type": "dense_vector",
        "dims": 512
      }
    }
  }
}
```

### Refresh Index (Đồng bộ dữ liệu ngay lập tức)
```json
POST /ecommerce_product_item/_refresh
```

### Xem Index Stats
```json
GET /ecommerce_product_item/_stats
```

### Reindex (Copy dữ liệu từ index này sang index khác)
```json
POST /_reindex
{
  "source": {
    "index": "ecommerce_product_item"
  },
  "dest": {
    "index": "ecommerce_product_item_new"
  }
}
```

---

## 📈 Sắp Xếp (Sorting)

### Sắp Xếp Theo Giá (Tăng Dần)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "price": {
        "order": "asc"
      }
    }
  ]
}
```

### Sắp Xếp Theo Giá (Giảm Dần)
```json
GET /ecommerce_product_item/_search
{
  "sort": [
    {
      "price": {
        "order": "desc"
      }
    }
  ]
}
```

### Sắp Xếp Theo Popularity
```json
GET /ecommerce_product_item/_search
{
  "sort": [
    {
      "popularity_score": {
        "order": "desc"
      }
    }
  ]
}
```

### Sắp Xếp Nhiều Trường
```json
GET /ecommerce_product_item/_search
{
  "sort": [
    {
      "popularity_score": {
        "order": "desc"
      }
    },
    {
      "price": {
        "order": "asc"
      }
    }
  ]
}
```

---

## 🔎 Highlight (Làm Nổi Bật Kết Quả)

```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match": {
      "name": "tai nghe"
    }
  },
  "highlight": {
    "fields": {
      "name": {},
      "description": {}
    }
  }
}
```

---

## 📄 Pagination

### Phân Trang Cơ Bản
```json
GET /ecommerce_product_item/_search
{
  "from": 0,
  "size": 20,
  "query": {
    "match_all": {}
  }
}
```

**Giải thích:**
- `from: 0`: Bắt đầu từ document thứ 0
- `size: 20`: Lấy 20 documents

### Scroll API (Cho Dữ Liệu Lớn)
```json
# Bước 1: Khởi tạo scroll
POST /ecommerce_product_item/_search?scroll=1m
{
  "size": 100,
  "query": {
    "match_all": {}
  }
}

# Bước 2: Lấy batch tiếp theo (dùng scroll_id từ bước 1)
POST /_search/scroll
{
  "scroll": "1m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAA..."
}
```

---

## 🎨 Visualization Queries

### Top 10 Categories
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category",
        "size": 10,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}
```

### Top 10 Brands
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "top_brands": {
      "terms": {
        "field": "brand",
        "size": 10,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}
```

### Phân Bổ Rating
```json
GET /ecommerce_product_item/_search
{
  "size": 0,
  "aggs": {
    "rating_distribution": {
      "histogram": {
        "field": "rating",
        "interval": 0.5,
        "min_doc_count": 1
      }
    }
  }
}
```

---

## 🔍 Explain Query (Debug)

### Xem Tại Sao Document Match
```json
GET /ecommerce_product_item/_doc/{product_id}/_explain
{
  "query": {
    "match": {
      "name": "tai nghe"
    }
  }
}
```

### Profile Query (Xem Performance)
```json
GET /ecommerce_product_item/_search
{
  "query": {
    "match": {
      "name": "tai nghe"
    }
  },
  "profile": true
}
```

---

## 💡 Tips

1. **Sử dụng `filter` thay vì `must`** khi không cần tính score (nhanh hơn)
2. **Cache queries** bằng cách sử dụng `filter` context
3. **Limit `size`** để tránh query quá chậm
4. **Sử dụng `_source`** để chỉ lấy fields cần thiết:
```json
GET /ecommerce_product_item/_search
{
  "_source": ["name", "price", "image_url"],
  "query": {
    "match_all": {}
  }
}
```

---

**Xem thêm:** `ELASTICSEARCH_GUIDE.md` để biết cách sử dụng chi tiết hơn.













