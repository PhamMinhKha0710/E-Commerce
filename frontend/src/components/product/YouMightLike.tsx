"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useAddToCart";
import { categoryProductService, CategoryProduct } from "@/services/categoryProductService";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

type Product = CategoryProduct & {
  contact?: boolean;
};

interface YouMightLikeProps {
  productId?: number;
  categoryId?: number;
  categorySlug?: string;
  title?: string;
  limit?: number;
  showDescription?: boolean;
}

/**
 * Component "Bạn Có Thể Thích" - Hiển thị sản phẩm gợi ý
 * 
 * Sử dụng Hybrid Recommendation System kết hợp:
 * - Content-Based Filtering: Dựa trên đặc tính sản phẩm (category, brand, price, name)
 * - Popularity-Based Filtering: Dựa trên độ phổ biến (views, sales, ratings)
 * - Collaborative Filtering: Dựa trên hành vi người dùng tương tự
 * 
 * @param productId - ID sản phẩm đang xem (cho content-based recommendation)
 * @param categoryId - ID danh mục (tùy chọn)
 * @param categorySlug - Slug danh mục (tùy chọn)
 * @param title - Tiêu đề section (mặc định: "Bạn có thể thích")
 * @param limit - Số lượng sản phẩm hiển thị (mặc định: 6)
 * @param showDescription - Hiển thị mô tả về thuật toán (mặc định: false)
 */
const YouMightLike: React.FC<YouMightLikeProps> = ({
  productId,
  categoryId,
  categorySlug,
  title = "Bạn có thể thích",
  limit = 6,
  showDescription = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useAddToCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedProducts = await categoryProductService.getProductsByCategory({
          categoryId,
          categorySlug,
          productId,
          limit,
          useRecommendations: true,
          recommendationType: 'hybrid', // Sử dụng hybrid system
        });

        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          setError("Không tìm thấy sản phẩm gợi ý");
        }
      } catch (err: any) {
        console.error("[YouMightLike] Error fetching products:", err);
        setError("Đã xảy ra lỗi khi tải sản phẩm gợi ý");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId, categoryId, categorySlug, limit]);

  const handleAddToCart = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!product.hasVariations) {
      const priceStr = product.price?.replace(/[^\d]/g, '') || '0';
      const numericPrice = parseInt(priceStr, 10) || 0;
        
      addToCart({
        productId: parseInt(product.productId), 
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: numericPrice,
        quantity: 1,
        currency: "VND",
        hasVariations: false,
        productItemId: product.productItemId || null,
        cartegoryId: product.categoryId || 0,
      });
    } else {
      window.location.href = product.href;
    }
  };

  if (loading) {
    return (
      <div className="section_product_tab section_product_tab_2">
        <div className="container">
          <div className="color-bg">
            <div className="block-title">
              <h2>{title}</h2>
            </div>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
              <p style={{ marginTop: '16px', color: '#666' }}>Đang tải sản phẩm gợi ý...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="section_product_tab section_product_tab_2">
        <div className="container">
          <div className="color-bg">
            <div className="block-title">
              <h2>{title}</h2>
            </div>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#999' }}>{error || "Chưa có sản phẩm gợi ý"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section_product_tab section_product_tab_2">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-tab-2.png?1736305669595"
                alt={title}
                width={20}
                height={19}
              />
              {title}
            </h2>
          </div>
          {showDescription && (
            <div style={{ 
              padding: '15px 20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#666'
            }}>
              <strong>💡 Thuật toán gợi ý thông minh:</strong> Hệ thống sử dụng Hybrid Recommendation System 
              kết hợp 3 thuật toán: <strong>Content-Based</strong> (dựa trên đặc tính sản phẩm), 
              <strong> Popularity-Based</strong> (dựa trên độ phổ biến), và <strong>Collaborative Filtering</strong> 
              (dựa trên hành vi người dùng tương tự) để đưa ra gợi ý phù hợp nhất cho bạn.
            </div>
          )}
          <div className="block-content">
            <Swiper
              modules={[Navigation]}
              slidesPerView={5}
              spaceBetween={20}
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
              {products.map((product) => (
                <SwiperSlide key={product.productId}>
                  <div className="item_product_main">
                    <form
                      onSubmit={(e) => handleAddToCart(e, product)}
                      className="variants product-action"
                      data-cart-form
                      data-id={`product-actions-${product.productId}`}
                      encType="multipart/form-data"
                    >
                      <div className="product-thumbnail">
                        <Link 
                          href={product.href} 
                          className="image_thumb scale_hover"
                        >
                          <Image
                            className="lazyload"
                            src={product.imageUrl}
                            alt={product.productName}
                            width={200}
                            height={200}
                            loading="lazy"
                          />
                        </Link>
                        {product.discount && (
                          <span className="smart">{product.discount}</span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <Link href={product.href}>
                            {product.productName}
                          </Link>
                        </h3>
                        <div className="price-box">
                          {product.price || 'Liên hệ'}
                          {product.comparePrice && (
                            <span className="compare-price">{product.comparePrice}</span>
                          )}
                        </div>
                        <div className="actions-primary">
                          <input type="hidden" name="productId" value={product.productId} />
                          {product.hasVariations ? (
                            <button
                              className="btn-cart add_to_cart"
                              title="Tùy chọn"
                              type="submit"
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
                              type="submit"
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
};

export default YouMightLike;








