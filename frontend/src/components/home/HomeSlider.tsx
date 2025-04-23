'use client';

import React, { useEffect, useRef } from 'react';
import 'swiper/css/bundle';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules'; // Thêm Navigation module

const HomeSlider = () => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    if (swiperElRef.current) {
      const swiper = new Swiper(swiperElRef.current, {
        modules: [Autoplay, Navigation], // Thêm Navigation vào modules
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.home-slider .swiper-pagination',
          clickable: true,
        },
        navigation: { // Thêm cấu hình navigation
          nextEl: '.home-slider .swiper-button-next',
          prevEl: '.home-slider .swiper-button-prev',
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, []);

  return (
    <div className="home-slider swiper-container" ref={swiperElRef}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <Link href="/collections/all" className="clearfix" title="Banner">
            <picture>
              <source
                media="(min-width: 1200px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_1.jpg?1736305669595"
              />
              <source
                media="(min-width: 992px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_1.jpg?1736305669595"
              />
              <source
                media="(min-width: 569px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_1.jpg?1736305669595"
              />
              <source
                media="(max-width: 567px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_1.jpg?1736305669595"
              />
              <Image
                width={604}
                height={279}
                src="http://bizweb.dktcdn.net/thumb/grande/100/497/938/themes/938102/assets/slider_1.jpg?1736305669595"
                alt="Banner"
                className="img-responsive"
              />
            </picture>
          </Link>
        </div>
        <div className="swiper-slide">
          <Link href="/collections/all" className="clearfix" title="Banner">
            <picture>
              <source
                media="(min-width: 1200px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_2.jpg?1736305669595"
              />
              <source
                media="(min-width: 992px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_2.jpg?1736305669595"
              />
              <source
                media="(min-width: 569px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_2.jpg?1736305669595"
              />
              <source
                media="(max-width: 567px)"
                srcSet="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/slider_2.jpg?1736305669595"
              />
              <Image
                width={604}
                height={279}
                src="http://bizweb.dktcdn.net/thumb/grande/100/497/938/themes/938102/assets/slider_2.jpg?1736305669595"
                alt="Banner"
                className="img-responsive"
              />
            </picture>
          </Link>
        </div>
      </div>
      <div className="swiper-pagination"></div>
      {/* Thêm hai nút navigation */}
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  );
};

export default HomeSlider;