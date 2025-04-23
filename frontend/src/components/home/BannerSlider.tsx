import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BannerSlider = () => {
  return (
    <div className="col-lg-4 col-md-4 col-12 d-md-block d-none">
      <Link href="/collections/all" className="banner-slider hover-banner" title="ND Mall">
        <Image
          className="lazyload"
          src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_banner_slider_1.jpg?1736305669595"
          alt="ND Mall"
          width={400}  // Adjust width as needed
          height={200} // Adjust height as needed
        />
      </Link>
      <Link href="/collections/all" className="banner-slider hover-banner margin" title="ND Mall">
        <Image
          className="lazyload"
          src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img_banner_slider_2.jpg?1736305669595"
          alt="ND Mall"
          width={400}  // Adjust width as needed
          height={200} // Adjust height as needed
        />
      </Link>
    </div>
  );
};

export default BannerSlider;