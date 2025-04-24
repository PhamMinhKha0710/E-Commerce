// ProductRelated.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { RelatedProduct } from '@/app/products/ProductType';
import Image from 'next/image';
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';
import 'swiper/css';
import 'swiper/css/navigation';

// Mock data cho sản phẩm liên quan
const mockRelatedProducts: RelatedProduct[] = [
  {
    slug: 'iphone-14-pro-max-1',
    name: 'iPhone 14 Pro Max 1',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 26000000,
    oldPrice: 28000000,
  },
  {
    slug: 'iphone-14-pro-max-2',
    name: 'iPhone 14 Pro Max 2',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 27000000,
    oldPrice: 29000000,
  },
  {
    slug: 'iphone-14-pro-max-3',
    name: 'iPhone 14 Pro Max 3',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 25000000,
    oldPrice: 27000000,
  },
  {
    slug: 'iphone-14-pro-max-4',
    name: 'iPhone 14 Pro Max 4',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 28000000,
    oldPrice: 30000000,
  },
  {
    slug: 'iphone-14-pro-max-5',
    name: 'iPhone 14 Pro Max 5',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 29000000,
    oldPrice: 31000000,
  },
  {
    slug: 'iphone-14-pro-max-6',
    name: 'iPhone 14 Pro Max 6',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 24000000,
    oldPrice: 26000000,
  },
  {
    slug: 'iphone-14-pro-max-6',
    name: 'iPhone 14 Pro Max 6',
    image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    price: 24000000,
    oldPrice: 26000000,
  },
];

// Hàm fetcher giả lập
const fetcher = async (): Promise<RelatedProduct[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRelatedProducts), 500); // Giả lập độ trễ mạng 500ms
  });
};

interface ProductRelatedProps {
  slug: string;
}

export default function ProductRelated({ slug }: ProductRelatedProps) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { data: relatedProducts, error } = useSWR<RelatedProduct[], Error>(
    inView ? `/api/products/${slug}/related?limit=6` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}₫`;
  };

  if (error) return <div>Error loading related products</div>;
  if (!relatedProducts) return <div ref={ref}>Loading related products...</div>;

  return (
    <div className="productRelate" ref={ref}>
      <div className="container">
        <div className="bg">
          <div className="block-title">
            <h2>
              <a href="danh-cho-ban.html" title="Sản phẩm cùng loại">Sản phẩm cùng loại</a>
            </h2>
          </div>
          <div className="margin-am">
            <Swiper
              modules={[Navigation]}
              slidesPerView={5}
              spaceBetween={30}
              navigation
              allowTouchMove={true}
              className="product-relate-swiper"
              breakpoints={{
                300: { slidesPerView: 2, spaceBetween: 15 },
                500: { slidesPerView: 2, spaceBetween: 15 },
                640: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                991: { slidesPerView: 4, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {relatedProducts.map((related, index) => (
                <SwiperSlide key={index}>
                  <div className="item_product_main">
                    <form
                      action="https://nd-mall.mysapo.net/cart/add"
                      method="post"
                      className="variants product-action"
                      data-cart-form
                      encType="multipart/form-data"
                    >
                      <div className="product-thumbnail">
                        <a className="image_thumb scale_hover" href={`${related.slug}.html`} title={related.name}>
                          <Image
                            className="lazyload"
                            width={200}
                            height={200}
                            src={related.image}
                            alt={related.name}
                            loading="lazy"
                          />
                        </a>
                        <span className="smart">
                          -{Math.round(((related.oldPrice - related.price) / related.oldPrice) * 100)}%
                        </span>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <a href={`${related.slug}.html`} title={related.name}>{related.name}</a>
                        </h3>
                        <div className="price-box">
                          {formatPrice(related.price)}{' '}
                          <span className="compare-price">{formatPrice(related.oldPrice)}</span>
                        </div>
                        <div className="actions-primary">
                          <input className="hidden" type="hidden" name="variantId" value="99496971" />
                          <button
                            className="btn-cart"
                            title="Tùy chọn"
                            type="button"
                            onClick={() => (window.location.href = `${related.slug}.html`)}
                          >
                            <svg className="icon icon-settings">
                              <use xlinkHref="#icon-settings"></use>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="action d-xl-block d-none">
                        <div className="actions-secondary">
                          <a
                            href="javascript:void(0)"
                            className="action btn-compare js-btn-wishlist setWishlist btn-views"
                            data-wish={related.slug}
                            title="Thêm vào yêu thích"
                          >
                            <svg className="icon">
                              <use xlinkHref="#icon-wishlist"></use>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}