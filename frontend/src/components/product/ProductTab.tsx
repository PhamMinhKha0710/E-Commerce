"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: string;
  title: string;
  price: string;
  comparePrice?: string;
  imageUrl: string;
  discount?: string;
  slug: string;
  variantId: string;
  hasOptions?: boolean; // Để xử lý nút "Tùy chọn" thay vì "Thêm vào giỏ hàng"
}

// Dữ liệu sản phẩm cho tab "Mỹ phẩm"x
const cosmeticProducts: Product[] = [
  {
    id: '34269787',
    title: 'Mặt nạ trắng da Skinavis Brightening Mask',
    price: '200.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp3-063eda54-9967-471c-bdd9-cc5148d43d96.jpg?v=1705303607647',
    slug: 'mat-na-trang-da-skinavis-brightening-mask',
    variantId: '107871036',
  },
  {
    id: '34269777',
    title: 'Kem dưỡng ẩm da chuyên sâu 50g - Skinavis Advance Redness Cream',
    price: '600.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp2-525e8555-8feb-479d-9976-e7d6f28fe814.jpg?v=1705303548013',
    slug: 'kem-duong-am-da-chuyen-sau-50g-skinavis-advance-redness-cream',
    variantId: '107871020',
  },
  {
    id: '34269723',
    title: 'Sữa rửa mặt Skinavis Gentle Cleanser - Sữa rửa mặt làm sạch sâu dịu nhẹ - 150ml',
    price: '380.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1-d999cfb1-b453-4f6f-9c29-6ff4ec3fef54.jpg?v=1705303371063',
    slug: 'sua-rua-mat-skinavis-gentle-cleanser-sua-rua-mat-lam-sach-sau-diu-nhe-150ml',
    variantId: '107870277',
  },
  {
    id: '32881796',
    title: 'Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày',
    price: '350.000₫',
    comparePrice: '450.000₫',
    discount: '-22%',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673',
    slug: 'duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay',
    variantId: '99395048',
  },
  {
    id: '32881760',
    title: 'Dầu cá bổ sung Omega-3 DHA & EPA',
    price: '350.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033',
    slug: 'dau-ca-bo-sung-omega-3-dha-epa',
    variantId: '99391238',
  },
  {
    id: '32881007',
    title: 'Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml',
    price: '650.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607',
    slug: 'kem-chong-nang-skinavis-skinavis-sunscreen-defense-pho-rong-khong-len-tone-da-70ml',
    variantId: '99350396',
  },
  {
    id: '32880881',
    title: 'SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml',
    price: '350.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543',
    slug: 'serum-cap-am-skinavis-chua-hyaluronic-acid-va-b5-danh-cho-moi-loai-da-30ml',
    variantId: '99344320',
  },
  {
    id: '32880861',
    title: 'Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn',
    price: '180.000₫',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790',
    slug: 'sua-tam-lifebuoy-800gr-detox-va-sach-sau-khoi-bui-min-pm2-5-detox-100-tu-thien-nhien-diet-khuan',
    variantId: '99344265',
    hasOptions: true,
  },
  {
    id: '32880831',
    title: 'Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp',
    price: '150.000₫',
    comparePrice: '300.000₫',
    discount: '-50%',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897',
    slug: 'dau-goi-dau-clear-men-perfume-danh-bay-gau-ngua-va-luu-huong-nuoc-hoa-dang-cap',
    variantId: '99344172',
    hasOptions: true,
  },
  {
    id: '32880323',
    title: 'Sữa rửa mặt giúp sạch sâu cho da thường và da khô CeraVe Hydrating Cleanser 473ML',
    price: '500.000₫',
    comparePrice: '650.000₫',
    discount: '-23%',
    imageUrl: 'https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1.jpg?v=1696232963173',
    slug: 'sua-rua-mat-giup-sach-sau-cho-da-thuong-va-da-kho-cerave-hydrating-cleanser-473ml',
    variantId: '99343406',
  },
];

// Component ProductTab
const ProductTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tab-1');

  const tabs = [
    { id: 'tab-1', label: 'Mỹ phẩm', url: 'my-pham', hasContent: true },
    { id: 'tab-2', label: 'Điện thoại', url: 'dien-thoai-smartphone' },
    { id: 'tab-3', label: 'Máy giặt', url: 'san-pham-noi-bat' },
    { id: 'tab-4', label: 'Đồ chơi', url: 'do-choi-me-be' },
    { id: 'tab-5', label: 'Máy tính bảng', url: 'may-tinh-bang' },
    { id: 'tab-6', label: 'Đồng hồ', url: 'phu-kien-dong-ho' },
  ];

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
                      className={`tab-link tabs-title tabtitle1 ajax ${tab.hasContent ? 'has-content' : ''} ${activeTab === tab.id ? 'current' : ''}`}
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
                      className={`tab-item tab-content ${tab.id} ${activeTab === tab.id ? 'current' : ''}`}
                    >
                      <div className="contentfill">
                        {tab.id === 'tab-1' && (
                          <div className="block-product">
                            <div className="row">
                              {cosmeticProducts.map((product) => (
                                <div key={product.id} className="col-20 col-lg-3 col-md-3 col-6">
                                  <div className="item_product_main">
                                    <form
                                      action="https://nd-mall.mysapo.net/cart/add"
                                      method="post"
                                      className="variants product-action"
                                      data-cart-form
                                      data-id={`product-actions-${product.id}`}
                                      encType="multipart/form-data"
                                    >
                                      <div className="product-thumbnail">
                                        <Link href={`/${product.slug}.html`} className="image_thumb scale_hover">
                                          <Image
                                            className="lazyload"
                                            src={product.imageUrl}
                                            alt={product.title}
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
                                          <Link href={`/${product.slug}.html`}>{product.title}</Link>
                                        </h3>
                                        <div className="price-box">
                                          {product.price}
                                          {product.comparePrice && (
                                            <span className="compare-price">{product.comparePrice}</span>
                                          )}
                                        </div>
                                        <div className="actions-primary">
                                          <input type="hidden" name="variantId" value={product.variantId} />
                                          {product.hasOptions ? (
                                            <button
                                              className="btn-cart"
                                              title="Tùy chọn"
                                              type="button"
                                              onClick={() => (window.location.href = `/${product.slug}.html`)}
                                            >
                                              <svg className="icon icon-settings">
                                                <use xlinkHref="#icon-settings" />
                                              </svg>
                                            </button>
                                          ) : (
                                            <button className="btn-cart add_to_cart" title="Thêm vào giỏ hàng">
                                              <svg className="icon icon-cart">
                                                <use xlinkHref="#icon-cart" />
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
                                            data-wish={product.slug}
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