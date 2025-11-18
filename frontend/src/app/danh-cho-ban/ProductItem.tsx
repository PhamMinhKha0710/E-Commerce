// components/ProductItem.tsx
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { wishlistService } from '@/services/wishlistService';

interface ProductItemProps {
  id: string;
  title: string;
  href: string;
  imgSrc: string;
  alt: string;
  price: string;
  comparePrice?: string;
  discount?: string;
  variantId: string;
  formAction: string;
  hasOptions?: boolean; // Vẫn giữ prop này để xử lý logic redirect
  isContact?: boolean; // Vẫn giữ prop này để xử lý logic redirect
  onAddToWishlist: (wish: string) => void;
  onAddToCart: (variantId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  title,
  href,
  imgSrc,
  alt,
  price,
  comparePrice,
  discount,
  variantId,
  formAction,
  hasOptions = false,
  isContact = false,
  onAddToWishlist,
  onAddToCart,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Kiểm tra trạng thái wishlist khi component mount và khi wishlist thay đổi
  useEffect(() => {
    const checkWishlist = () => {
      const productId = parseInt(id, 10);
      if (!isNaN(productId)) {
        setIsInWishlist(wishlistService.isInWishlist(productId));
      }
    };

    checkWishlist();

    // Lắng nghe event khi wishlist được cập nhật
    window.addEventListener('wishlistUpdated', checkWishlist);

    return () => {
      window.removeEventListener('wishlistUpdated', checkWishlist);
    };
  }, [id]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasOptions && !isContact) {
      onAddToCart(variantId);
    } else {
      window.location.href = href; // Chuyển hướng nếu có tùy chọn hoặc giá "Liên hệ"
    }
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onAddToWishlist(id);
  };

  return (
    <div className="col-20 col-6 col-xl-3 col-lg-3 col-md-3 padding">
      <div className="item_product_main">
        <form
          action={formAction}
          method="post"
          className={`variants product-action ${isContact ? 'contact' : ''}`}
          data-cart-form
          data-id={`product-actions-${id}`}
          encType="multipart/form-data"
          onSubmit={handleAddToCart}
        >
          <div className="product-thumbnail">
            <a className="image_thumb scale_hover" href={href} title={title}>
              <Image
                className="lazyload"
                src={imgSrc}
                alt={alt}
                width={200}
                height={200}
                loading="lazy"
              />
            </a>
            {discount && <span className="smart">{discount}</span>}
          </div>
          <div className="product-info">
            <h3 className="product-name">
              <a href={href} title={title}>{title}</a>
            </h3>
            <div className="price-box">
              {isContact ? 'Liên hệ' : (
                <>
                  {price} {comparePrice && <span className="compare-price">{comparePrice}</span>}
                </>
              )}
            </div>
            <div className="actions-primary">
              <input
                className={hasOptions || isContact ? 'hidden' : ''}
                type="hidden"
                name="variantId"
                value={variantId}
              />
              <button
                className="btn-cart add_to_cart"
                title="Thêm vào giỏ hàng"
                type={hasOptions || isContact ? 'button' : 'submit'} // Vẫn giữ logic type để xử lý redirect
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
                    <g>
                      <path d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6
                        c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3
                        C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z
                        M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1
                        c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z"/>
                      <path d="M301.45,290h-47.9v-47.9c0-6.6-5.4-12-12-12s-12,5.4-12,12V290h-47.9c-6.6,0-12,5.4-12,12s5.4,12,12,12h47.9v47.9
                        c0,6.6,5.4,12,12,12s12-5.4,12-12V314h47.9c6.6,0,12-5.4,12-12S308.05,290,301.45,290z"/>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="action d-xl-block d-none">
            <div className="actions-secondary">
              <a
                href="#"
                className={`action btn-compare js-btn-wishlist setWishlist btn-views ${isInWishlist ? 'active' : ''}`}
                data-wish={id}
                tabIndex={0}
                title={isInWishlist ? "Đã yêu thích" : "Thêm vào yêu thích"}
                onClick={handleWishlistClick}
              >
                {isInWishlist ? (
                  // Icon đầy (filled) khi đã yêu thích
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path 
                      fill="#fd213b" 
                      d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    />
                  </svg>
                ) : (
                  // Icon viền (outline) khi chưa yêu thích
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path 
                      fill="none"
                      stroke="#fd213b"
                      strokeWidth="32"
                      d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.1-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
                    />
                  </svg>
                )}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductItem;