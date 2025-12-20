# ĐỀ TÀI DỰ THI

## 2.1. Tên đề tài dự thi:

**Website thương mại điện tử thông minh**

---

## 2.2. Nội dung và ý tưởng:

Website thương mại điện tử thông minh là một nền tảng mua sắm trực tuyến được xây dựng với mục tiêu cung cấp trải nghiệm mua sắm tối ưu và cá nhân hóa cho người dùng. Dự án tập trung vào việc ứng dụng các công nghệ trí tuệ nhân tạo và machine learning để tạo ra một hệ thống thương mại điện tử thông minh với các tính năng nổi bật:

**Ý tưởng chính:**
- Xây dựng hệ thống khuyến nghị sản phẩm thông minh sử dụng Hybrid Recommendation System, kết hợp ba thuật toán: Popularity-Based, Content-Based và Collaborative Filtering để đưa ra gợi ý sản phẩm chính xác và phù hợp nhất cho từng người dùng.
- Tích hợp công nghệ tìm kiếm thông minh với Elasticsearch, hỗ trợ tìm kiếm văn bản tiếng Việt và tìm kiếm bằng hình ảnh (Image Search) sử dụng Deep Learning.
- Xây dựng hệ thống quản lý và xử lý đơn hàng tự động với khả năng mở rộng cao, hỗ trợ thanh toán trực tuyến qua VNPay.
- Thiết kế giao diện người dùng hiện đại, responsive và thân thiện với người dùng trên cả desktop và mobile.

**Điểm khác biệt:**
- Hệ thống khuyến nghị sản phẩm thông minh tự động học từ hành vi người dùng và cải thiện độ chính xác theo thời gian.
- Tìm kiếm bằng hình ảnh cho phép người dùng tìm sản phẩm tương tự chỉ bằng cách upload hình ảnh.
- Kiến trúc hệ thống hiện đại với Clean Architecture, CQRS Pattern, đảm bảo code dễ bảo trì và mở rộng.
- Tối ưu hóa hiệu suất với Redis caching, background jobs và async processing.

---

## 2.3. Cơ sở lý thuyết và công nghệ sử dụng:

### Cơ sở lý thuyết:

**1. Hệ thống khuyến nghị (Recommendation Systems):**
- **Popularity-Based Filtering**: Dựa trên thống kê độ phổ biến của sản phẩm (số lượt xem, số lượt mua, đánh giá).
- **Content-Based Filtering**: Sử dụng Cosine Similarity để tính độ tương đồng giữa các sản phẩm dựa trên đặc tính (category, brand, price, tên sản phẩm).
- **Collaborative Filtering**: Phân tích hành vi của người dùng tương tự để đề xuất sản phẩm.
- **Hybrid System**: Kết hợp các thuật toán trên với trọng số động để tối ưu độ chính xác.

**2. Tìm kiếm thông tin (Information Retrieval):**
- **Full-text Search**: Sử dụng Elasticsearch với Vietnamese analyzer để tìm kiếm văn bản tiếng Việt.
- **Vector Similarity Search**: Sử dụng Deep Learning (ResNet34) để extract feature vectors từ hình ảnh và tìm kiếm sản phẩm tương tự bằng cosine similarity.

**3. Kiến trúc phần mềm:**
- **Clean Architecture**: Tách biệt các layer (Domain, Application, Infrastructure, API) để dễ bảo trì và test.
- **CQRS Pattern**: Tách biệt Command (thay đổi dữ liệu) và Query (đọc dữ liệu) để tối ưu hiệu suất.
- **Repository Pattern**: Trừu tượng hóa data access layer.

### Công nghệ sử dụng:

**Backend:**
- **.NET 9.0 / ASP.NET Core**: Framework chính cho API
- **Entity Framework Core**: ORM cho database operations
- **SQL Server**: Database chính
- **Redis**: Caching và session management
- **Elasticsearch**: Search engine cho tìm kiếm sản phẩm
- **RabbitMQ**: Message queue cho async processing
- **Hangfire**: Background job processing
- **JWT Authentication**: Xác thực người dùng
- **Serilog**: Structured logging
- **MediatR**: Implementation của CQRS pattern

**Frontend:**
- **Next.js 14**: React framework với Server-Side Rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Swiper**: Carousel/slider component
- **Axios**: HTTP client

**Image Search Service:**
- **Python 3.x**: Ngôn ngữ lập trình
- **FastAPI**: Web framework
- **PyTorch**: Deep Learning framework
- **ResNet34**: Pre-trained model cho image feature extraction
- **Elasticsearch Python Client**: Kết nối với Elasticsearch

**DevOps & Tools:**
- **Docker**: Containerization
- **Git**: Version control
- **Swagger/OpenAPI**: API documentation

---

## 2.4. Chức năng chính của sản phẩm:

### 1. Quản lý người dùng:
- Đăng ký, đăng nhập với xác thực OTP qua email
- Quản lý thông tin cá nhân, địa chỉ giao hàng
- Lịch sử đơn hàng, đánh giá sản phẩm
- Wishlist (danh sách yêu thích)

### 2. Quản lý sản phẩm:
- Hiển thị danh sách sản phẩm theo danh mục
- Chi tiết sản phẩm với nhiều biến thể (variations)
- Hình ảnh sản phẩm, mô tả chi tiết
- Đánh giá và review từ khách hàng
- Sản phẩm liên quan và gợi ý

### 3. Hệ thống khuyến nghị sản phẩm thông minh:
- **"Bạn có thể thích"**: Gợi ý sản phẩm dựa trên sản phẩm đang xem
- **"Sản phẩm phổ biến"**: Hiển thị sản phẩm bán chạy nhất
- **Cá nhân hóa**: Gợi ý dựa trên lịch sử xem và mua hàng của người dùng
- Tự động cập nhật và cải thiện độ chính xác theo thời gian

### 4. Tìm kiếm thông minh:
- **Tìm kiếm văn bản**: Hỗ trợ tiếng Việt với fuzzy search, tự động sửa lỗi chính tả
- **Tìm kiếm bằng hình ảnh**: Upload hình ảnh để tìm sản phẩm tương tự
- **Gợi ý tìm kiếm**: Auto-complete khi nhập từ khóa
- **Lọc nâng cao**: Theo danh mục, thương hiệu, khoảng giá, biến thể
- **Sắp xếp**: Theo giá, độ phổ biến, đánh giá

### 5. Quản lý giỏ hàng và thanh toán:
- Thêm/sửa/xóa sản phẩm trong giỏ hàng
- Áp dụng mã giảm giá (promotion codes)
- Chọn phương thức vận chuyển
- Thanh toán trực tuyến qua VNPay
- Xác nhận đơn hàng qua email

### 6. Quản lý đơn hàng:
- Theo dõi trạng thái đơn hàng (Đang xử lý, Đang giao, Đã giao, Đã hủy)
- Lịch sử đơn hàng
- Hủy đơn hàng (nếu chưa giao)
- Đánh giá sản phẩm sau khi nhận hàng

### 7. Hệ thống quản trị (Admin Panel):
- Quản lý sản phẩm: Thêm, sửa, xóa, quản lý biến thể
- Quản lý danh mục và thương hiệu
- Quản lý đơn hàng: Xem, cập nhật trạng thái
- Quản lý người dùng
- Quản lý mã giảm giá và khuyến mãi
- Báo cáo thống kê: Doanh số, sản phẩm bán chạy, người dùng
- Dashboard tổng quan với các chỉ số quan trọng

### 8. Tính năng bổ sung:
- Blog/News: Tin tức và bài viết về sản phẩm
- Responsive design: Tối ưu cho mobile và tablet
- SEO friendly: Tối ưu hóa cho công cụ tìm kiếm
- Performance optimization: Caching, lazy loading, code splitting

---

## 2.5. Tính sáng tạo và khả năng ứng dụng, thương mại hóa:

### Tính sáng tạo:

**1. Hệ thống khuyến nghị Hybrid thông minh:**
- Kết hợp ba thuật toán (Popularity, Content-Based, Collaborative) với trọng số động
- Tự động điều chỉnh trọng số dựa trên context (có categoryId hay không, có userId hay không)
- Sử dụng Redis caching để tối ưu hiệu suất
- Tính toán Product Similarity định kỳ và lưu trữ để tăng tốc độ xử lý

**2. Tìm kiếm bằng hình ảnh với Deep Learning:**
- Sử dụng ResNet34 pre-trained model để extract feature vectors từ hình ảnh
- Vector similarity search trong Elasticsearch để tìm sản phẩm tương tự
- Cho phép người dùng tìm sản phẩm chỉ bằng cách upload hình ảnh, không cần biết tên sản phẩm

**3. Kiến trúc hiện đại và mở rộng:**
- Clean Architecture với tách biệt rõ ràng các layer
- CQRS Pattern giúp tối ưu hiệu suất cho read và write operations
- Async processing với RabbitMQ cho các tác vụ nặng (email, image processing)
- Background jobs với Hangfire cho các tác vụ định kỳ

**4. Tối ưu hóa hiệu suất:**
- Multi-level caching (Redis + in-memory cache)
- Lazy loading và code splitting ở frontend
- Database query optimization với EF Core
- Elasticsearch cho search operations thay vì query trực tiếp database

### Khả năng ứng dụng:

**1. Thương mại điện tử B2C:**
- Có thể triển khai cho các cửa hàng online, sàn thương mại điện tử
- Phù hợp với nhiều ngành hàng: Thời trang, Điện tử, Mỹ phẩm, Thực phẩm, v.v.

**2. Marketplace:**
- Có thể mở rộng thành nền tảng cho nhiều người bán
- Hỗ trợ quản lý nhiều cửa hàng trên cùng một nền tảng

**3. Tích hợp với hệ thống hiện có:**
- API-first design cho phép tích hợp dễ dàng với các hệ thống khác
- Có thể tích hợp với các hệ thống ERP, CRM, POS

### Khả năng thương mại hóa:

**1. Mô hình SaaS (Software as a Service):**
- Cung cấp nền tảng thương mại điện tử dưới dạng dịch vụ
- Khách hàng đăng ký và sử dụng với phí hàng tháng/năm
- Hỗ trợ nhiều tenant trên cùng một hệ thống

**2. Mô hình License:**
- Bán license cho các doanh nghiệp muốn tự host
- Cung cấp source code và hỗ trợ kỹ thuật

**3. Mô hình Customization:**
- Cung cấp dịch vụ tùy chỉnh theo yêu cầu của khách hàng
- Phát triển các tính năng đặc biệt cho từng ngành hàng

**4. Mô hình Marketplace:**
- Tự vận hành một sàn thương mại điện tử
- Thu phí từ người bán (commission, listing fee)

**5. Giá trị thị trường:**
- Thị trường thương mại điện tử Việt Nam đang phát triển mạnh
- Nhu cầu về các giải pháp thương mại điện tử thông minh ngày càng cao
- Cạnh tranh với các nền tảng lớn như Shopee, Lazada bằng cách tập trung vào tính năng thông minh và trải nghiệm người dùng

---

## 2.6. Hướng phát triển trong tương lai:

### Ngắn hạn (3-6 tháng):

**1. Cải thiện hệ thống khuyến nghị:**
- Tích hợp Deep Learning models (Neural Collaborative Filtering)
- Sequence-based recommendation sử dụng RNN/LSTM để học từ chuỗi hành vi người dùng
- Real-time personalization với streaming data processing

**2. Mở rộng tính năng tìm kiếm:**
- Voice search: Tìm kiếm bằng giọng nói
- Visual search nâng cao: Tìm kiếm theo style, màu sắc, pattern
- Semantic search: Hiểu ý định người dùng tốt hơn

**3. Tối ưu hóa hiệu suất:**
- CDN integration cho static assets
- Database read replicas cho scale out
- API rate limiting và throttling
- Response compression

**4. Cải thiện UX/UI:**
- Progressive Web App (PWA) để hỗ trợ offline
- Dark mode
- Accessibility improvements (WCAG compliance)
- Multi-language support (tiếng Anh, tiếng Trung)

### Trung hạn (6-12 tháng):

**1. Machine Learning nâng cao:**
- A/B testing tự động với Multi-armed Bandit
- Dynamic pricing dựa trên demand và competition
- Fraud detection cho đơn hàng và thanh toán
- Sentiment analysis cho reviews và feedback

**2. Tích hợp AI Chatbot:**
- Chatbot hỗ trợ khách hàng 24/7
- Tư vấn sản phẩm tự động
- Xử lý đơn hàng và khiếu nại

**3. Mở rộng thanh toán:**
- Tích hợp nhiều cổng thanh toán (Momo, ZaloPay, Stripe)
- Buy now pay later (Trả góp)
- Ví điện tử tích hợp

**4. Social Commerce:**
- Tích hợp mạng xã hội (Facebook, Instagram)
- Social login
- Share và review trên mạng xã hội
- Influencer marketing tools

**5. Analytics và Business Intelligence:**
- Advanced analytics dashboard
- Predictive analytics cho inventory management
- Customer lifetime value prediction
- Churn prediction và retention strategies

### Dài hạn (1-2 năm):

**1. Microservices Architecture:**
- Chuyển đổi từ monolithic sang microservices
- Service mesh với Istio hoặc Linkerd
- API Gateway pattern
- Event-driven architecture

**2. Blockchain Integration:**
- Supply chain transparency
- Authenticity verification cho hàng hiệu
- Smart contracts cho payments

**3. AR/VR Shopping:**
- Virtual try-on cho thời trang, mỹ phẩm
- 3D product visualization
- Virtual store tours

**4. IoT Integration:**
- Smart inventory management
- Automated reordering
- IoT devices cho warehouse management

**5. International Expansion:**
- Multi-currency support
- International shipping integration
- Localization cho nhiều quốc gia
- Cross-border payment solutions

**6. Sustainability Features:**
- Carbon footprint calculator
- Eco-friendly product badges
- Sustainable packaging options
- Green delivery options

**7. Advanced Personalization:**
- Hyper-personalization với reinforcement learning
- Context-aware recommendations (thời gian, địa điểm, thời tiết)
- Personalized pricing
- Custom product recommendations

---

## 2.7. Màn hình, hình ảnh chính của ứng dụng (screenshots):

*Lưu ý: Phần này cần được bổ sung với các screenshot thực tế từ ứng dụng. Dưới đây là mô tả các màn hình cần có:*

### 1. Trang chủ:
- Header với logo, search bar (hỗ trợ tìm kiếm bằng hình ảnh), giỏ hàng, tài khoản
- Banner quảng cáo
- Danh mục sản phẩm
- Sản phẩm nổi bật
- "Bạn có thể thích" với tabs theo danh mục
- Footer với thông tin liên hệ, chính sách

### 2. Trang danh sách sản phẩm:
- Sidebar với bộ lọc (danh mục, thương hiệu, khoảng giá)
- Grid view sản phẩm với hình ảnh, tên, giá, discount
- Pagination
- Sort options (giá, độ phổ biến, đánh giá)

### 3. Trang chi tiết sản phẩm:
- Hình ảnh sản phẩm (gallery)
- Tên sản phẩm, giá, discount
- Chọn biến thể (màu sắc, kích thước, v.v.)
- Mô tả sản phẩm
- Đánh giá và reviews
- "Sản phẩm cùng loại" / "Bạn có thể thích"
- Nút "Thêm vào giỏ hàng" và "Mua ngay"

### 4. Trang tìm kiếm:
- Kết quả tìm kiếm với highlight từ khóa
- Filters và sorting
- Suggestion khi không có kết quả

### 5. Trang tìm kiếm bằng hình ảnh:
- Upload image interface
- Kết quả tìm kiếm với độ tương đồng (similarity score)
- Grid view sản phẩm tương tự

### 6. Trang giỏ hàng:
- Danh sách sản phẩm trong giỏ hàng
- Tổng tiền, phí vận chuyển
- Mã giảm giá
- Nút "Thanh toán"

### 7. Trang thanh toán:
- Thông tin giao hàng
- Phương thức vận chuyển
- Phương thức thanh toán (VNPay)
- Tóm tắt đơn hàng

### 8. Trang tài khoản:
- Thông tin cá nhân
- Địa chỉ giao hàng
- Lịch sử đơn hàng
- Wishlist
- Đánh giá của tôi

### 9. Admin Dashboard:
- Tổng quan với các metrics (doanh số, đơn hàng, người dùng)
- Charts và graphs
- Quick actions

### 10. Admin - Quản lý sản phẩm:
- Danh sách sản phẩm với CRUD operations
- Upload hình ảnh
- Quản lý biến thể và giá

### 11. Admin - Quản lý đơn hàng:
- Danh sách đơn hàng với filters
- Chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng

---

**Ghi chú:** Để hoàn thiện phần này, cần chụp screenshot các màn hình thực tế từ ứng dụng và chèn vào tài liệu. Các screenshot nên bao gồm:
- Giao diện desktop và mobile
- Các tính năng chính: tìm kiếm, khuyến nghị, thanh toán
- Admin panel với các chức năng quản trị
- Responsive design trên các thiết bị khác nhau






