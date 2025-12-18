"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Định nghĩa interface cho product (đồng bộ với CartContext)
interface Product {
  categoryId: number;
  productId: number | string; 
  productName: string; 
  href: string; 
  slug: string;
  imageUrl: string; 
  price?: string; 
  comparePrice?: string;
  discount?: string;
  hasVariations?: boolean;
  contact?: boolean; 
  productItemId: number | null;
}

interface ProductSectionProps {
  productsData: Product[];
}

const ProductSection = ({ productsData }: ProductSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("tab-1");

  const tabs = [
    { id: "tab-1", title: "Dành cho bạn", url: "collections/all" },
    { id: "tab-2", title: "Deal siêu hot", url: "deal-sieu-hot" },
    { id: "tab-3", title: "Freeship", url: "freeship" },
    { id: "tab-4", title: "Xu hướng", url: "xu-huong" },
    { id: "tab-5", title: "Hàng hiệu quốc tế", url: "hang-hieu-quoc-te" },
    { id: "tab-6", title: "Hàng mới", url: "hang-moi" },
  ];

  return (
    <div className="section_product_tab section_product_tab_1">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                width={20}
                height={19}
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-tab.png?1736305669595"
                alt="Gợi ý hôm nay"
              />
              Gợi ý hôm nay
            </h2>
          </div>
          <div className="block-content">
            <div
              className="e-tabs not-dqtab ajax-tab-1"
              data-section="ajax-tab-1"
              data-view="grid_1"
            >
              <div className="content">
                <ul className="nav-tab tabs">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`tab-link tabs-title tabtitle1 ajax has-content ${
                        activeTab === tab.id ? "current" : ""
                      }`}
                      data-tab={tab.id}
                      data-url={tab.url}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span>{tab.title}</span>
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
                        {activeTab === tab.id && tab.id === "tab-1" && (
                          <div className="block-product">
                            <div className="row">
                              {productsData.map((product) => (
                                <div
                                  key={product.productId}
                                  className="col-20 col-lg-3 col-md-3"
                                >
                                  <ProductCard product={product} />
                                </div>
                              ))}
                            </div>
                            <Link
                              href="/collections/all"
                              className="more bold border-radius-4"
                              title="Xem thêm"
                            >
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

// Component con cho sản phẩm
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  // Hàm xử lý khi thêm vào giỏ hàng hoặc chuyển hướng
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.hasVariations) {
        const numericPrice = product.price
        ? parseInt(String(product.price).replace(/\./g, ""), 10) || 0
        : 0;

      addToCart({
        productId: Number(product.productId),
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: numericPrice,
        quantity: 1,
        currency: "VND", 
        hasVariations: false,
        productItemId:  product.productItemId, 
        categoryId: product.categoryId,
      });
      toast.success(
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={product.imageUrl || "/default-image.jpg"}
            alt={product.productName}
            width={40}
            height={40}
            style={{ marginRight: "10px", borderRadius: "4px" }}
          />
          <div>
            <strong>{product.productName}</strong> đã được thêm vào giỏ hàng!
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: "#f0fff0",
            color: "#28a745",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    } else {
      // Điều hướng tới trang chi tiết sản phẩm dùng href nếu có, fallback theo slug cũ
      const href = product.href || `/products/${product.productId}-${product.slug}`;
      window.location.href = href; 
    }
  };

  return (
    <div className="item_product_main">
      <form
        onSubmit={handleAddToCart}
        className={`variants product-action ${product.contact ? "contact" : ""}`}
        data-cart-form
        data-id={`product-actions-${product.productId}`} 
        encType="multipart/form-data"
      >
        <div className="product-thumbnail">
          <Link href={product.href || `/products/${product.productId}-${product.slug}`} className="image_thumb scale_hover">
            <Image
              className="lazyload"
              width={200}
              height={200}
              src={product.imageUrl}
              alt={product.productName}
            />
          </Link>
          {product.discount && <span className="smart">{product.discount}</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">
            <Link href={product.href || `/products/${product.productId}-${product.slug}`}>
              {product.productName}
            </Link>
          </h3>
          <div className="price-box">
            {product.price ? (
              <>
                {product.price}{" "}
                {product.comparePrice && (
                  <span className="compare-price">{product.comparePrice}</span>
                )}
              </>
            ) : (
              "Liên hệ"
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
              href="#"
              className="action btn-compare js-btn-wishlist setWishlist btn-views"
              data-wish={product.slug}
              tabIndex={0}
              title="Thêm vào yêu thích"
              onClick={(e) => e.preventDefault()}
            >
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
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
  );
};

export default ProductSection;