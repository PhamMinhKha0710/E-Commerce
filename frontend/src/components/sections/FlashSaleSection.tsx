// src/components/sections/FlashSaleSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import FlashSaleProduct from "@/components/product/FlashSaleProduct";

const FlashSaleSection = () => {
  const swiperRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date("2025-06-30T00:00:00").getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="section_flashsale">
      <div className="block-title">
        <h2 className="title-module">
          <a href="/san-pham-khuyen-mai" title="Giá tốt mỗi ngày">
            Giá tốt mỗi ngày
          </a>
        </h2>
        <div className="thump-flash">
          <div className="count-down">
            <div className="timer-view" data-countdown="countdown" data-date="2025-06-30-00-00-00">
              <span className="countdown-item">{timeLeft.days.toString().padStart(2, "0")}</span>
              <span className="countdown-separator">:</span>
              <span className="countdown-item">{timeLeft.hours.toString().padStart(2, "0")}</span>
              <span className="countdown-separator">:</span>
              <span className="countdown-item">{timeLeft.minutes.toString().padStart(2, "0")}</span>
              <span className="countdown-separator">:</span>
              <span className="countdown-item">{timeLeft.seconds.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </div>
        <a href="/san-pham-khuyen-mai" className="view_more" title="Xem tất cả">
          Xem tất cả
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
          >
            <path
              d="M6.19525 0.528575C6.4556 0.268226 6.87771 0.268226 7.13806 0.528575L11.1381 4.52858C11.2631 4.6536 11.3333 4.82317 11.3333 4.99998C11.3333 5.17679 11.2631 5.34636 11.1381 5.47138L7.13806 9.47138C6.87771 9.73173 6.4556 9.73173 6.19525 9.47138C5.9349 9.21103 5.9349 8.78892 6.19525 8.52857L9.05718 5.66665L1.33332 5.66665C0.965133 5.66665 0.666656 5.36817 0.666656 4.99998C0.666656 4.63179 0.965133 4.33331 1.33332 4.33331H9.05718L6.19525 1.47138C5.9349 1.21103 5.9349 0.788925 6.19525 0.528575Z"
              fill="#333333"
            />
          </svg>
        </a>
      </div>
      <div className="swiper-container-wrapper" style={{ position: "relative" }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop={false}
          grabCursor={true}
          watchSlidesProgress={true}
          pagination={{
            el: ".product-flash-swiper .swiper-pagination",
            clickable: true,
          }}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            300: { slidesPerView: 2 },
            500: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            991: { slidesPerView: 4 },
            1200: { slidesPerView: 4 },
          }}
          className="product-flash-swiper swiper-container"
          ref={swiperRef}
        >
          <SwiperSlide>
            <FlashSaleProduct
              href="/products/1-tai-nghe-bluetooth-edifier-w820nb-plus"
              productName="Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái"
              imageUrl="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp20.jpg?v=1696241238643"
              discount="- 42%"
              price="1.399.000₫"
              comparePrice="2.399.000₫"
              productId="1"
              slug="tai-nghe-bluetooth-edifier-w820nb-plus"
              sold="48"
              hasVariations={false}
              productItemId={1}
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="/products/2-dau-goi-clear-men-perfume"
              productName="Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp"
              imageUrl="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897"
              discount="- 50%"
              price="150.000₫"
              comparePrice="300.000₫"
              productId="2"
              slug="dau-goi-clear-men-perfume"
              sold="104"
              hasVariations={true}
              productItemId={2}
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="/products/3-chuot-khong-day-logitech-b170"
              productName="Chuột không dây Logitech B170 - USB, nhỏ gọn, thuận cả 2 tay, phù hợp PC/Laptop"
              imageUrl="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp21.jpg?v=1696240462333"
              discount="- 26%"
              price="295.000₫"
              comparePrice="400.000₫"
              productId="3"
              slug="chuot-khong-day-logitech-b170"
              sold="73"
              hasVariations={false}
              productItemId={3}
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="/products/4-banh-quy-dinh-duong-afc"
              productName="Bánh quy dinh dưỡng AFC vị lúa mì, combo 2 hộp x 172g"
              imageUrl="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1.jpg?v=1696238355997"
              discount="- 25%"
              price="60.000₫"
              comparePrice="80.000₫"
              productId="4"
              slug="banh-quy-dinh-duong-afc"
              sold="131"
              hasVariations={false}
              productItemId={4}
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="/products/5-ao-chong-nang-nu-uv-sunstop"
              productName="Áo chống nắng NỮ dòng UV SunStop Master mũ liền mỏng nhẹ thoáng mát"
              imageUrl="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp4.jpg?v=1696237642290"
              discount="- 23%"
              price="575.000₫"
              comparePrice="750.000₫"
              productId="5"
              slug="ao-chong-nang-nu-uv-sunstop"
              sold="Đang mở bán"
              hasVariations={false}
              productItemId={5}
            />
          </SwiperSlide>
        </Swiper>
        <button className="swiper-button-prev-custom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="swiper-button-next-custom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default FlashSaleSection;