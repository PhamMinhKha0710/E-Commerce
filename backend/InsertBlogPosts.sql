-- Script để insert dữ liệu blog posts vào database
-- Chạy script này sau khi đã tạo bảng BlogPosts

USE [YourDatabaseName]; -- Thay đổi tên database của bạn
GO

-- Xóa dữ liệu cũ nếu có (tùy chọn)
-- DELETE FROM BlogPosts;
-- GO

-- Insert bài viết 1: Xiaomi 13 đang được thử nghiệm MIUI 15
INSERT INTO BlogPosts (
    Title, 
    Slug, 
    Excerpt, 
    Content, 
    FeaturedImage, 
    Author, 
    PublishedDate, 
    UpdatedDate, 
    Category, 
    Tags, 
    IsPublished, 
    IsHighlighted, 
    ViewCount, 
    MetaTitle, 
    MetaDescription, 
    MetaKeywords, 
    CreatedAt, 
    UpdatedAt
)
VALUES (
    N'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
    'xiaomi-13-dang-duoc-thu-nghiem-miui-15-on-dinh-dua-tren-android-14',
    N'Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui. Điều này diễn ra sau một tuần Xiaomi tạm dừng phát triển MIUI 14 cho dòng Xiao...',
    N'<p>Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui. Điều này diễn ra sau một tuần Xiaomi tạm dừng phát triển MIUI 14 cho dòng Xiaomi 13.</p><p>MIUI 15 được xây dựng dựa trên Android 14 và mang đến nhiều cải tiến về hiệu năng, giao diện và tính năng mới. Người dùng có thể mong đợi trải nghiệm mượt mà hơn và nhiều tính năng thú vị.</p><p>Bản cập nhật này hiện đang trong giai đoạn thử nghiệm và dự kiến sẽ được phát hành chính thức trong thời gian tới.</p>',
    'https://bizweb.dktcdn.net/thumb/grande/100/497/938/articles/t12.jpg?v=1696325901413',
    N'Admin',
    GETUTCDATE(),
    NULL,
    N'Công nghệ',
    N'Xiaomi,MIUI 15,Android 14',
    1, -- IsPublished
    1, -- IsHighlighted
    0, -- ViewCount
    N'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
    N'Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui.',
    N'Xiaomi, MIUI 15, Android 14, Xiaomi 13',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Insert bài viết 2: Apple Pencil 3
INSERT INTO BlogPosts (
    Title, 
    Slug, 
    Excerpt, 
    Content, 
    FeaturedImage, 
    Author, 
    PublishedDate, 
    UpdatedDate, 
    Category, 
    Tags, 
    IsPublished, 
    IsHighlighted, 
    ViewCount, 
    MetaTitle, 
    MetaDescription, 
    MetaKeywords, 
    CreatedAt, 
    UpdatedAt
)
VALUES (
    N'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    'apple-pencil-3-kha-nang-co-co-che-thay-ngoi-cung-voi-tinh-nang-hoan-toan-moi',
    N'Apple Pencil 3 có thể sẽ có cơ chế thay ngòi mới cùng với nhiều tính năng hoàn toàn mới.',
    N'<p>Apple Pencil 3 được đồn đoán sẽ có nhiều cải tiến đáng kể so với các thế hệ trước. Một trong những tính năng được mong đợi nhất là cơ chế thay ngòi mới, cho phép người dùng tùy chỉnh trải nghiệm vẽ và viết.</p><p>Ngoài ra, Apple Pencil 3 còn được kỳ vọng sẽ có nhiều tính năng hoàn toàn mới, cải thiện độ chính xác và độ nhạy khi sử dụng với iPad.</p><p>Thông tin này vẫn chưa được Apple xác nhận chính thức, nhưng các nguồn tin rò rỉ đã gợi ý về những cải tiến này.</p>',
    'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t11.jpg?v=1696325869497',
    N'Admin',
    GETUTCDATE(),
    NULL,
    N'Công nghệ',
    N'Apple,Apple Pencil',
    1,
    1,
    0,
    N'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    N'Apple Pencil 3 có thể sẽ có cơ chế thay ngòi mới cùng với nhiều tính năng hoàn toàn mới.',
    N'Apple, Apple Pencil, iPad',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Insert bài viết 3: Tư vấn chọn mua laptop HP
INSERT INTO BlogPosts (
    Title, 
    Slug, 
    Excerpt, 
    Content, 
    FeaturedImage, 
    Author, 
    PublishedDate, 
    UpdatedDate, 
    Category, 
    Tags, 
    IsPublished, 
    IsHighlighted, 
    ViewCount, 
    MetaTitle, 
    MetaDescription, 
    MetaKeywords, 
    CreatedAt, 
    UpdatedAt
)
VALUES (
    N'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    'tu-van-chon-mua-laptop-hp-ho-tro-tac-vu-hoc-tap-van-phong-co-ban-ban-chay-tai-tgdd',
    N'Hướng dẫn chi tiết cách chọn mua laptop HP phù hợp cho học tập và văn phòng.',
    N'<p>Laptop HP là một trong những lựa chọn phổ biến cho học sinh, sinh viên và nhân viên văn phòng. Với nhiều dòng sản phẩm đa dạng, từ giá rẻ đến cao cấp, HP có thể đáp ứng mọi nhu cầu sử dụng.</p><p>Khi chọn mua laptop HP cho học tập và văn phòng, bạn cần quan tâm đến các yếu tố như: hiệu năng xử lý, dung lượng RAM, dung lượng ổ cứng, màn hình, pin và giá cả.</p><p>Một số dòng laptop HP bán chạy tại TGDĐ như HP Pavilion, HP ProBook, HP EliteBook đều là những lựa chọn tốt cho nhu cầu học tập và văn phòng cơ bản.</p>',
    'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t10.jpg?v=1696325835147',
    N'Admin',
    GETUTCDATE(),
    NULL,
    N'Mẹo vặt',
    N'Laptop,HP',
    1,
    0,
    0,
    N'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    N'Hướng dẫn chi tiết cách chọn mua laptop HP phù hợp cho học tập và văn phòng.',
    N'Laptop HP, Tư vấn mua laptop, Laptop học tập',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Insert bài viết 4: Apple dự kiến đưa công cụ AI lên App Store
INSERT INTO BlogPosts (
    Title, 
    Slug, 
    Excerpt, 
    Content, 
    FeaturedImage, 
    Author, 
    PublishedDate, 
    UpdatedDate, 
    Category, 
    Tags, 
    IsPublished, 
    IsHighlighted, 
    ViewCount, 
    MetaTitle, 
    MetaDescription, 
    MetaKeywords, 
    CreatedAt, 
    UpdatedAt
)
VALUES (
    N'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    'apple-du-kien-se-som-dua-mot-cong-cu-manh-me-tich-hop-ai-len-app-store',
    N'Apple đang phát triển công cụ AI mạnh mẽ và sẽ sớm tích hợp vào App Store.',
    N'<p>Apple đang trong quá trình phát triển một công cụ AI mạnh mẽ và dự kiến sẽ sớm tích hợp vào App Store. Công cụ này sẽ giúp cải thiện trải nghiệm người dùng và tối ưu hóa việc tìm kiếm ứng dụng.</p><p>Với sự phát triển nhanh chóng của công nghệ AI, Apple không muốn bị tụt hậu so với các đối thủ như Google và Microsoft. Công cụ AI mới này sẽ được tích hợp sâu vào hệ sinh thái Apple.</p><p>Người dùng có thể mong đợi những tính năng thông minh hơn trong việc đề xuất ứng dụng, tối ưu hóa hiệu năng và cá nhân hóa trải nghiệm.</p>',
    'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t9.jpg?v=1696325755650',
    N'Admin',
    GETUTCDATE(),
    NULL,
    N'Công nghệ',
    N'Apple,AI',
    1,
    1,
    0,
    N'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    N'Apple đang phát triển công cụ AI mạnh mẽ và sẽ sớm tích hợp vào App Store.',
    N'Apple, AI, App Store, Công nghệ',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Insert bài viết 5: Combo tai nghe + loa
INSERT INTO BlogPosts (
    Title, 
    Slug, 
    Excerpt, 
    Content, 
    FeaturedImage, 
    Author, 
    PublishedDate, 
    UpdatedDate, 
    Category, 
    Tags, 
    IsPublished, 
    IsHighlighted, 
    ViewCount, 
    MetaTitle, 
    MetaDescription, 
    MetaKeywords, 
    CreatedAt, 
    UpdatedAt
)
VALUES (
    N'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    'tam-gia-1-trieu-rinh-ngay-combo-tai-nghe-loa-nay-chat-luong-khoi-ban-chill-nhac-mien-che',
    N'Combo tai nghe và loa giá rẻ nhưng chất lượng tốt, phù hợp cho người yêu nhạc.',
    N'<p>Với tầm giá chỉ khoảng 1 triệu đồng, bạn có thể sở hữu combo tai nghe và loa chất lượng cao. Đây là một lựa chọn tuyệt vời cho những người yêu nhạc nhưng có ngân sách hạn chế.</p><p>Combo này bao gồm tai nghe không dây với chất lượng âm thanh tốt và loa Bluetooth nhỏ gọn, dễ mang theo. Cả hai đều có thiết kế đẹp mắt và chất lượng xây dựng bền bỉ.</p><p>Với combo này, bạn có thể tận hưởng âm nhạc mọi lúc mọi nơi, từ việc nghe nhạc cá nhân đến việc chia sẻ với bạn bè qua loa.</p>',
    'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t8.jpg?v=1696325716373',
    N'Admin',
    GETUTCDATE(),
    NULL,
    N'Mẹo vặt',
    N'Tai nghe,Loa',
    1,
    0,
    0,
    N'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    N'Combo tai nghe và loa giá rẻ nhưng chất lượng tốt, phù hợp cho người yêu nhạc.',
    N'Tai nghe, Loa, Combo, Giá rẻ',
    GETUTCDATE(),
    GETUTCDATE()
);
GO

-- Kiểm tra dữ liệu đã insert
SELECT 
    Id,
    Title,
    Slug,
    Category,
    IsPublished,
    IsHighlighted,
    CreatedAt
FROM BlogPosts
ORDER BY Id;
GO

