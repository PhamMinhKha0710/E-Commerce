//ProductRelated.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Product } from '@/app/products/ProductType';
import Image from 'next/image'; // Import Image từ Next.js
import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedProductProps {
  relatedProducts: Product[];
}

export default function ProductRelated({ relatedProducts }: RelatedProductProps) {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}₫`;
  };

  return (
    <div className="productRelate">
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
                            loading="lazy" // Tối ưu hóa tải ảnh
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