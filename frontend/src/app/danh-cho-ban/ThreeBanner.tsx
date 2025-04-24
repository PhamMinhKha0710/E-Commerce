// components/ThreeBanner.tsx
import BannerItem from './BannerItem';

const bannerData = [
  {
    href: '/collections/all',
    title: 'ND Mall',
    imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_1.png?1736305669595',
    alt: 'ND Mall',
  },
  {
    href: '/collections/all',
    title: 'ND Mall',
    imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_2.png?1736305669595',
    alt: 'ND Mall',
  },
  {
    href: '/collections/all',
    title: 'ND Mall',
    imgSrc: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_three_banner_3.png?1736305669595',
    alt: 'ND Mall',
  },
];

const ThreeBanner: React.FC = () => {
  return (
    <div className="bg-title-thre-banner">
      <h1 className="title-page">Dành cho bạn</h1>
      <div className="section_three_banner">
        <div className="row">
          {bannerData.map((banner, index) => (
            <BannerItem
              key={index}
              href={banner.href}
              title={banner.title}
              imgSrc={banner.imgSrc}
              alt={banner.alt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeBanner;