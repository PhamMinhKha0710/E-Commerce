// Dữ liệu bài viết tin tức
export interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  description?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  publishedDate?: string;
  category?: string;
  tags?: string[];
  isHighlighted?: boolean;
}

// Bài viết lớn (featured)
export const bigNews: BlogPostData = {
  id: 1,
  title: 'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
  slug: 'xiaomi-13-dang-duoc-thu-nghiem-miui-15-on-dinh-dua-tren-android-14',
  imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/497/938/articles/t12.jpg?v=1696325901413',
  description: 'Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui. Điều này diễn ra sau một tuần Xiaomi tạm dừng phát triển MIUI 14 cho dòng Xiao...',
  excerpt: 'Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui.',
  content: '<p>Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui. Điều này diễn ra sau một tuần Xiaomi tạm dừng phát triển MIUI 14 cho dòng Xiaomi 13.</p><p>MIUI 15 được xây dựng dựa trên Android 14 và mang đến nhiều cải tiến về hiệu năng, giao diện và tính năng mới. Người dùng có thể mong đợi trải nghiệm mượt mà hơn và nhiều tính năng thú vị.</p><p>Bản cập nhật này hiện đang trong giai đoạn thử nghiệm và dự kiến sẽ được phát hành chính thức trong thời gian tới. Các tính năng mới bao gồm cải thiện hiệu năng, tối ưu hóa pin, và nhiều tùy chỉnh giao diện mới.</p>',
  author: 'Admin',
  publishedDate: new Date().toISOString(),
  category: 'Công nghệ',
  tags: ['Xiaomi', 'MIUI 15', 'Android 14'],
  isHighlighted: true,
};

// Bài viết nhỏ
export const smallNews: BlogPostData[] = [
  {
    id: 2,
    title: 'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    slug: 'apple-pencil-3-kha-nang-co-co-che-thay-ngoi-cung-voi-tinh-nang-hoan-toan-moi',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t11.jpg?v=1696325869497',
    excerpt: 'Apple Pencil 3 có thể sẽ có cơ chế thay ngòi mới cùng với nhiều tính năng hoàn toàn mới.',
    content: '<p>Apple Pencil 3 được đồn đoán sẽ có nhiều cải tiến đáng kể so với các thế hệ trước. Một trong những tính năng được mong đợi nhất là cơ chế thay ngòi mới, cho phép người dùng tùy chỉnh trải nghiệm vẽ và viết.</p><p>Ngoài ra, Apple Pencil 3 còn được kỳ vọng sẽ có nhiều tính năng hoàn toàn mới, cải thiện độ chính xác và độ nhạy khi sử dụng với iPad. Các tính năng này sẽ giúp người dùng có trải nghiệm tốt hơn khi vẽ, viết hoặc ghi chú.</p><p>Thông tin này vẫn chưa được Apple xác nhận chính thức, nhưng các nguồn tin rò rỉ đã gợi ý về những cải tiến này. Người dùng có thể mong đợi Apple Pencil 3 sẽ được ra mắt trong các sự kiện sắp tới của công ty.</p>',
    author: 'Admin',
    publishedDate: new Date().toISOString(),
    category: 'Công nghệ',
    tags: ['Apple', 'Apple Pencil'],
    isHighlighted: true,
  },
  {
    id: 3,
    title: 'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    slug: 'tu-van-chon-mua-laptop-hp-ho-tro-tac-vu-hoc-tap-van-phong-co-ban-ban-chay-tai-tgdd',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t10.jpg?v=1696325835147',
    excerpt: 'Hướng dẫn chi tiết cách chọn mua laptop HP phù hợp cho học tập và văn phòng.',
    content: '<p>Laptop HP là một trong những lựa chọn phổ biến cho học sinh, sinh viên và nhân viên văn phòng. Với nhiều dòng sản phẩm đa dạng, từ giá rẻ đến cao cấp, HP có thể đáp ứng mọi nhu cầu sử dụng.</p><p>Khi chọn mua laptop HP cho học tập và văn phòng, bạn cần quan tâm đến các yếu tố như: hiệu năng xử lý, dung lượng RAM, dung lượng ổ cứng, màn hình, pin và giá cả. Một laptop với CPU Intel Core i5 hoặc AMD Ryzen 5, RAM 8GB trở lên, và ổ cứng SSD sẽ phù hợp cho hầu hết các tác vụ cơ bản.</p><p>Một số dòng laptop HP bán chạy tại TGDĐ như HP Pavilion, HP ProBook, HP EliteBook đều là những lựa chọn tốt cho nhu cầu học tập và văn phòng cơ bản. Những dòng này có giá cả hợp lý và đáp ứng đủ các yêu cầu cần thiết.</p>',
    author: 'Admin',
    publishedDate: new Date().toISOString(),
    category: 'Mẹo vặt',
    tags: ['Laptop', 'HP'],
  },
  {
    id: 4,
    title: 'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    slug: 'apple-du-kien-se-som-dua-mot-cong-cu-manh-me-tich-hop-ai-len-app-store',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t9.jpg?v=1696325755650',
    excerpt: 'Apple đang phát triển công cụ AI mạnh mẽ và sẽ sớm tích hợp vào App Store.',
    content: '<p>Apple đang trong quá trình phát triển một công cụ AI mạnh mẽ và dự kiến sẽ sớm tích hợp vào App Store. Công cụ này sẽ giúp cải thiện trải nghiệm người dùng và tối ưu hóa việc tìm kiếm ứng dụng.</p><p>Với sự phát triển nhanh chóng của công nghệ AI, Apple không muốn bị tụt hậu so với các đối thủ như Google và Microsoft. Công cụ AI mới này sẽ được tích hợp sâu vào hệ sinh thái Apple, từ App Store đến các ứng dụng khác.</p><p>Người dùng có thể mong đợi những tính năng thông minh hơn trong việc đề xuất ứng dụng, tối ưu hóa hiệu năng và cá nhân hóa trải nghiệm. Công cụ này sẽ sử dụng machine learning để hiểu rõ hơn về sở thích và thói quen sử dụng của người dùng.</p>',
    author: 'Admin',
    publishedDate: new Date().toISOString(),
    category: 'Công nghệ',
    tags: ['Apple', 'AI'],
    isHighlighted: true,
  },
  {
    id: 5,
    title: 'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    slug: 'tam-gia-1-trieu-rinh-ngay-combo-tai-nghe-loa-nay-chat-luong-khoi-ban-chill-nhac-mien-che',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t8.jpg?v=1696325716373',
    excerpt: 'Combo tai nghe và loa giá rẻ nhưng chất lượng tốt, phù hợp cho người yêu nhạc.',
    content: '<p>Với tầm giá chỉ khoảng 1 triệu đồng, bạn có thể sở hữu combo tai nghe và loa chất lượng cao. Đây là một lựa chọn tuyệt vời cho những người yêu nhạc nhưng có ngân sách hạn chế.</p><p>Combo này bao gồm tai nghe không dây với chất lượng âm thanh tốt và loa Bluetooth nhỏ gọn, dễ mang theo. Cả hai đều có thiết kế đẹp mắt và chất lượng xây dựng bền bỉ. Tai nghe có khả năng chống ồn chủ động và thời lượng pin lên đến 30 giờ.</p><p>Với combo này, bạn có thể tận hưởng âm nhạc mọi lúc mọi nơi, từ việc nghe nhạc cá nhân đến việc chia sẻ với bạn bè qua loa. Đây là một khoản đầu tư xứng đáng cho những ai yêu thích âm nhạc.</p>',
    author: 'Admin',
    publishedDate: new Date().toISOString(),
    category: 'Mẹo vặt',
    tags: ['Tai nghe', 'Loa'],
  },
];

// Tất cả bài viết (bao gồm bài viết lớn và nhỏ)
export const allBlogPosts: BlogPostData[] = [bigNews, ...smallNews];

// Lấy bài viết nổi bật
export const getHighlightedPosts = (): BlogPostData[] => {
  return allBlogPosts.filter(post => post.isHighlighted);
};

// Lấy bài viết theo category
export const getPostsByCategory = (category: string): BlogPostData[] => {
  return allBlogPosts.filter(post => post.category === category);
};

// Lấy tất cả bài viết
export const getAllPosts = (): BlogPostData[] => {
  return allBlogPosts;
};

// Lấy bài viết theo slug
export const getPostBySlug = (slug: string): BlogPostData | undefined => {
  return allBlogPosts.find(post => post.slug === slug);
};

