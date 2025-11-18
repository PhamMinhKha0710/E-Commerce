// components/BestSellingSectionRight.tsx
import Image from 'next/image';
import Link from 'next/link';

const BestSellingSectionRight: React.FC = () => {
  const products = [
    {
      title: 'SERUM cấp ẩm Skinavis chứa Hyaluronic Acid và B5 dành cho mọi loại da - 30ml',
      href: 'serum-cap-am-skinavis-chua-hyaluronic-acid-va-b5-danh-cho-moi-loai-da-30ml.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-46497655-9e5d-4788-8b79-51d1da47d366.jpg?v=1696233634543',
      price: '350.000₫',
      dataId: 'product-actions-32880881',
    },
    {
      title: 'Dưỡng Mi Toàn Diện FEG Eyelash Enhancer Ban Ngày',
      href: 'duong-mi-toan-dien-feg-eyelash-enhancer-ban-ngay.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp6.jpg?v=1696237386673',
      price: '350.000₫',
      comparePrice: '450.000₫',
      discount: '-22%',
      dataId: 'product-actions-32881796',
    },
    {
      title: 'Kem chống nắng Skinavis - Skinavis sunscreen defense – Phổ rộng, không lên tone da -70ml',
      href: 'kem-chong-nang-skinavis-skinavis-sunscreen-defense-pho-rong-khong-len-tone-da-70ml.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-649111dd-92cf-428e-a56b-55dd50ebcc46.jpg?v=1696234165607',
      price: '650.000₫',
      dataId: 'product-actions-32881007',
    },
    {
      title: 'Sữa Tắm Lifebuoy 800gr Detox Và Sạch Sâu Khỏi Bụi Mịn Pm2.5 Detox 100% Từ Thiên Nhiên Diệt Khuẩn',
      href: 'sua-tam-lifebuoy-800gr-detox-va-sach-sau-khoi-bui-min-pm2-5-detox-100-tu-thien-nhien-diet-khuan.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-93545103-640c-45ed-aa6c-62bfcfd3f19f.jpg?v=1696233511790',
      price: '180.000₫',
      dataId: 'product-actions-32880861',
    },
    {
      title: 'Dầu cá bổ sung Omega-3 DHA & EPA',
      href: 'dau-ca-bo-sung-omega-3-dha-epa.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp5.jpg?v=1696237196033',
      price: '350.000₫',
      dataId: 'product-actions-32881760',
    },
    {
      title: 'Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp',
      href: 'dau-goi-dau-clear-men-perfume-danh-bay-gau-ngua-va-luu-huong-nuoc-hoa-dang-cap.html',
      imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897',
      price: '150.000₫',
      comparePrice: '300.000₫',
      discount: '-50%',
      dataId: 'product-actions-32880831',
    },
    // {
    //   title: 'Thùng 24 chai Sữa nước Ensure Abbott 237ml/chai',
    //   href: 'thung-24-chai-sua-nuoc-ensure-abbott-237ml-chai.html',
    //   imgSrc: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp13.jpg?v=1696241512770',
    //   price: '1.400.000₫',
    //   comparePrice: '2.000.000₫',
    //   discount: '-30%',
    //   dataId: 'product-actions-32882811',
    // },
  ];

  return (
    <div className="col-lg-4 col-md-12 col-12 col-right">
      <div className="position-sticky">
        <div className="block-title">
          <h2>
            <Link href="/collections/all" title="Deal hot trong tuần">
              <Image
                width={26}
                height={21}
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-deal-hot.png?1736305669595"
                alt="Deal hot trong tuần"
              />
              Deal hot trong tuần
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
        <div className="block-content color-bg content-small">
          <div className="list-product-small">
            {products.map((product, index) => (
              <div key={index} className="item">
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
                      {product.discount && <span className="smart">{product.discount}</span>}
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

export default BestSellingSectionRight;