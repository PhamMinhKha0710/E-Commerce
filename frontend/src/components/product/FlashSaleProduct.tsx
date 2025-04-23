import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FlashSaleProductProps {
  href: string;
  title: string;
  src: string;
  discount: string;
  price: string;
  comparePrice: string;
  variantId: string;
  sold: string;
  isOption?: boolean;
}

const FlashSaleProduct = ({
  href,
  title,
  src,
  discount,
  price,
  comparePrice,
  variantId,
  sold,
  isOption
}: FlashSaleProductProps) => {
  return (
    <div className="swiper-slide">
      <form action="https://nd-mall.mysapo.net/cart/add" method="post" className="variants product-action" data-cart-form data-id="product-actions-32882774" encType="multipart/form-data"> {/* Đã sửa thành encType */}
        <div className="product-thumbnail">
          <Link href={href} className="image_thumb scale_hover" title={title}>
            <Image
              width={200}
              height={200}
              src={src}
              alt={title}
              className="lazyload"
            />
          </Link>
          <span className="smart">{discount}</span>
        </div>
        <div className="product-info">
          <h3 className="product-name">
            <Link href={href} title={title}>{title}</Link>
          </h3>

          <div className="price-box">
            {price}
            <span className="compare-price">{comparePrice}</span>
          </div>
          <div className="actions-primary">
          {isOption ?  (
               <button
               className="btn-cart"
               title="Tùy chọn"
               type="button"
               onClick={() =>  window.location.href=href}
           >
               <svg fill="#f03248" height="24px" width="24px" version="1.1" viewBox="0 0 483.1 483.1" className="icon icon-cart">
                {/* <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-cart">
                </use> */}
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
           </button>) : (
            <>
            <input
              type="hidden"
              name="variantId"
              value={variantId}
            />
            <button
              className="btn-cart add_to_cart"
              title="Thêm vào giỏ hàng"
            >
              <svg fill="#f03248" height="24px" width="24px" version="1.1" viewBox="0 0 483.1 483.1" className="icon icon-cart">
                {/* <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-cart">
                </use> */}
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
            </>
           )}

          </div>
        </div>

        <div className="elio-productcount">
          <div className="countdown">
            <span className="title-open">Đã bán {sold}</span>
            <div className="line">
              <span style={{ width: `${Number(sold) > 100 ? 100 : Number(sold)}%` }}></span>
              <div className="sale-bar"></div>
            </div>
          </div>
        </div>

        <div className="action d-xl-block d-none">
          <div className="actions-secondary">
            <Link
              href="#"
              className="action btn-compare js-btn-wishlist setWishlist btn-views"
              title="Thêm vào yêu thích"
            >
              <svg className="icon">
                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-wishlist"></use>
              </svg>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlashSaleProduct;