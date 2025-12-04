<div style="background:#0b7285;color:#ffffff;padding:18px;border-radius:8px;margin-bottom:12px">
  <h1 style="margin:0;font-size:26px">HƯỚNG DẪN CÀI Elasticsearch + kibana + plugin Tiếng việt duydo</h1>
  <p style="margin:6px 0 0;font-size:14px;opacity:0.95">Elasticsearch 8.7.0 + Kibana 8.7.0 + Plugin tiếng Việt (DuyDo) trên Ubuntu 24.04 / WSL2</p>
</div>

<div style="background:#f1f3f5;border-left:6px solid #ffd43b;padding:12px;border-radius:6px;margin-bottom:14px">
<strong>Mục tiêu:</strong> cài mới hoàn toàn và <strong>TẮT HOÀN TOÀN security</strong> (không mật khẩu, không SSL, không enrollment token, không verification code). Đã test thành công ngày <strong>30/11/2025</strong>. Dành cho người mới — copy-paste từng lệnh là chạy được.

<div style="margin-top:8px;color:#495057">Lưu ý: chạy trên Ubuntu 24.04 (trong WSL2). Thực hiện từng bước theo thứ tự. Sao lưu cấu hình nếu bạn cần giữ dữ liệu cũ.</div>
</div>


---

**Mục lục**

- **Chuẩn bị**: 1 lệnh dotnet (chỉ tham khảo)
- **1. XÓA SẠCH CÁI CŨ**
- **2. CÀI Elasticsearch 8.7.0 + TẮT SECURITY**
- **3. CÀI Kibana 8.7.0 + TẮT SECURITY**
- **4. CÀI Plugin tiếng Việt DuyDo**
- **5. KIỂM TRA**
- **Ghi chú & mẹo**

---

**Chuẩn bị**

- Nếu bạn cần chạy project .NET (chỉ tham khảo), lệnh mẫu trên WSL/Windows:

```bash
cd /mnt/d/DoAnCN/E-Commerce/backend/Ecommerce.api
/mnt/c/Program\ Files/dotnet/dotnet.exe run
```

(Chỉ là ví dụ; không bắt buộc cho Elasticsearch/Kibana.)

---

<hr style="border:0;height:6px;background:linear-gradient(90deg,#4c6ef5,#15aabf);border-radius:4px;margin:14px 0">
**1. XÓA SẠCH HOÀN TOÀN CÁI CŨ (bắt buộc nếu từng cài trước đó)**

Chạy từng lệnh copy-paste vào terminal WSL (Ubuntu 24.04):

```bash
# Dừng service (bỏ lỗi nếu không tồn tại)
sudo systemctl stop kibana elasticsearch 2>/dev/null

# Gỡ gói apt
sudo apt purge elasticsearch kibana -y
sudo apt autoremove -y

# Xóa hết thư mục cũ (cẩn thận copy đúng)
sudo rm -rf /etc/elasticsearch
sudo rm -rf /var/lib/elasticsearch
sudo rm -rf /usr/share/elasticsearch
sudo rm -rf /etc/kibana
sudo rm -rf /var/lib/kibana
sudo rm -rf /usr/share/kibana

# Xóa repo cũ
sudo rm -f /etc/apt/sources.list.d/elastic-8.x.list
sudo rm -f /usr/share/keyrings/elasticsearch-keyring.gpg
```

---

<hr style="border:0;height:6px;background:linear-gradient(90deg,#ff6b6b,#f06595);border-radius:4px;margin:14px 0">
**2. Cài Elasticsearch 8.7.0 + TẮT SECURITY ngay từ đầu**

```bash
# Thêm key và repo chính chủ
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

sudo apt update
sudo apt install elasticsearch=8.7.0 -y
```

Chỉnh cấu hình — mở file và thay (thay hết nội dung hoặc dán vào cuối):

```bash
sudo nano /etc/elasticsearch/elasticsearch.yml
```

Dán (thay hết nếu cần):

```yaml
cluster.name: elasticsearch-dev
node.name: node-1
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node

# TẮT HOÀN TOÀN SECURITY
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false

# Tối ưu cho dev/WSL
thread_pool.write.queue_size: 1000
indices.query.bool.max_clause_count: 10000
```

Lưu (Ctrl+O → Enter) rồi thoát (Ctrl+X).

Khởi động và bật autostart:

```bash
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

Kiểm tra (phải trả về JSON, version 8.7.0):

```bash
curl http://localhost:9200
```

---

<hr style="border:0;height:6px;background:linear-gradient(90deg,#845ef7,#5c7cfa);border-radius:4px;margin:14px 0">
**3. Cài Kibana 8.7.0 + TẮT SECURITY**

```bash
sudo apt install kibana=8.7.0 -y
```

Chỉnh `kibana.yml`:

```bash
sudo nano /etc/kibana/kibana.yml
```

Thay (hoặc dán) toàn bộ nội dung này:

```yaml
# TẮT SECURITY CHO KIBANA

server.host: 0.0.0.0

Khởi động và bật autostart:

```bash
sudo systemctl enable kibana
sudo systemctl start kibana
```

Kiểm tra trạng thái:

```bash
sudo systemctl status kibana | grep Active
```

Mở trình duyệt: `http://localhost:5601` → phải vào thẳng, không cần login.

---

<hr style="border:0;height:6px;background:linear-gradient(90deg,#51cf66,#94d82d);border-radius:4px;margin:14px 0">
**4. Cài Plugin tiếng Việt DuyDo (fix 100% mọi lỗi trên Ubuntu 24.04/WSL2)**

Cài Java 17 + Maven:

```bash
sudo apt install openjdk-17-jdk maven -y

# Thiết lập JAVA_HOME cố định
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Kiểm tra
java -version   # phải hiển thị OpenJDK 17
mvn -version    # phải dùng Java 17
```

Build `coccoc-tokenizer` (fix lỗi make + CRLF trên WSL):

```bash
cd ~
git clone https://github.com/duydo/coccoc-tokenizer.git
cd coccoc-tokenizer

# Fix CRLF trên WSL (bắt buộc)
find . -type f -name "*.sh" -exec sed -i 's/\r$//' {} \;

rm -rf build && mkdir build && cd build
cmake -DBUILD_JAVA=1 ..
make -j$(nproc)
sudo make install

# Tạo symlink quan trọng
sudo ln -sf /usr/local/lib/libcoccoc_tokenizer_jni.so /usr/lib/libcoccoc_tokenizer_jni.so
```

Build plugin `elasticsearch-analysis-vietnamese`:

```bash
cd ~
git clone https://github.com/duydo/elasticsearch-analysis-vietnamese.git
cd elasticsearch-analysis-vietnamese

# Đảm bảo dùng Java 17
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Build (chạy ngon 100% với ES 8.7.0)
mvn clean package -DskipTests

# File zip sinh ra
ls target/releases/elasticsearch-analysis-vietnamese-8.7.0.zip
```

Cài plugin vào Elasticsearch:

```bash
# Dừng ES
sudo systemctl stop elasticsearch

# Cài plugin
sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install \
  file:///home/$USER/elasticsearch-analysis-vietnamese/target/releases/elasticsearch-analysis-vietnamese-8.7.0.zip

# Khởi động lại
sudo systemctl start elasticsearch
```

---

<hr style="border:0;height:6px;background:linear-gradient(90deg,#f59f00,#f76707);border-radius:4px;margin:14px 0">
**5. KIỂM TRA MỌI THỨ HOÀN HẢO**

1) Kiểm tra plugin đã cài chưa:

```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-plugin list | grep vietnamese
# → Phải thấy: analysis-vietnamese
```

2) Test phân tích tiếng Việt:

```bash
curl -X POST "http://localhost:9200/_analyze" -H 'Content-Type: application/json' -d '
{
  "analyzer": "vi_analyzer",
  "text": "Cộng hòa Xã hội chủ nghĩa Việt Nam đã độc lập tự do hạnh phúc"
}'
```

Kết quả mong đợi (ví dụ):

```json
"tokens": [
  {"token":"Cộng"},{"token":"hòa"},{"token":"xã_hội"},{"token":"chủ_nghĩa"},
  {"token":"Việt_Nam"},{"token":"độc_lập"},{"token":"tự_do"},{"token":"hạnh_phúc"}
]
```

---

**XONG 100%!**

Bạn sẽ có:
- Elasticsearch 8.7.0 → chạy HTTP, không mật khẩu, không SSL
- Kibana 8.7.0 → mở `http://localhost:5601` → vào ngay, không login
- Plugin tiếng Việt DuyDo → hoạt động hoàn hảo

Lưu script/memo này lại; lần sau chỉ cần chạy từ đầu — xong trong ~10–12 phút (tùy mạng & máy).

---

**Ghi chú & mẹo**

- Nếu cài trên server thực tế (production), KHÔNG tắt security như trên. Chỉ dùng cấu hình này cho môi trường dev/test cục bộ.
- Nếu gặp lỗi permission khi cài plugin, kiểm tra `JAVA_HOME` và quyền file `*.zip`.
- Trên WSL2, nếu gặp lỗi network (kết nối localhost), khởi động lại WSL hoặc kiểm tra `iptables`/firewall trên Windows.

---


