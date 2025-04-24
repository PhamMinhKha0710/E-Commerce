"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useAddToCart";

// Định nghĩa kiểu dữ liệu cho sản phẩm (đồng bộ với CartContext)
interface Product {
  productId: string; // Giữ string vì dữ liệu mẫu là string, sẽ parse sang number khi cần
  productName: string;
  price: string; // Chuỗi để hiển thị, sẽ parse sang number khi thêm vào giỏ
  comparePrice?: string;
  imageUrl: string;
  discount?: string;
  href: string;
  hasVariations?: boolean;
}

// Dữ liệu sản phẩm cho tab "Mỹ phẩm" (giữ nguyên dữ liệu mẫu)
const cosmeticProducts: Product[] = [
  {
    productId: "34269787",
    productName: "Mặt nạ trắng da Skinavis Brightening Mask",
    price: "200.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp3-063eda54-9967-471c-bdd9-cc5148d43d96.jpg?v=1705303607647",
    href: "/products/10",
    hasVariations: true,
  },
  {
    productId: "34269777",
    productName: "Kem dưỡng ẩm da chuyên sâu 50g - Skinavis Advance Redness Cream",
    price: "600.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp2-525e8555-8feb-479d-9976-e7d6f28fe814.jpg?v=1705303548013",
    href: "/products/11",
    hasVariations: false,
  },
  {
    productId: "34269723",
    productName: "Sữa rửa mặt Skinavis Gentle Cleanser - Sữa rửa mặt làm sạch sâu dịu nhẹ - 150ml",
    price: "380.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1-d999cfb1-b453-4f6f-9c29-6ff4ec3fef54.jpg?v=1705303371063",
    href: "/products/12",
    hasVariations: false,
  },
  {
    productId: "32881796",
    productName: "Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày",
    price: "350.000₫",
    comparePrice: "450.000₫",
    discount: "-22%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673",
    href: "/products/13",
    hasVariations: false,
  },
  {
    productId: "32881760",
    productName: "Dầu cá bổ sung Omega-3 DHA & EPA",
    price: "350.000₫",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033",
    href: "/products/14",
    hasVariations: false,
  },
  {
    productId: "32881007",
    productName: "Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml",
    price: "650.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607",
    href: "/products/15",
    hasVariations: false,
  },
  {
    productId: "32880881",
    productName: "SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml",
    price: "350.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543",
    href: "/products/16",
    hasVariations: false,
  },
  {
    productId: "32880861",
    productName:
      "Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn",
    price: "180.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790",
    href: "/products/17",
    hasVariations: true,
  },
  {
    productId: "32880831",
    productName: "Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp",
    price: "150.000₫",
    comparePrice: "300.000₫",
    discount: "-50%",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897",
    href: "/products/18",
    hasVariations: false,
  },
  {
    productId: "32880323",
    productName: "Sữa rửa mặt giúp sạch sâu cho da thường và da khô CeraVe Hydrating Cleanser 473ML",
    price: "500.000₫",
    comparePrice: "650.000₫",
    discount: "-23%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1.jpg?v=1696232963173",
    href: "/products/19",
    hasVariations: false,
  },
];

// Component ProductTab
const ProductTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab-1");
  const addToCart = useAddToCart();

  const tabs = [
    { id: "tab-1", label: "Mỹ phẩm", url: "my-pham", hasContent: true },
    { id: "tab-2", label: "Điện thoại", url: "dien-thoai-smartphone" },
    { id: "tab-3", label: "Máy giặt", url: "san-pham-noi-bat" },
    { id: "tab-4", label: "Đồ chơi", url: "do-choi-me-be" },
    { id: "tab-5", label: "Máy tính bảng", url: "may-tinh-bang" },
    { id: "tab-6", label: "Đồng hồ", url: "phu-kien-dong-ho" },
  ];

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!product.hasVariations) {
      const numericPrice = product.price
      ? parseInt(String(product.price).replace(/\./g, ""), 10) || 0
      : 0;
        
      addToCart({
        productId: parseInt(product.productId), 
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: numericPrice,
        quantity: 1,
        currency: "VND",
        hasVariations: false,
        productItemId: null, 
      });
    } else {
      window.location.href = `/${product.href}.html`; 
    }
  };

  return (
    <div className="section_product_tab section_product_tab_2">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-tab-2.png?1736305669595"
                alt="Bạn có thể thích"
                width={20}
                height={19}
              />
              Bạn có thể thích
            </h2>
          </div>
          <div className="block-content">
            <div className="e-tabs not-dqtab ajax-tab-2" data-section="ajax-tab-2" data-view="grid_2">
              <div className="content">
                <ul className="nav-tab tabs">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`tab-link tabs-title tabtitle1 ajax ${
                        tab.hasContent ? "has-content" : ""
                      } ${activeTab === tab.id ? "current" : ""}`}
                      data-tab={tab.id}
                      data-url={tab.url}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span>{tab.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="tab-container">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab-item tab-content ${tab.id} ${
                        activeTab === tab.id ? "current" : ""
                      }`}
                    >
                      <div className="contentfill">
                        {tab.id === "tab-1" && (
                          <div className="block-product">
                            <div className="row">
                              {cosmeticProducts.map((product) => (
                                <div key={product.productId} className="col-20 col-lg-3 col-md-3">
                                  <div className="item_product_main">
                                    <form
                                      onSubmit={(e) => handleAddToCart(e, product)}
                                      className="variants product-action"
                                      data-cart-form
                                      data-id={`product-actions-${product.productId}`}
                                      encType="multipart/form-data"
                                    >
                                      <div className="product-thumbnail">
                                        <Link href={`/${product.href}.html`} className="image_thumb scale_hover">
                                          <Image
                                            className="lazyload"
                                            src={product.imageUrl}
                                            alt={product.productName}
                                            width={200}
                                            height={200}
                                          />
                                        </Link>
                                        {product.discount && (
                                          <span className="smart">{product.discount}</span>
                                        )}
                                      </div>
                                      <div className="product-info">
                                        <h3 className="product-name">
                                          <Link href={`/${product.href}.html`}>
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
                                      <div className="action d-xl-block d-none">
                                        <div className="actions-secondary">
                                          <a
                                            href="javascript:void(0)"
                                            className="action btn-compare js-btn-wishlist setWishlist btn-views"
                                            data-wish={product.href}
                                            tabIndex={0}
                                            title="Thêm vào yêu thích"
                                          >
                                            <svg
                                              className="icon"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 512 512"
                                            >
                                              <path
                                                fill="#fd213b"
                                                d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v-5.8c0 41.5 17.2 81.2 47.6 109.5z"
                                              />
                                            </svg>
                                          </a>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Link href="/my-pham.html" className="more bold border-radius-4" title="Xem thêm">
                              Xem thêm
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
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

export default ProductTab;