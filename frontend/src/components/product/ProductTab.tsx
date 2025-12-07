"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useAddToCart";
import { categoryService } from "@/services/categoryService";

// Định nghĩa kiểu dữ liệu cho sản phẩm (đồng bộ với CartContext)
interface Product {
  productId: string; // Giữ string vì dữ liệu mẫu là string, sẽ parse sang number khi cần
  productName: string;
  price: string; // Chuỗi để hiển thị, sẽ parse sang number khi thêm vào giỏ
  comparePrice?: string;
  imageUrl: string;
  discount?: string;
  href: string;
  slug: string;
  hasVariations?: boolean;
  contact?: boolean; // Sản phẩm cần liên hệ
  categoryId?: number;
  productItemId?: number;
}

// Dữ liệu sản phẩm cho tab "Mỹ phẩm" - Sử dụng format đúng: /products/{id}-{slug}
const cosmeticProducts: Product[] = [
  {
    productId: "34269787",
    productName: "Mặt nạ trắng da Skinavis Brightening Mask",
    price: "200.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp3-063eda54-9967-471c-bdd9-cc5148d43d96.jpg?v=1705303607647",
    href: "/products/34269787-mat-na-trang-da-skinavis-brightening-mask",
    slug: "mat-na-trang-da-skinavis-brightening-mask",
    hasVariations: true,
  },
  {
    productId: "34269777",
    productName: "Kem dưỡng ẩm da chuyên sâu 50g - Skinavis Advance Redness Cream",
    price: "600.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp2-525e8555-8feb-479d-9976-e7d6f28fe814.jpg?v=1705303548013",
    href: "/products/34269777-kem-duong-am-da-chuyen-sau-50g-skinavis-advance-redness-cream",
    slug: "kem-duong-am-da-chuyen-sau-50g-skinavis-advance-redness-cream",
    hasVariations: false,
  },
  {
    productId: "34269723",
    productName: "Sữa rửa mặt Skinavis Gentle Cleanser - Sữa rửa mặt làm sạch sâu dịu nhẹ - 150ml",
    price: "380.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1-d999cfb1-b453-4f6f-9c29-6ff4ec3fef54.jpg?v=1705303371063",
    href: "/products/34269723-sua-rua-mat-skinavis-gentle-cleanser-150ml",
    slug: "sua-rua-mat-skinavis-gentle-cleanser-150ml",
    hasVariations: false,
  },
  {
    productId: "32881796",
    productName: "Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày",
    price: "350.000₫",
    comparePrice: "450.000₫",
    discount: "-22%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673",
    href: "/products/32881796-duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay",
    slug: "duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay",
    hasVariations: false,
  },
  {
    productId: "32881760",
    productName: "Dầu cá bổ sung Omega-3 DHA & EPA",
    price: "350.000₫",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033",
    href: "/products/32881760-dau-ca-bo-sung-omega-3-dha-epa",
    slug: "dau-ca-bo-sung-omega-3-dha-epa",
    hasVariations: false,
  },
  {
    productId: "32881007",
    productName: "Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml",
    price: "650.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607",
    href: "/products/32881007-kem-chong-nang-skinavis-sunscreen-defense-70ml",
    slug: "kem-chong-nang-skinavis-sunscreen-defense-70ml",
    hasVariations: false,
  },
  {
    productId: "32880881",
    productName: "SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml",
    price: "350.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543",
    href: "/products/32880881-serum-cap-am-skinavis-hyaluronic-acid-b5-30ml",
    slug: "serum-cap-am-skinavis-hyaluronic-acid-b5-30ml",
    hasVariations: false,
  },
  {
    productId: "32880861",
    productName:
      "Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn",
    price: "180.000₫",
    imageUrl:
      "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790",
    href: "/products/32880861-sua-tam-lifebuoy-800gr-detox",
    slug: "sua-tam-lifebuoy-800gr-detox",
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
    href: "/products/32880831-dau-goi-dau-clear-men-perfume",
    slug: "dau-goi-dau-clear-men-perfume",
    hasVariations: false,
  },
  {
    productId: "32880323",
    productName: "Sữa rửa mặt giúp sạch sâu cho da thường và da khô CeraVe Hydrating Cleanser 473ML",
    price: "500.000₫",
    comparePrice: "650.000₫",
    discount: "-23%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/1.jpg?v=1696232963173",
    href: "/products/32880323-sua-rua-mat-cerave-hydrating-cleanser-473ml",
    slug: "sua-rua-mat-cerave-hydrating-cleanser-473ml",
    hasVariations: false,
  },
];

// Dữ liệu sản phẩm cho tab "Điện thoại"
const phoneProducts: Product[] = [
  {
    productId: "32899086",
    productName: "iPhone 14 Pro Max",
    price: "26.000.000₫",
    comparePrice: "28.000.000₫",
    discount: "-7%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110",
    href: "/products/1",
    slug: "iphone-14-pro-max",
    hasVariations: true,
  },
  {
    productId: "32898940",
    productName: "iPhone 15 Pro Max Titan Xanh 256g",
    price: "34.000.000₫",
    comparePrice: "36.000.000₫",
    discount: "-6%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/a1.jpg?v=1696321359880",
    href: "/products/2",
    slug: "iphone-15-pro-max-titan-xanh-256g",
    hasVariations: false,
  },
  {
    productId: "32882774",
    productName: "Tai Nghe Bluetooth Headphone Edifier W820NB PLUS",
    price: "1.399.000₫",
    comparePrice: "2.399.000₫",
    discount: "-42%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp20.jpg?v=1696241238643",
    href: "/products/3",
    slug: "tai-nghe-bluetooth-headphone-edifier-w820nb-plus",
    hasVariations: false,
  },
  {
    productId: "32882682",
    productName: "Tai nghe bluetooth Galaxy Buds 2 Pro",
    price: "400.000₫",
    comparePrice: "600.000₫",
    discount: "-33%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp22.jpg?v=1696240818597",
    href: "/products/4",
    slug: "tai-nghe-bluetooth-galaxy-buds-2-pro",
    hasVariations: true,
  },
  {
    productId: "32882553",
    productName: "Chuột không dây Logitech B170 - USB, nhỏ gọn",
    price: "295.000₫",
    comparePrice: "400.000₫",
    discount: "-26%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp21.jpg?v=1696240462333",
    href: "/products/5",
    slug: "chuot-khong-day-logitech-b170",
    hasVariations: false,
  },
  {
    productId: "32882737",
    productName: "Hub chia cổng Baseus cổng Type C sang HDMI USB 3.0",
    price: "499.000₫",
    comparePrice: "1.090.000₫",
    discount: "-54%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp18.jpg?v=1696241086293",
    href: "/products/6",
    slug: "hub-chia-cong-baseus-type-c-hdmi-usb",
    hasVariations: false,
  },
];

// Dữ liệu sản phẩm cho tab "Máy giặt"
const washingMachineProducts: Product[] = [
  {
    productId: "32882811",
    productName: "Thùng 24 chai Sữa nước Ensure Abbott 237ml/chai",
    price: "1.400.000₫",
    comparePrice: "2.000.000₫",
    discount: "-30%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp13.jpg?v=1696241512770",
    href: "/products/7",
    slug: "thung-24-chai-sua-nuoc-ensure-abbott",
    hasVariations: false,
  },
  {
    productId: "32882800",
    productName: "Sữa 9 loại hạt Vinamilk Super Nut - Thùng 24 hộp 180ml",
    price: "250.000₫",
    comparePrice: "450.000₫",
    discount: "-44%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp12.jpg?v=1696241450383",
    href: "/products/8",
    slug: "sua-9-loai-hat-vinamilk-super-nut",
    hasVariations: false,
  },
  {
    productId: "32882796",
    productName: "Mì Omachi Tôm Chua Cay Thái Gói 80g",
    price: "15.000₫",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp11.jpg?v=1696241389353",
    href: "/products/9",
    slug: "mi-omachi-tom-chua-cay-thai-goi-80g",
    hasVariations: true,
    contact: true,
  },
  {
    productId: "32882789",
    productName: "Thùng 48 hộp sữa tươi tiệt trùng TH True Milk HILO 180ml",
    price: "550.000₫",
    comparePrice: "680.000₫",
    discount: "-19%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp10.jpg?v=1696241335590",
    href: "/products/10",
    slug: "thung-48-hop-sua-tuoi-tiet-trung-th-true-milk",
    hasVariations: false,
  },
];

// Dữ liệu sản phẩm cho tab "Đồ chơi"
const toyProducts: Product[] = [
  {
    productId: "32882850",
    productName: "Đồ chơi xếp hình LEGO Classic 10696",
    price: "890.000₫",
    comparePrice: "1.200.000₫",
    discount: "-26%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp14.jpg?v=1696241600000",
    href: "/products/11",
    slug: "do-choi-xep-hinh-lego-classic-10696",
    hasVariations: false,
  },
  {
    productId: "32882851",
    productName: "Búp bê Barbie Dreamhouse",
    price: "2.500.000₫",
    comparePrice: "3.000.000₫",
    discount: "-17%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp15.jpg?v=1696241700000",
    href: "/products/12",
    slug: "bup-be-barbie-dreamhouse",
    hasVariations: true,
  },
  {
    productId: "32882852",
    productName: "Xe điều khiển từ xa RC Car",
    price: "450.000₫",
    comparePrice: "650.000₫",
    discount: "-31%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp16.jpg?v=1696241800000",
    href: "/products/13",
    slug: "xe-dieu-khien-tu-xa-rc-car",
    hasVariations: false,
  },
  {
    productId: "32882853",
    productName: "Bộ đồ chơi nấu ăn cho bé",
    price: "180.000₫",
    comparePrice: "250.000₫",
    discount: "-28%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp17.jpg?v=1696241900000",
    href: "/products/14",
    slug: "bo-do-choi-nau-an-cho-be",
    hasVariations: false,
  },
];

// Dữ liệu sản phẩm cho tab "Máy tính bảng"
const tabletProducts: Product[] = [
  {
    productId: "32882860",
    productName: "iPad Air 10.9 inch 256GB",
    price: "18.500.000₫",
    comparePrice: "20.000.000₫",
    discount: "-8%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp24.jpg?v=1696242000000",
    href: "/products/15",
    slug: "ipad-air-10-9-inch-256gb",
    hasVariations: true,
  },
  {
    productId: "32882861",
    productName: "Samsung Galaxy Tab S9 Ultra",
    price: "22.000.000₫",
    comparePrice: "25.000.000₫",
    discount: "-12%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp25.jpg?v=1696242100000",
    href: "/products/16",
    slug: "samsung-galaxy-tab-s9-ultra",
    hasVariations: false,
  },
  {
    productId: "32882862",
    productName: "iPad Pro 12.9 inch M2",
    price: "28.000.000₫",
    comparePrice: "32.000.000₫",
    discount: "-13%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp26.jpg?v=1696242200000",
    href: "/products/17",
    slug: "ipad-pro-12-9-inch-m2",
    hasVariations: true,
  },
  {
    productId: "32882863",
    productName: "Xiaomi Pad 6 Pro",
    price: "12.500.000₫",
    comparePrice: "15.000.000₫",
    discount: "-17%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp27.jpg?v=1696242300000",
    href: "/products/18",
    slug: "xiaomi-pad-6-pro",
    hasVariations: false,
  },
];

// Dữ liệu sản phẩm cho tab "Đồng hồ"
const watchProducts: Product[] = [
  {
    productId: "32882870",
    productName: "Đồng hồ thông minh Apple Watch Series 9",
    price: "10.500.000₫",
    comparePrice: "12.000.000₫",
    discount: "-13%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp28.jpg?v=1696242400000",
    href: "/products/19",
    slug: "dong-ho-thong-minh-apple-watch-series-9",
    hasVariations: true,
  },
  {
    productId: "32882871",
    productName: "Đồng hồ nam Rolex Submariner",
    price: "850.000.000₫",
    comparePrice: "950.000.000₫",
    discount: "-11%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp29.jpg?v=1696242500000",
    href: "/products/20",
    slug: "dong-ho-nam-rolex-submariner",
    hasVariations: false,
  },
  {
    productId: "32882872",
    productName: "Đồng hồ thông minh Samsung Galaxy Watch 6",
    price: "7.500.000₫",
    comparePrice: "9.000.000₫",
    discount: "-17%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp30.jpg?v=1696242600000",
    href: "/products/21",
    slug: "dong-ho-thong-minh-samsung-galaxy-watch-6",
    hasVariations: true,
  },
  {
    productId: "32882873",
    productName: "Đồng hồ nữ Casio Baby-G",
    price: "2.500.000₫",
    comparePrice: "3.200.000₫",
    discount: "-22%",
    imageUrl: "https://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp31.jpg?v=1696242700000",
    href: "/products/22",
    slug: "dong-ho-nu-casio-baby-g",
    hasVariations: false,
  },
];

// Component ProductTab
const ProductTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab-1");
  // Khởi tạo với dữ liệu mẫu cho tab Mỹ phẩm (fallback)
  const [products, setProducts] = useState<Record<string, Product[]>>({
    "tab-1": cosmeticProducts,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const addToCart = useAddToCart();

  const tabs = [
    { id: "tab-1", label: "Mỹ phẩm", url: "my-pham", categorySlug: "lam-dep-suc-khoe" },
    { id: "tab-2", label: "Điện thoại", url: "dien-thoai-smartphone", categorySlug: "dien-thoai-may-tinh-bang" },
    { id: "tab-3", label: "Máy giặt", url: "san-pham-noi-bat", categorySlug: "dien-gia-dung" },
    { id: "tab-4", label: "Đồ chơi", url: "do-choi-me-be", categorySlug: "do-choi-me-be" },
    { id: "tab-5", label: "Máy tính bảng", url: "may-tinh-bang", categorySlug: "dien-thoai-may-tinh-bang" },
    { id: "tab-6", label: "Đồng hồ", url: "phu-kien-dong-ho", categorySlug: "dong-ho-va-trang-suc" },
  ];

  // Fetch products từ API khi tab được chọn
  useEffect(() => {
    const fetchProductsForTab = async (tabId: string, categorySlug: string) => {
      // Nếu đã có dữ liệu hoặc đang loading, không fetch lại
      if (products[tabId] || loading[tabId]) return;

      setLoading(prev => ({ ...prev, [tabId]: true }));
      
      try {
        // Tìm categoryId từ slug
        const category = await categoryService.findCategoryBySlug(categorySlug);
        const categoryId = category?.id;

        if (!categoryId) {
          // Fallback: sử dụng dữ liệu mẫu cho tab Mỹ phẩm
          if (tabId === "tab-1") {
            setProducts(prev => ({ ...prev, [tabId]: cosmeticProducts }));
          } else {
            setProducts(prev => ({ ...prev, [tabId]: [] }));
          }
          setLoading(prev => ({ ...prev, [tabId]: false }));
          return;
        }

        // Fetch từ API Recommendations
        const response = await fetch(
          `http://localhost:5130/api/Recommendations/recommend?categoryId=${categoryId}&limit=10`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Kiểm tra nếu có dữ liệu
        if (!data || data.length === 0) {
          // Fallback: sử dụng dữ liệu mẫu cho tab Mỹ phẩm
          if (tabId === "tab-1") {
            setProducts(prev => ({ ...prev, [tabId]: cosmeticProducts }));
          } else {
            setProducts(prev => ({ ...prev, [tabId]: [] }));
          }
          setLoading(prev => ({ ...prev, [tabId]: false }));
          return;
        }
        
        // Map dữ liệu từ API sang format Product
        // Đảm bảo href đúng format: /products/{productId}-{slug}
        const mappedProducts: Product[] = data.map((item: any) => {
          // Tạo href đúng format từ productId và slug
          const href = item.href || `/products/${item.productId}-${item.slug}`;
          
          return {
            productId: item.productId.toString(),
            productName: item.productName,
            price: item.price || '',
            comparePrice: item.comparePrice || undefined,
            imageUrl: item.imageUrl,
            discount: item.discount || undefined,
            href: href, // Format: /products/{id}-{slug}
            slug: item.slug,
            hasVariations: item.hasVariations || false,
            categoryId: item.categoryId,
            productItemId: item.productItemId,
          };
        });

        setProducts(prev => ({ ...prev, [tabId]: mappedProducts }));
      } catch (error) {
        console.error(`Error fetching products for ${tabId}:`, error);
        // Fallback: sử dụng dữ liệu mẫu cho tab Mỹ phẩm
        if (tabId === "tab-1") {
          setProducts(prev => ({ ...prev, [tabId]: cosmeticProducts }));
        } else {
          setProducts(prev => ({ ...prev, [tabId]: [] }));
        }
      } finally {
        setLoading(prev => ({ ...prev, [tabId]: false }));
      }
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData && activeTabData.categorySlug) {
      fetchProductsForTab(activeTab, activeTabData.categorySlug);
    }
  }, [activeTab]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    if (!product.hasVariations) {
      // Parse price từ format "1.000.000 VND" hoặc "1.000.000₫"
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
                      className={`tab-link tabs-title tabtitle1 ajax has-content ${
                        activeTab === tab.id ? "current" : ""
                      }`}
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
                        {activeTab === tab.id && (
                          <div className="block-product">
                            {loading[tab.id] ? (
                              <div style={{ padding: '40px', textAlign: 'center' }}>
                                <div className="spinner-border text-danger" role="status">
                                  <span className="sr-only">Đang tải...</span>
                                </div>
                                <p style={{ marginTop: '16px', color: '#666' }}>Đang tải sản phẩm...</p>
                              </div>
                            ) : products[tab.id] && Array.isArray(products[tab.id]) && products[tab.id].length > 0 ? (
                              <>
                                <div className="row">
                                  {products[tab.id].map((product) => (
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
                                <Link href="/collections/all" className="more bold border-radius-4" title="Xem thêm">
                                  Xem thêm
                                </Link>
                              </>
                            ) : (
                              <div style={{ padding: '40px', textAlign: 'center' }}>
                                <p style={{ color: '#999' }}>Chưa có sản phẩm nào trong danh mục này.</p>
                              </div>
                            )}
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