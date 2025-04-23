"use client";

import Image from 'next/image';
import { useState } from 'react';

// Định nghĩa interface cho product
interface Product {
  id: number;
  title: string;
  url: string;
  image: string;
  price?: string;
  comparePrice?: string;
  discount?: number;
  variantId: string;
  buttonTitle: string;
  buttonIcon: string;
  contact?: boolean;
}

interface ProductSectionProps {
  productsData: Product[];
}

const ProductSection = ({ productsData }: ProductSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>('tab-1');

  // Danh sách các tab
  const tabs = [
    { id: 'tab-1', title: 'Dành cho bạn', url: 'danh-cho-ban' },
    { id: 'tab-2', title: 'Deal siêu hot', url: 'deal-sieu-hot' },
    { id: 'tab-3', title: 'Freeship', url: 'freeship' },
    { id: 'tab-4', title: 'Xu hướng', url: 'xu-huong' },
    { id: 'tab-5', title: 'Hàng hiệu quốc tế', url: 'hang-hieu-quoc-te' },
    { id: 'tab-6', title: 'Hàng mới', url: 'hang-moi' },
  ];

  return (
    <div className="section_product_tab section_product_tab_1">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                width="20"
                height="19"
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-tab.png?1736305669595"
                alt="Gợi ý hôm nay"
              />
              Gợi ý hôm nay
            </h2>
          </div>
          <div className="block-content">
            <div className="e-tabs not-dqtab ajax-tab-1" data-section="ajax-tab-1" data-view="grid_1">
              <div className="content">
                {/* Tab navigation */}
                <ul className="nav-tab tabs">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`tab-link tabs-title tabtitle1 ajax has-content ${activeTab === tab.id ? 'current' : ''}`}
                      data-tab={tab.id}
                      data-url={tab.url}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span>{tab.title}</span>
                    </li>
                  ))}
                </ul>

                {/* Tab content */}
                <div className="tab-container">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab-item tab-content ${tab.id} ${activeTab === tab.id ? 'current' : ''}`}
                    >
                      <div className="contentfill">
                        {activeTab === tab.id && tab.id === 'tab-1' && (
                          <div className="block-product">
                            <div className="row">
                              {productsData.map((product) => (
                                <div key={product.id} className="col-20 col-lg-3 col-md-3 col-6">
                                  <ProductCard product={product} />
                                </div>
                              ))}
                            </div>
                            <a
                              href="danh-cho-ban.html"
                              className="more bold border-radius-4"
                              title="Xem thêm"
                            >
                              Xem thêm
                            </a>
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
  return (
    <div className="item_product_main">
      <form
        action="https://nd-mall.mysapo.net/cart/add"
        method="post"
        className={`variants product-action ${product.contact ? 'contact' : ''}`}
        data-cart-form
        data-id={`product-actions-${product.id}`}
        encType="multipart/form-data"
      >
        <div className="product-thumbnail">
          <a className="image_thumb scale_hover" href={product.url} title={product.title}>
            <Image
              className="lazyload"
              width={200}
              height={200}
              src={product.image}
              alt={product.title}
            />
          </a>
          {product.discount && <span className="smart">-{product.discount}%</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">
            <a href={product.url} title={product.title}>{product.title}</a>
          </h3>
          <div className="price-box">
            {product.price ? (
              <>
                {product.price}₫&nbsp;
                {product.comparePrice && (
                  <span className="compare-price">{product.comparePrice}₫</span>
                )}
              </>
            ) : (
              'Liên hệ'
            )}
          </div>
          <div className="actions-primary">
            <input
              className="hidden"
              type="hidden"
              name="variantId"
              value={product.variantId}
            />
            <button
              className="btn-cart"
              title={product.buttonTitle}
              type="button"
              onClick={() => (window.location.href = product.url)}
            >
              <svg className={`icon icon-${product.buttonIcon}`}>
                <use xlinkHref={`#icon-${product.buttonIcon}`} />
              </svg>
            </button>
          </div>
        </div>
        <div className="action d-xl-block d-none">
          <div className="actions-secondary">
            <a
              href="javascript:void(0)"
              className="action btn-compare js-btn-wishlist setWishlist btn-views"
              data-wish={product.url.split('.')[0]}
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
  );
};

export default ProductSection;