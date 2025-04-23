// components/ThreeBanner.tsx
import Image from 'next/image';
import Link from 'next/link';

const ThreeBanner: React.FC = () => {
  const bannerItems = [
    {
      src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_1.png?1736305669595',
      alt: 'ND Mall',
      href: '/collections/all'
    },
    {
      src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_2.png?1736305669595',
      alt: 'ND Mall',
      href: '/collections/all'
    },
    {
      src: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_3.png?1736305669595',
      alt: 'ND Mall',
      href: '/collections/all'
    }
  ];

  return (
    <div className="section_three_banner">
      <div className="container">
        <div className="row">
          {bannerItems.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-4 col-12 item">
              <Link href={item.href} title={item.alt} className="hover-banner">
                <Image
                  className="img-responsive"
                  src={item.src}
                  alt={item.alt}
                  width={500} // Thêm width thích hợp
                  height={300} // Thêm height thích hợp
                  loading="lazy"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeBanner;