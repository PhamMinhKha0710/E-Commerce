"use client"; // Thêm "use client" vì sử dụng useState

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { bigNews, smallNews, getPostsByCategory } from '@/data/blogPosts';

// Lấy bài viết Mẹo vặt
const promotionNews = getPostsByCategory('Mẹo vặt');

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
              <Link href={`/tin-tuc/${bigNews.slug}`} title={bigNews.title}>
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
                <Link key={post.slug} href={`/tin-tuc/${post.slug}`} title={post.title}>
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
                      <Link href={`/tin-tuc/${post.slug}`} title={post.title} className="thumb">
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
                          <Link href={`/tin-tuc/${post.slug}`} title={post.title}>
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