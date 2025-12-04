'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { RelatedProduct } from '@/app/products/ProductType';
import Image from 'next/image';
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/context/AuthContext';
import 'swiper/css';
import 'swiper/css/navigation';

// Giao diện cho dữ liệu thô từ API
interface ApiRelatedProduct {
  categoryId: number;
  productId: number;
  productName: string | null;
  href: string | null;
  slug: string | null;
  imageUrl: string | null;
  price: number;
  comparePrice: number | null;
  discount: string | null;
  hasVariations: boolean;
  contact: boolean;
  productItemId: number | null;
}

const fetcher = async ([url, isLoggedIn]: [string, boolean]): Promise<RelatedProduct[]> => {
  const headers: HeadersInit = { accept: 'application/json' };
  if (isLoggedIn) {
    const accessToken = localStorage.getItem('accessToken') || '';
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch related products: ${res.status} - ${errorText}`);
  }
  const data: ApiRelatedProduct[] = await res.json();
  // Chuyển đổi dữ liệu sang RelatedProduct
  return data.map((item) => ({
    categoryId: item.categoryId,
    productId: String(item.productId),
    productName: item.productName || 'Sản phẩm không tên',
    href: item.href || '#',
    slug: item.slug || '',
    imageUrl: item.imageUrl || 'https://via.placeholder.com/200',
    price: String(item.price),
    comparePrice: item.comparePrice ? String(item.comparePrice) : null,
    discount: item.discount,
    hasVariations: item.hasVariations,
    contact: item.contact,
    productItemId: item.productItemId,
  }));
};

interface ProductRelatedProps {
  productId: string;
}

export default function ProductRelated({ productId }: ProductRelatedProps) {
  const { isLoggedIn } = useAuth();
  const { ref, inView } = useInView({ triggerOnce: true });
  const { data: relatedProducts, error } = useSWR<RelatedProduct[], Error>(
    inView ? [`http://localhost:5130/api/Recommendations/recommend?productId=${productId}&categoryId=2&limit=6`, isLoggedIn] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const formatPrice = (price: string) => {
    return `${parseInt(price).toLocaleString('vi-VN')}₫`;
  };

  const calculateDiscount = (price: string, comparePrice: string) => {
    const priceNum = parseInt(price);
    const comparePriceNum = parseInt(comparePrice);
    if (comparePriceNum <= priceNum) return '0%';
    return `${Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100)}%`;
  };

  if (error) return <div>Lỗi khi tải sản phẩm liên quan</div>;
  if (!relatedProducts) return <div ref={ref}>Đang tải sản phẩm liên quan...</div>;

  // Lọc các sản phẩm có đủ thông tin cần thiết
  const validProducts = relatedProducts.filter(
    (product) => product.productName !== 'Sản phẩm không tên' && product.imageUrl !== 'https://via.placeholder.com/200' && product.href !== '#'
  );

  if (validProducts.length === 0) return <div>Không có sản phẩm liên quan</div>;

  return (
    <div className="productRelate" ref={ref}>
      <div className="container">
        <div className="bg">
          <div className="block-title">
            <h2>
              <a href="#" title="Sản phẩm cùng loại">Sản phẩm cùng loại</a>
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
              {validProducts.map((related, index) => (
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
                        <a className="image_thumb scale_hover" href={related.href} title={related.productName}>
                          <Image
                            className="lazyload"
                            width={200}
                            height={200}
                            src={related.imageUrl}
                            alt={related.productName}
                            loading="lazy"
                          />
                        </a>
                        {related.comparePrice && (
                          <span className="smart">
                            -{related.discount || calculateDiscount(related.price || '0', related.comparePrice)}
                          </span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <a href={related.href} title={related.productName}>{related.productName}</a>
                        </h3>
                        <div className="price-box">
                          {related.price ? formatPrice(related.price) : 'Liên hệ'}{' '}
                          {related.comparePrice && (
                            <span className="compare-price">{formatPrice(related.comparePrice)}</span>
                          )}
                        </div>
                        <div className="actions-primary">
                          <input className="hidden" type="hidden" name="variantId" value={related.productItemId || ''} />
                          <button
                            className="btn-cart"
                            title="Tùy chọn"
                            type="button"
                            onClick={() => (window.location.href = related.href)}
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
                            href="#"
                            className="action btn-compare js-btn-wishlist setWishlist btn-views"
                            data-wish={related.slug}
                            title="Thêm vào yêu thích"
                            onClick={(e) => e.preventDefault()}
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