// components/BestSellingSection.tsx
"use client"
import Image from 'next/image';
import Link from 'next/link';

const BestSellingSectionLeft: React.FC = () => {
  const brands = [
    { src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand21.jpg?1736305669595', alt: 'ND Mall' },
    { src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand22.jpg?1736305669595', alt: 'ND Mall' },
    { src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand23.jpg?1736305669595', alt: 'ND Mall' },
    { src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand24.jpg?1736305669595', alt: 'ND Mall' },
  ];

  const products = [
    {
      title: 'SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml',
      href: 'serum-cap-am-skinavis-chua-hyaluronic-acid-va-b5-danh-cho-moi-loai-da-30ml.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543',
      price: '350.000₫',
      variantId: '99344320',
      dataId: 'product-actions-32880881',
    },
    {
      title: 'Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày',
      href: 'duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673',
      price: '350.000₫',
      comparePrice: '450.000₫',
      discount: '-22%',
      variantId: '99395048',
      dataId: 'product-actions-32881796',
    },
    {
      title: 'Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml',
      href: 'kem-chong-nang-skinavis-skinavis-sunscreen-defense-pho-rong-khong-len-tone-da-70ml.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607',
      price: '650.000₫',
      variantId: '99350396',
      dataId: 'product-actions-32881007',
    },
    {
      title: 'Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn',
      href: 'sua-tam-lifebuoy-800gr-detox-va-sach-sau-khoi-bui-min-pm2-5-detox-100-tu-thien-nhien-diet-khuan.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790',
      price: '180.000₫',
      variantId: '99344265',
      dataId: 'product-actions-32880861',
      hasOptions: true,
    },
    {
      title: 'Dầu cá bổ sung Omega-3 DHA & EPA',
      href: 'dau-ca-bo-sung-omega-3-dha-epa.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033',
      price: '350.000₫',
      variantId: '99391238',
      dataId: 'product-actions-32881760',
    },
    {
      title: 'Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp',
      href: 'dau-goi-dau-clear-men-perfume-danh-bay-gau-ngua-va-luu-huong-nuoc-hoa-dang-cap.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897',
      price: '150.000₫',
      comparePrice: '300.000₫',
      discount: '-50%',
      variantId: '99344172',
      dataId: 'product-actions-32880831',
      hasOptions: true,
    },
  ];

  return (
    <div className="col-lg-8 col-md-12 col-12 col-left">
      <div className="block-title">
        <h2>
          <Link href="/san-pham-noi-bat.html" title="Thương hiệu bán chạy">
            <Image
              width={22}
              height={25}
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-best-selling.png?1736305669595"
              alt="Thương hiệu bán chạy"
            />
            Thương hiệu bán chạy
          </Link>
        </h2>
        <Link href="/san-pham-noi-bat.html" title="Xem tất cả" className="view_more">
          Xem tất cả
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={12}
            height={10}
            viewBox="0 0 12 10"
            fill="none"
          >
            <path
              d="M6.19525 0.528575C6.4556 0.268226 6.87771 0.268226 7.13806 0.528575L11.1381 4.52858C11.2631 4.6536 11.3333 4.82317 11.3333 4.99998C11.3333 5.17679 11.2631 5.34636 11.1381 5.47138L7.13806 9.47138C6.87771 9.73173 6.4556 9.73173 6.19525 9.47138C5.9349 9.21103 5.9349 8.78892 6.19525 8.52857L9.05718 5.66665L1.33332 5.66665C0.965133 5.66665 0.666656 5.36817 0.666656 4.99998C0.666656 4.63179 0.965133 4.33331 1.33332 4.33331H9.05718L6.19525 1.47138C5.9349 1.21103 5.9349 0.788925 6.19525 0.528575Z"
              fill="#333333"
            />
          </svg>
        </Link>
      </div>
      <div className="color-bg">
        <div className="block-brand">
          <div className="swiper-container swiper-brand-2">
            <div className="swiper-wrapper">
              {brands.map((brand, index) => (
                <div key={index} className="swiper-slide">
                  <Link href="#" title={brand.alt}>
                    <Image
                      width={138}
                      height={31}
                      className="img-responsive"
                      src={brand.src}
                      alt={brand.alt}
                      loading="lazy"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="block-product">
          <div className="row">
            {products.map((product, index) => (
              <div key={index} className="col-lg-4 col-md-4 col-6">
                <form
                  action="https://nd-mall.mysapo.net/cart/add"
                  method="post"
                  className="variants product-action"
                  data-cart-form
                  data-id={product.dataId}
                  encType="multipart/form-data"
                >
                  <div className="product-thumbnail">
                    <Link href={product.href} title={product.title} className="image_thumb scale_hover">
                      <Image
                        width={200}
                        height={200}
                        src={product.imgSrc}
                        alt={product.title}
                        loading="lazy"
                      />
                    </Link>
                    {product.discount && <span className="smart">{product.discount}</span>}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">
                      <Link href={product.href} title={product.title}>
                        {product.title}
                      </Link>
                    </h3>
                    <div className="price-box">
                      {product.price}
                      {product.comparePrice && (
                        <span className="compare-price">{product.comparePrice}</span>
                      )}
                    </div>
                    <div className="actions-primary">
                      <input type="hidden" name="variantId" value={product.variantId} />
                      <button
                        className={`btn-cart ${product.hasOptions ? '' : 'add_to_cart'}`}
                        title={product.hasOptions ? 'Tùy chọn' : 'Thêm vào giỏ hàng'}
                        type={product.hasOptions ? 'button' : 'submit'}
                        onClick={product.hasOptions ? () => window.location.href = product.href : undefined}
                      >
                        <svg className={`icon ${product.hasOptions ? 'icon-settings' : 'icon-cart'}`}>
                          <use xlinkHref={`#icon-${product.hasOptions ? 'settings' : 'cart'}`} />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="action d-xl-block d-none">
                    <div className="actions-secondary">
                      <a
                        href="javascript:void(0)"
                        className="action btn-compare js-btn-wishlist setWishlist btn-views"
                        data-wish={product.href.split('.html')[0]}
                        tabIndex={0}
                        title="Thêm vào yêu thích"
                      >
                        <svg className="icon">
                          <use xlinkHref="#icon-wishlist" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellingSectionLeft;