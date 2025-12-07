'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { RelatedProduct } from '@/app/products/ProductType';
import Image from 'next/image';
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { wishlistService } from '@/services/wishlistService';
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
  price: string | number; // API có thể trả về "575000 VND" hoặc số
  comparePrice: string | number | null;
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
  return data.map((item) => {
    // Parse price từ format "575000 VND" hoặc "575000" thành số
    const parsePrice = (priceStr: string | number): number => {
      if (typeof priceStr === 'number') return priceStr;
      // Loại bỏ tất cả ký tự không phải số
      const numStr = String(priceStr).replace(/[^\d]/g, '');
      return parseInt(numStr, 10) || 0;
    };

    const priceNum = parsePrice(item.price);
    const comparePriceNum = item.comparePrice ? parsePrice(item.comparePrice) : null;
    
    // Đảm bảo href đúng format: /products/{productId}-{slug}
    const href = item.href || (item.slug ? `/products/${item.productId}-${item.slug}` : '#');

    return {
      categoryId: item.categoryId,
      productId: String(item.productId),
      productName: item.productName || 'Sản phẩm không tên',
      href: href,
      slug: item.slug || '',
      imageUrl: item.imageUrl || 'https://via.placeholder.com/200',
      price: String(priceNum),
      comparePrice: comparePriceNum ? String(comparePriceNum) : null,
      discount: item.discount,
      hasVariations: item.hasVariations,
      contact: item.contact,
      productItemId: item.productItemId,
    };
  });
};

interface ProductRelatedProps {
  productId: string;
}

export default function ProductRelated({ productId }: ProductRelatedProps) {
  const { isLoggedIn } = useAuth();
  const { ref, inView } = useInView({ triggerOnce: true });
  const [wishlistStatus, setWishlistStatus] = useState<Record<number, boolean>>({});
  const { data: relatedProducts, error } = useSWR<RelatedProduct[], Error>(
    inView ? [`http://localhost:5130/api/Recommendations/recommend?productId=${productId}&categoryId=2&limit=6`, isLoggedIn] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  // Kiểm tra wishlist status cho các sản phẩm
  useEffect(() => {
    if (!relatedProducts || !isLoggedIn) {
      setWishlistStatus({});
      return;
    }

    const checkWishlistStatus = async () => {
      try {
        await wishlistService.getWishlist();
        const status: Record<number, boolean> = {};
        relatedProducts.forEach((product) => {
          const productIdNum = parseInt(product.productId, 10);
          if (!isNaN(productIdNum)) {
            status[productIdNum] = wishlistService.isInWishlist(productIdNum);
          }
        });
        setWishlistStatus(status);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();

    // Lắng nghe sự kiện wishlist updated
    const handleWishlistUpdate = () => {
      if (relatedProducts) {
        const status: Record<number, boolean> = {};
        relatedProducts.forEach((product) => {
          const productIdNum = parseInt(product.productId, 10);
          if (!isNaN(productIdNum)) {
            status[productIdNum] = wishlistService.isInWishlist(productIdNum);
          }
        });
        setWishlistStatus(status);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
      }
    };
  }, [relatedProducts, isLoggedIn]);

  const formatPrice = (price: string) => {
    // Parse price và format với dấu chấm phân cách hàng nghìn
    const priceNum = parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
    return `${priceNum.toLocaleString('vi-VN')}₫`;
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

  // Component WishlistButton
  const WishlistButton = ({ 
    productId, 
    slug, 
    isInWishlist, 
    isLoggedIn 
  }: { 
    productId: number; 
    slug: string; 
    isInWishlist: boolean; 
    isLoggedIn: boolean;
  }) => {
    const handleWishlistClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để quản lý danh sách yêu thích');
        return;
      }

      if (isNaN(productId)) return;

      try {
        if (isInWishlist) {
          await wishlistService.removeFromWishlist(productId);
        } else {
          await wishlistService.addToWishlist(productId);
        }
        
        // Cập nhật state
        setWishlistStatus(prev => ({
          ...prev,
          [productId]: !isInWishlist
        }));

        // Dispatch event để các component khác cập nhật
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      } catch (error) {
        console.error('Không thể cập nhật wishlist:', error);
        alert('Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.');
      }
    };

    return (
      <a
        href="#"
        className={`action btn-compare js-btn-wishlist setWishlist btn-views ${isInWishlist ? 'active' : ''}`}
        data-wish={slug}
        title={isInWishlist ? "Đã yêu thích" : "Thêm vào yêu thích"}
        onClick={handleWishlistClick}
      >
        {isInWishlist ? (
          // Icon đầy (filled) khi đã yêu thích
          <svg 
            className="icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
            width="24"
            height="24"
          >
            <path 
              fill="#fd213b" 
              d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v-5.8c0 41.5 17.2 81.2 47.6 109.5z"
            />
          </svg>
        ) : (
          // Icon viền (outline) khi chưa yêu thích
          <svg 
            className="icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
            width="24"
            height="24"
          >
            <path 
              fill="none"
              stroke="#fd213b"
              strokeWidth="32"
              d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.1-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
            />
          </svg>
        )}
      </a>
    );
  };

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
                        {related.comparePrice && related.discount && (
                          <span className="smart">
                            {related.discount.startsWith('-') ? related.discount : `-${related.discount}`}
                          </span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <a href={related.href} title={related.productName}>{related.productName}</a>
                        </h3>
                        <div className="price-box">
                          {related.price ? (
                            <>
                              <span className="price">{formatPrice(related.price)}</span>
                              {related.comparePrice && (
                                <span className="compare-price">{formatPrice(related.comparePrice)}</span>
                              )}
                            </>
                          ) : (
                            'Liên hệ'
                          )}
                        </div>
                        <div className="actions-primary">
                          <input className="hidden" type="hidden" name="variantId" value={related.productItemId || ''} />
                          {related.hasVariations ? (
                            <button
                              className="btn-cart add_to_cart"
                              title="Tùy chọn"
                              type="button"
                              onClick={() => (window.location.href = related.href)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 512 512"
                                fill="#f03248"
                                className="icon icon-settings"
                              >
                                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="btn-cart add_to_cart"
                              title="Thêm vào giỏ hàng"
                              type="button"
                              onClick={() => (window.location.href = related.href)}
                            >
                              <svg
                                fill="#f03248"
                                height="24px"
                                width="24px"
                                version="1.1"
                                viewBox="0 0 483.1 483.1"
                                className="icon icon-cart"
                              >
                                <g>
                                  <path d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6 c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3 C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1 c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z" />
                                  <path d="M301.45,290h-47.9v-47.9c0-6.6-5.4-12-12-12s-12,5.4-12,12V290h-47.9c-6.6,0-12,5.4-12,12s5.4,12,12,12h47.9v47.9 c0,6.6,5.4,12,12,12s12-5.4,12-12V314h47.9c6.6,0,12-5.4,12-12S308.05,290,301.45,290z" />
                                </g>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="action d-xl-block d-none">
                        <div className="actions-secondary">
                          <WishlistButton 
                            productId={parseInt(related.productId, 10)} 
                            slug={related.slug || ''}
                            isInWishlist={wishlistStatus[parseInt(related.productId, 10)] || false}
                            isLoggedIn={isLoggedIn}
                          />
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