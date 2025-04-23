// components/CategorySection.tsx
import Image from 'next/image';
import Link from 'next/link';

const CategorySection: React.FC = () => {
  const categories = [
    { name: 'Tivi', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_1.png?1736305669595' },
    { name: 'Điện thoại & phụ kiện', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_2.png?1736305669595', multiline: true },
    { name: 'Máy ảnh & máy quay', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_3.png?1736305669595', multiline: true },
    { name: 'Tủ lạnh', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_4.png?1736305669595' },
    { name: 'Điều hòa', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_5.png?1736305669595' },
    { name: 'Máy giặt', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_6.png?1736305669595' },
    { name: 'Laptop', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_7.png?1736305669595' },
    { name: 'Quạt', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_8.png?1736305669595' },
    { name: 'Đồ dùng nhà bếp', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_9.png?1736305669595', multiline: true },
    { name: 'Thời trang nam', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_10.png?1736305669595' },
    { name: 'Thời trang nữ', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_11.png?1736305669595' },
    { name: 'Đồ chơi', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_12.png?1736305669595' },
    { name: 'Sắc đẹp', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_13.png?1736305669595' },
    { name: 'Thể thao', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_14.png?1736305669595' },
    { name: 'Đồng hồ', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_15.png?1736305669595' },
    { name: 'Balo & túi', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_16.png?1736305669595' },
    { name: 'Sách truyện', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_17.png?1736305669595' },
    { name: 'Giày dép', imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_cate_18.png?1736305669595' },
  ];

  return (
    <div className="section_cate">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                width={28}
                height={27}
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-cate.png?1736305669595"
                alt="Danh mục nổi bật"
              />
              Danh mục nổi bật
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
          <div className="block-content">
            {categories.map((category, index) => (
              <div key={index} className="item">
                <Link href="/collections/all" title={category.name}>
                  <Image
                    width={62}
                    height={63}
                    className="img-responsive"
                    src={category.imgSrc}
                    alt={category.name}
                    loading="lazy"
                  />
                </Link>
                <h3>
                  <Link href="/collections/all" title={category.name}>
                    {category.multiline ? (
                      category.name.split(' & ').map((text, i) => (
                        <span key={i}>
                          {text}
                          {i < category.name.split(' & ').length - 1 && <br />}
                        </span>
                      ))
                    ) : (
                      category.name
                    )}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;