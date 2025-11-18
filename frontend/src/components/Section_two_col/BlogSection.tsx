"use client"; // Thêm "use client" vì sử dụng useState

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho bài viết
interface BlogPost {
  title: string;
  slug: string;
  imageUrl: string;
  description?: string; // Chỉ dành cho bài viết lớn
}

// Dữ liệu bài viết
const bigNews: BlogPost = {
  title: 'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
  slug: 'xiaomi-13-dang-duoc-thu-nghiem-miui-15-on-dinh-dua-tren-android-14',
  imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/497/938/articles/t12.jpg?v=1696325901413',
  description:
    'Xiaomi đang thử nghiệm bản cập nhật ổn định MIUI 15 cho Xiaomi 13 Series, theo báo cáo mới từ Xiaomiui. Điều này diễn ra sau một tuần Xiaomi tạm dừng phát triển MIUI 14 cho dòng Xiao...',
};

const smallNews: BlogPost[] = [
  {
    title: 'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    slug: 'apple-pencil-3-kha-nang-co-co-che-thay-ngoi-cung-voi-tinh-nang-hoan-toan-moi',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t11.jpg?v=1696325869497',
  },
  {
    title: 'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    slug: 'tu-van-chon-mua-laptop-hp-ho-tro-tac-vu-hoc-tap-van-phong-co-ban-ban-chay-tai-tgdd',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t10.jpg?v=1696325835147',
  },
  {
    title: 'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    slug: 'apple-du-kien-se-som-dua-mot-cong-cu-manh-me-tich-hop-ai-len-app-store',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t9.jpg?v=1696325755650',
  },
  {
    title: 'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    slug: 'tam-gia-1-trieu-rinh-ngay-combo-tai-nghe-loa-nay-chat-luong-khoi-ban-chill-nhac-mien-che',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t8.jpg?v=1696325716373',
  },
];

const promotionNews: BlogPost[] = [
  {
    title: 'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
    slug: 'xiaomi-13-dang-duoc-thu-nghiem-miui-15-on-dinh-dua-tren-android-14',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t12.jpg?v=1696325901413',
  },
  {
    title: 'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    slug: 'apple-pencil-3-kha-nang-co-co-che-thay-ngoi-cung-voi-tinh-nang-hoan-toan-moi',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t11.jpg?v=1696325869497',
  },
  {
    title: 'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    slug: 'tu-van-chon-mua-laptop-hp-ho-tro-tac-vu-hoc-tap-van-phong-co-ban-ban-chay-tai-tgdd',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t10.jpg?v=1696325835147',
  },
  {
    title: 'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    slug: 'apple-du-kien-se-som-dua-mot-cong-cu-manh-me-tich-hop-ai-len-app-store',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t9.jpg?v=1696325755650',
  },
  {
    title: 'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    slug: 'tam-gia-1-trieu-rinh-ngay-combo-tai-nghe-loa-nay-chat-luong-khoi-ban-chill-nhac-mien-che',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t8.jpg?v=1696325716373',
  },
];

// Component BlogSection
const BlogSection: React.FC = () => {
  const [isBigNewsLoaded, setIsBigNewsLoaded] = useState(false);
  const [smallNewsLoaded, setSmallNewsLoaded] = useState<Record<string, boolean>>({});
  const [promotionNewsLoaded, setPromotionNewsLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="section_blogs">
      <div className="container">
        <div className="index-white-bg clearfix">
          <div className="title clearfix">
            <h2 className="titlecate">
              <Link href="/tin-tuc" title="Tin tức mới nhất">
                Tin tức mới nhất
              </Link>
            </h2>
            <Link href="/tin-tuc" className="viewall" title="Xem thêm Tin tức mới nhất">
              Xem thêm <b>Tin tức mới nhất</b> ❯
            </Link>
          </div>
          <div className="row">
            {/* Big News */}
            <div className="col-lg-4 col-md-6 index-big-news">
              <Link href={`/${bigNews.slug}.html`} title={bigNews.title}>
                <div className="zone-youtube">
                  <Image
                    src={bigNews.imageUrl}
                    alt={bigNews.title}
                    width={400}
                    height={300}
                    className={`lazyload img-responsive mx-auto d-block ${isBigNewsLoaded ? 'loaded' : ''}`}
                    onLoad={() => setIsBigNewsLoaded(true)}
                  />
                </div>
                <p>{bigNews.title}</p>
                <div className="zone-content">{bigNews.description}</div>
              </Link>
            </div>

            {/* Small News */}
            <div className="col-lg-5 col-md-6 index-small-news">
              {smallNews.map((post) => (
                <Link key={post.slug} href={`/${post.slug}.html`} title={post.title}>
                  <div className="zone-news">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={150}
                      height={100}
                      className={`lazyload img-responsive mx-auto d-block ${smallNewsLoaded[post.slug] ? 'loaded' : ''}`}
                      onLoad={() => setSmallNewsLoaded((prev) => ({ ...prev, [post.slug]: true }))}
                    />
                  </div>
                  <p>{post.title}</p>
                </Link>
              ))}
            </div>

            {/* Promotion News */}
            <div className="col-lg-3 col-md-12 index-promotion-news-block">
              <div className="index-promotion-news">
                <h3>
                  <Link href="/tin-tuc" title="Mẹo vặt">
                    Mẹo vặt
                  </Link>
                </h3>
                <div className="index-list">
                  {promotionNews.map((post) => (
                    <article key={post.slug} className="item clearfix">
                      <Link href={`/${post.slug}.html`} title={post.title} className="thumb">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          width={100}
                          height={75}
                          className={`lazyload img-responsive center-block ${promotionNewsLoaded[post.slug] ? 'loaded' : ''}`}
                          onLoad={() => setPromotionNewsLoaded((prev) => ({ ...prev, [post.slug]: true }))}
                        />
                      </Link>
                      <div className="info">
                        <h4 className="title usmall">
                          <Link href={`/${post.slug}.html`} title={post.title}>
                            {post.title}
                          </Link>
                        </h4>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;