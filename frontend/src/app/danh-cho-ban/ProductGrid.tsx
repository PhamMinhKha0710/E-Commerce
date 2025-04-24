// components/ProductGrid.tsx
"use client";
import ProductItem from './ProductItem';

const productData = [
  {
    id: '32899086',
    title: 'iPhone 14 Pro Max',
    href: '/iphone-14-pro-max',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
    alt: 'iPhone 14 Pro Max',
    price: '26.000.000₫',
    comparePrice: '28.000.000₫',
    discount: '-7%',
    variantId: '99496971',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
    hasOptions: true,
  },
  {
    id: '32898940',
    title: 'iPhone 15 Pro Max Titan Xanh 256g',
    href: '/iphone-15-pro-max-titan-xanh-256g',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a1.jpg?v=1696321359880',
    alt: 'iPhone 15 Pro Max Titan Xanh 256g',
    price: '34.000.000₫',
    comparePrice: '36.000.000₫',
    discount: '-6%',
    variantId: '99492095',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882774',
    title: 'Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái',
    href: '/tai-nghe-bluetooth-headphone-edifier-w820nb-plus-thoang-khi-thoai-mai',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp20.jpg?v=1696241238643',
    alt: 'Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái',
    price: '1.399.000₫',
    comparePrice: '2.399.000₫',
    discount: '-42%',
    variantId: '99452672',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882682',
    title: 'Tai nghe bluetooth Galaxy Buds 2 Pro',
    href: '/tai-nghe-bluetooth-galaxy-buds-2-pro',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp22.jpg?v=1696240818597',
    alt: 'Tai nghe bluetooth Galaxy Buds 2 Pro',
    price: '400.000₫',
    comparePrice: '600.000₫',
    discount: '-33%',
    variantId: '99442226',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
    hasOptions: true,
  },
  {
    id: '32882553',
    title: 'Chuột không dây Logitech B170 - USB, nhỏ gọn, thuận cả 2 tay, phù hợp PC/Laptop',
    href: '/chuot-khong-day-logitech-b170-usb-nho-gon-thuan-ca-2-tay-phu-hop-pc-laptop',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp21.jpg?v=1696240462333',
    alt: 'Chuột không dây Logitech B170 - USB, nhỏ gọn, thuận cả 2 tay, phù hợp PC/Laptop',
    price: '295.000₫',
    comparePrice: '400.000₫',
    discount: '-26%',
    variantId: '99435662',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882737',
    title: 'Hub chia cổng Baseus cổng Type C sang HDMI USB 3.0 dành choPro Air Surface Pro 7',
    href: '/hub-chia-cong-baseus-cong-type-c-sang-hdmi-usb-3-0-danh-chopro-air-surface-pro-7',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp18.jpg?v=1696241086293',
    alt: 'Hub chia cổng Baseus cổng Type C sang HDMI USB 3.0 dành choPro Air Surface Pro 7',
    price: '499.000₫',
    comparePrice: '1.090.000₫',
    discount: '-54%',
    variantId: '99446998',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882811',
    title: 'Thùng 24 chai Sữa nước Ensure Abbott 237ml/chai',
    href: '/thung-24-chai-sua-nuoc-ensure-abbott-237ml-chai',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp13.jpg?v=1696241512770',
    alt: 'Thùng 24 chai Sữa nước Ensure Abbott 237ml/chai',
    price: '1.400.000₫',
    comparePrice: '2.000.000₫',
    discount: '-30%',
    variantId: '99455439',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882800',
    title: 'Sữa 9 loại hạt Vinamilk Super Nut Super Nut - Thùng 24 hộp 180ml',
    href: '/sua-9-loai-hat-vinamilk-super-nut-super-nut-thung-24-hop-180ml',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp12.jpg?v=1696241450383',
    alt: 'Sữa 9 loại hạt Vinamilk Super Nut Super Nut - Thùng 24 hộp 180ml',
    price: '250.000₫',
    comparePrice: '450.000₫',
    discount: '-44%',
    variantId: '99455347',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32882796',
    title: 'Mì Omachi Tôm Chua Cay Thái Gói 80g',
    href: '/mi-omachi-tom-chua-cay-thai-goi-80g',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp11.jpg?v=1696241389353',
    alt: 'Mì Omachi Tôm Chua Cay Thái Gói 80g',
    price: 'Liên hệ',
    variantId: '99454833',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
    isContact: true,
  },
  {
    id: '32882789',
    title: 'Thùng 48 hộp sữa tươi tiệt trùng TH True Milk HILO 180ml (180ml x 48)',
    href: '/thung-48-hop-sua-tuoi-tiet-trung-th-true-milk-hilo-180ml-180ml-x-48',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp10.jpg?v=1696241335590',
    alt: 'Thùng 48 hộp sữa tươi tiệt trùng TH True Milk HILO 180ml (180ml x 48)',
    price: '550.000₫',
    comparePrice: '680.000₫',
    discount: '-19%',
    variantId: '99454309',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881994',
    title: 'Bánh quy dinh dưỡng AFC vị lúa mì, combo 2 hộp x 172g',
    href: '/banh-quy-dinh-duong-afc-vi-lua-mi-combo-2-hop-x-172g',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1.jpg?v=1696238355997',
    alt: 'Bánh quy dinh dưỡng AFC vị lúa mì, combo 2 hộp x 172g',
    price: '60.000₫',
    comparePrice: '80.000₫',
    discount: '-25%',
    variantId: '99422168',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881969',
    title: 'Bánh Bông Lan SOLITE Tầng Dinh Dưỡng Vị Cam Tươi Mới Combo 2 hộp x 238g',
    href: '/banh-bong-lan-solite-tang-dinh-duong-vi-cam-tuoi-moi-combo-2-hop-x-238g',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp7.jpg?v=1696238206467',
    alt: 'Bánh Bông Lan SOLITE Tầng Dinh Dưỡng Vị Cam Tươi Mới Combo 2 hộp x 238g',
    price: '170.000₫',
    variantId: '99418802',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881935',
    title: 'Áo thể thao nam Coolmate Basics thấm hút nhanh khô',
    href: '/ao-the-thao-nam-coolmate-basics-tham-hut-nhanh-kho',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/vn-11134201-7qukw-li6s4mh53npu08.jpg?v=1696238007747',
    alt: 'Áo thể thao nam Coolmate Basics thấm hút nhanh khô',
    price: '199.000₫',
    variantId: '99413340',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
    hasOptions: true,
  },
  {
    id: '32881859',
    title: 'Dép Quai Ngang Unisex Crocs Camo Classic - Black/Red',
    href: '/dep-quai-ngang-unisex-crocs-camo-classic-black-red',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-37fbd4c1-397c-4dac-8a64-b1d80d5e114b.jpg?v=1696237749100',
    alt: 'Dép Quai Ngang Unisex Crocs Camo Classic - Black/Red',
    price: '680.000₫',
    variantId: '99405368',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881839',
    title: 'Áo chống nắng NỮ dòng UV SunStop Master mũ liền mỏng nhẹ thoáng mát',
    href: '/ao-chong-nang-nu-dong-uv-sunstop-master-mu-lien-mong-nhe-thoang-mat',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp4.jpg?v=1696237642290',
    alt: 'Áo chống nắng NỮ dòng UV SunStop Master mũ liền mỏng nhẹ thoáng mát',
    price: '575.000₫',
    comparePrice: '750.000₫',
    discount: '-23%',
    variantId: '99399079',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881815',
    title: 'Áo chống nắng Nữ chống tia UV SunStop X dáng dài thoáng mát',
    href: '/ao-chong-nang-nu-chong-tia-uv-sunstop-x-dang-dai-thoang-mat',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp3.jpg?v=1696237498903',
    alt: 'Áo chống nắng Nữ chống tia UV SunStop X dáng dài thoáng mát',
    price: '475.000₫',
    comparePrice: '575.000₫',
    discount: '-17%',
    variantId: '99397119',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881796',
    title: 'Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày',
    href: '/duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673',
    alt: 'Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày',
    price: '350.000₫',
    comparePrice: '450.000₫',
    discount: '-22%',
    variantId: '99395048',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881760',
    title: 'Dầu cá bổ sung Omega-3 DHA & EPA',
    href: '/dau-ca-bo-sung-omega-3-dha-epa',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033',
    alt: 'Dầu cá bổ sung Omega-3 DHA & EPA',
    price: '350.000₫',
    variantId: '99391238',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32881007',
    title: 'Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml',
    href: '/kem-chong-nang-skinavis-skinavis-sunscreen-defense-pho-rong-khong-len-tone-da-70ml',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607',
    alt: 'Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml',
    price: '650.000₫',
    variantId: '99350396',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
  {
    id: '32880881',
    title: 'SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml',
    href: '/serum-cap-am-skinavis-chua-hyaluronic-acid-va-b5-danh-cho-moi-loai-da-30ml',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543',
    alt: 'SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml',
    price: '350.000₫',
    variantId: '99344320',
    formAction: 'https://nd-mall.mysapo.net/cart/add',
  },
];

const ProductGrid: React.FC = () => {
    const handleAddToWishlist = (wish: string) => {
      // Logic thêm vào wishlist (gọi API nếu cần)
      console.log(`Added to wishlist: ${wish}`);
    };
  
    const handleAddToCart = (variantId: string) => {
      // Logic thêm vào giỏ hàng (gọi API nếu cần)
      console.log(`Added to cart: ${variantId}`);
    };
  
return (
    <div className="products-view products-view-grid list_hover_pro">
    <div className="row margin">
        {productData.map((product) => (
        <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            href={product.href}
            imgSrc={product.imgSrc}
            alt={product.alt}
            price={product.price}
            comparePrice={product.comparePrice}
            discount={product.discount}
            variantId={product.variantId}
            formAction={product.formAction}
            hasOptions={product.hasOptions}
            isContact={product.isContact}
            onAddToWishlist={handleAddToWishlist}
            onAddToCart={handleAddToCart}
        />
        ))}
    </div>
    </div>
);
};

export default ProductGrid;