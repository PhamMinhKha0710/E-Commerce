# Elasticsearch với Plugin Phân Tích Tiếng Việt

**Tác giả:** Nguyễn Ngọc Tiệp  
**Lời cảm ơn:** Đặc biệt cảm ơn anh Duy Do đã phát triển plugin `elasticsearch-analysis-vietnamese`, giúp xử lý văn bản tiếng Việt hiệu quả.
**Chi tiết:** Các bạn có thể xem blog `https://duydo.me/how-to-build-elasticsearch-vietnamese-analysis-plugin/` để có thể tự build phiên bản các bạn cần.
**Github_pluggin:** `https://duydo.me/how-to-build-elasticsearch-vietnamese-analysis-plugin/` có thể folow github anh duydo để xem nhiều phiên bản hơn đối với phiên bản v7.12.11 trở lên các bạn phải sử dụng CocCoc C++ Tokenizer, thay cho VnTokenizer của thầy Lê Hồng Phương.

---
## Lưu ý
- Mình sẽ cập nhật các lưu ý trong quá trình build gặp phải đối với newbie sau làm xong đồ án đã.
## Tổng quan

- **Elasticsearch**: Phiên bản 8.7.0, tích hợp `vi_analyzer` để phân tách văn bản tiếng Việt.
- **Kibana**: Phiên bản 8.7.0 để trực quan hóa và thực hiện truy vấn.
- **Plugin**: `elasticsearch-analysis-vietnamese` để xử lý tiếng Việt.
- **Kiến trúc hỗ trợ**: Linux ARM64, Linux x86_64, macOS, và Windows (qua Docker Desktop).

---

## Yêu cầu

- Docker và Docker Compose đã cài đặt:
  - **macOS**:
    ```bash
    brew install docker docker-compose
    ```
  - **Linux**:
    ```bash
    sudo apt-get update
    sudo apt-get install docker.io docker-compose
    ```
  - **Windows**: Cài Docker Desktop.
- Cấp ít nhất **4GB RAM** cho Docker (kiểm tra trong **Docker Desktop > Preferences > Resources**).
- Git để tải kho lưu trữ.

---

## Hướng dẫn cài đặt

1. **Tải kho lưu trữ:**
    ```bash
    git clone <repository-url>
    cd <thư-mục-dự-án>
    ```
    *(Thay `<repository-url>` bằng URL kho lưu trữ, ví dụ: `https://github.com/username/elasticsearch-vietnamese.git`)*

2. **Chạy Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```

    Lệnh này sẽ xây dựng image Elasticsearch với plugin tiếng Việt và khởi động các container Elasticsearch và Kibana.

---

## Kiểm tra cài đặt

- **Kiểm tra container đang chạy:**
    ```bash
    docker ps
    ```
    Đảm bảo `elasticsearch` và `kibana` có trạng thái `Up`.

- **Kiểm tra plugin đã cài đặt:**
    ```bash
    curl http://localhost:9200/_cat/plugins
    ```
    Kết quả mong đợi: `elasticsearch analysis-vietnamese 8.7.0`.

- **Kiểm tra phân tích văn bản tiếng Việt:**
    ```bash
    curl -X GET "http://localhost:9200/_analyze" -H 'Content-Type: application/json' -d'
    {
      "analyzer": "vi_analyzer",
      "text": "Cộng hòa Xã hội chủ nghĩa Việt Nam"
    }'
    ```

    Kết quả mong đợi:
    ```json
    {
      "tokens": [
        {"token":"cộng hòa","start_offset":0,"end_offset":8,"type":"<WORD>","position":0},
        {"token":"xã hội","start_offset":9,"end_offset":15,"type":"<WORD>","position":1},
        {"token":"chủ nghĩa","start_offset":16,"end_offset":25,"type":"<WORD>","position":2},
        {"token":"việt nam","start_offset":26,"end_offset":34,"type":"<WORD>","position":3}
      ]
    }
    ```

- **Truy cập Kibana:**
    - Mở trình duyệt và truy cập: [http://localhost:5601](http://localhost:5601)

---

## Sử dụng Plugin trong Kibana

1. **Mở Dev Tools** trong Kibana.

2. **Tạo chỉ mục với bộ phân tích tiếng Việt tùy chỉnh:**
    ```bash
    PUT my-vi-index-00001
    {
      "settings": {
        "analysis": {
          "analyzer": {
            "my_vi_analyzer": {
              "type": "vi_analyzer",
              "keep_punctuation": true,
              "stopwords": ["rất", "những"]
            }
          }
        }
      }
    }
    ```

3. **Kiểm tra phân tích văn bản:**
    ```bash
    GET my-vi-index-00001/_analyze
    {
      "analyzer": "my_vi_analyzer",
      "text": "Công nghệ thông tin Việt Nam rất phát triển trong những năm gần đây."
    }
    ```

---

## Khắc phục sự cố

- **Lỗi kết nối** (ví dụ: `curl: (56) Recv failure`):
    ```bash
    docker logs elasticsearch
    docker logs kibana
    ```
    - Đảm bảo cổng `9200` không bị chiếm:
      ```bash
      lsof -i :9200
      ```
    - Dừng tiến trình xung đột:
      ```bash
      kill -9 <PID>
      ```

- **Chờ khởi động**: Chờ khoảng 30-60 giây sau khi khởi động container để Elasticsearch hoàn tất khởi tạo.

- **Vấn đề tài nguyên**:
    - Cấp ít nhất **4GB RAM** và **2-4 CPU** trong Docker Desktop.

- **Lỗi plugin**:
    - Đảm bảo thư viện `libcoccoc_tokenizer_jni.so` phù hợp với kiến trúc hệ thống (ARM64 hoặc x86_64).
    - Liên hệ quản lý kho lưu trữ nếu cần thư viện cho kiến trúc cụ thể.

---

## Hỗ trợ kiến trúc

Cài đặt hỗ trợ nhiều kiến trúc thông qua các thư viện tokenizer:

| Hệ điều hành     | Thư viện sử dụng                       |
|------------------|-----------------------------------------|
| Linux ARM64      | `libcoccoc_tokenizer_jni.so`            |
| Linux x86_64     | `libcoccoc_tokenizer_jni_x86_64.so`     |
| macOS/Windows    | `libcoccoc_tokenizer_jni.dylib`         |

Dockerfile sẽ tự động chọn thư viện phù hợp dựa trên `TARGETPLATFORM`.

---

## Đóng góp

- Để báo lỗi, đề xuất tính năng, hoặc đóng góp mã nguồn, vui lòng tạo **issue** hoặc **pull request** trên kho lưu trữ GitHub.

---

## Giấy phép

Dự án này được cấp phép theo **MIT License**.  
Xem file `LICENSE` để biết chi tiết.

---
