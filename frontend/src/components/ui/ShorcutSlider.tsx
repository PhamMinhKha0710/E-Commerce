"use client";
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image'; // Import Image

const ShortcutSlider = () => {
  const swiperElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperElRef.current) {
      const swiperShortcut = new Swiper(swiperElRef.current, {
        slidesPerView: 5,
        loop: false,
        grabCursor: true,
        spaceBetween: 15,
        roundLengths: true,
        slideToClickedSlide: false,
        autoplay: {
          delay: 4000,
        },
        navigation: {
          nextEl: ".shortcut-slider .swiper-button-next",
          prevEl: ".shortcut-slider .swiper-button-prev",
        },
        pagination: {
          el: ".shortcut-slider .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          300: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          500: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 15,
          },
        },
      });

      return () => {
        swiperShortcut.destroy();
      };
    }
  }, []);

  return (
    <div className="shortcut-slider swiper-container" ref={swiperElRef}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <Link href="/collections/all" className="icon" title="Top 100 ưu đãi">
            <Image
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_shortcut_1.jpg?1736305669595"
              alt="Top 100 ưu đãi"
              width={40}
              height={40}
              className="img-responsive"
            />
          </Link>
          <h3>
            <Link href="/collections/all" className="clearfix" title="Top 100 ưu đãi">
              Top 100 ưu đãi
            </Link>
          </h3>
        </div>
        <div className="swiper-slide">
          <Link href="/collections/all" className="icon" title="Mã giảm giá">
            <Image
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_shortcut_2.jpg?1736305669595"
              alt="Mã giảm giá"
              width={40}
              height={40}
              className="img-responsive"
            />
          </Link>
          <h3>
            <Link href="/collections/all" className="clearfix" title="Mã giảm giá">
              Mã giảm giá
            </Link>
          </h3>
        </div>
        <div className="swiper-slide">
          <Link href="/collections/all" className="icon" title="Quà tặng">
            <Image
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_shortcut_3.jpg?1736305669595"
              alt="Quà tặng"
              width={40}
              height={40}
              className="img-responsive"
            />
          </Link>
          <h3>
            <Link href="/collections/all" className="clearfix" title="Quà tặng">
              Quà tặng
            </Link>
          </h3>
        </div>
        <div className="swiper-slide">
          <Link href="/collections/all" className="icon" title="Xả kho">
            <Image
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_shortcut_4.jpg?1736305669595"
              alt="Xả kho"
              width={40}
              height={40}
              className="img-responsive"
            />
          </Link>
          <h3>
            <Link href="/collections/all" className="clearfix" title="Xả kho">
              Xả kho
            </Link>
          </h3>
        </div>
        <div className="swiper-slide">
          <Link href="/collections/all" className="icon" title="Tìm kiếm nhiều">
            <Image
              src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_shortcut_5.jpg?1736305669595"
              alt="Tìm kiếm nhiều"
              width={40}
              height={40}
              className="img-responsive"
            />
          </Link>
          <h3>
            <Link href="/collections/all" className="clearfix" title="Tìm kiếm nhiều">
              Tìm kiếm nhiều
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ShortcutSlider;