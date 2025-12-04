"use client";

import Image from "next/image";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useAddToCart";

// Định nghĩa interface cho product (đồng bộ với CartContext, chỉ dùng productId)
interface Product {
  productId: string; // Định danh duy nhất, thay thế id và variantId
  productName: string;
  href: string;
  imageUrl: string;
  price?: string; // Chuỗi để hiển thị
  comparePrice?: string;
  discount?: string;
  hasVariations?: boolean;
}

const BestSellingSectionLeft: React.FC = () => {
  const addToCart = useAddToCart();

  const brands = [
    {
      src: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand21.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      src: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand22.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      src: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand23.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      src: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand24.jpg?1736305669595",
      alt: "ND Mall",
    },
  ];

  const products: Product[] = [
    {
      productId: "6", // Thay id và variantId bằng productId
      productName: "SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml",
      href: "/products/6",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543",
      price: "350.000₫",
      hasVariations: false
    },
    {
      productId: "7",
      productName: "Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày",
      href: "products/7",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673",
      price: "350.000₫",
      comparePrice: "450.000₫",
      discount: "-22%",
      hasVariations: true,
    },
    {
      productId: "8",
      productName: "Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml",
      href: "kem-chong-nang-skinavis-skinavis-sunscreen-defense-pho-rong-khong-len-tone-da-70ml.html",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607",
      price: "650.000₫",
      hasVariations: false
    },
    {
      productId: "9",
      productName: "Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn",
      href: "sua-tam-lifebuoy-800gr-detox-va-sach-sau-khoi-bui-min-pm2-5-detox-100-tu-thien-nhien-diet-khuan.html",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790",
      price: "180.000₫",
      hasVariations: true,
    },
    {
      productId: "10",
      productName: "Dầu cá bổ sung Omega-3 DHA & EPA",
      href: "dau-ca-bo-sung-omega-3-dha-epa.html",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033",
      price: "350.000₫",
      hasVariations: false
    },
    {
      productId: "11",
      productName: "Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp",
      href: "dau-goi-dau-clear-men-perfume-danh-bay-gau-ngua-va-luu-huong-nuoc-hoa-dang-cap.html",
      imageUrl: "http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897",
      price: "150.000₫",
      comparePrice: "300.000₫",
      discount: "-50%",
      hasVariations: true,
    },
  ];

  const handleSubmit = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!product.hasVariations) {
      const numericPrice = product.price
      ? parseInt(String(product.price).replace(/\./g, ""), 10) || 0
      : 0;

      addToCart({
        productId: parseInt(product.productId), // Chuyển từ string sang number
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: numericPrice,
        quantity: 1,
        currency: "VND", // Mặc định
        hasVariations: false,
        productItemId: null, // Mảng rỗng
      });
    }
  };

  return (
    <div className="col-lg-8 col-md-12 col-12 col-left">
      <div className="block-title">
        <h2>
          <Link href="products/6" title="Thương hiệu bán chạy">
            <Image
              width={22}
              height={25}
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-best-selling.png?1736305669595"
              alt="Thương hiệu bán chạy"
            />
            Thương hiệu bán chạy
          </Link>
        </h2>
        <Link href="/collections/all" title="Xem tất cả" className="view_more">
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
                  onSubmit={(e) => handleSubmit(e, product)}
                  className="variants product-action"
                  data-cart-form
                  encType="multipart/form-data" // Bỏ data-id
                >
                  <div className="product-thumbnail">
                    <Link href={product.href} title={product.productName} className="image_thumb scale_hover">
                      <Image
                        width={200}
                        height={200}
                        src={product.imageUrl}
                        alt={product.productName}
                        loading="lazy"
                      />
                    </Link>
                    {product.discount && <span className="smart">{product.discount}</span>}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">
                      <Link href={product.href} title={product.productName}>
                        {product.productName}
                      </Link>
                    </h3>
                    <div className="price-box">
                      {product.price}
                      {product.comparePrice && (
                        <span className="compare-price">{product.comparePrice}</span>
                      )}
                    </div>
                    <div className="actions-primary">
                      {product.hasVariations ? (
                        <button
                          className="btn-cart"
                          title="Tùy chọn"
                          type="button"
                          onClick={() => (window.location.href = product.href)}
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
                        <>
                          <input type="hidden" name="productId" value={product.productId} />
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
                                <g>
                                  <path d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6 c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3 C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1 c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z" />
                                  <path d="M301.45,290h-47.9v-47.9c0-6.6-5.4-12-12-12s-12,5.4-12,12V290h-47.9c-6.6,0-12,5.4-12,12s5.4,12,12,12h47.9v47.9 c0,6.6,5.4,12,12,12s12-5.4,12-12V314h47.9c6.6,0,12-5.4,12-12S308.05,290,301.45,290z" />
                                </g>
                              </g>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="action d-xl-block d-none">
                    <div className="actions-secondary">
                      <a
                        href="#"
                        className="action btn-compare js-btn-wishlist setWishlist btn-views"
                        data-wish={product.href.split(".html")[0]}
                        tabIndex={0}
                        title="Thêm vào yêu thích"
                        onClick={(e) => e.preventDefault()}
                      >
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path
                            fill="#fd213b"
                            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                          />
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