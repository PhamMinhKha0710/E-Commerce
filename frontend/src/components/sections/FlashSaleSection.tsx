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

  // State để lưu trữ thời gian đếm ngược
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Ngày mục tiêu từ data-date
  const targetDate = new Date("2025-06-30T00:00:00").getTime();

  useEffect(() => {
    // Hàm tính toán thời gian còn lại
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
        // Nếu thời gian đã hết, đặt tất cả về 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Cập nhật thời gian mỗi giây
    const timer = setInterval(calculateTimeLeft, 1000);

    // Gọi ngay lần đầu để tránh delay
    calculateTimeLeft();

    // Cleanup interval khi component unmount
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
              href="tai-nghe-bluetooth-headphone-edifier-w820nb-plus-thoang-khi-thoai-mai.html"
              title="Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái"
              src="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp20.jpg?v=1696241238643"
              discount="- 42%"
              price="1.399.000₫"
              comparePrice="2.399.000₫"
              variantId="99452672"
              sold="48"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="dau-goi-dau-clear-men-perfume-danh-bay-gau-ngua-va-luu-huong-nuoc-hoa-dang-cap.html"
              title="Dầu Gội Đầu CLEAR MEN Perfume Đánh Bay Gàu Ngứa Và Lưu Hương Nước Hoa Đẳng Cấp"
              src="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/1-1b8641c8-6064-43a5-8e07-dc697eb04a6e.jpg?v=1696233327897"
              discount="- 50%"
              price="150.000₫"
              comparePrice="300.000₫"
              variantId="99344172"
              sold="104"
              isOption={true}
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="chuot-khong-day-logitech-b170-usb-nho-gon-thuan-ca-2-tay-phu-hop-pc-laptop.html"
              title="Chuột không dây Logitech B170 - USB, nhỏ gọn, thuận cả 2 tay, phù hợp PC/Laptop"
              src="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp21.jpg?v=1696240462333"
              discount="- 26%"
              price="295.000₫"
              comparePrice="400.000₫"
              variantId="99435662"
              sold="73"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="banh-quy-dinh-duong-afc-vi-lua-mi-combo-2-hop-x-172g.html"
              title="Bánh quy dinh dưỡng AFC vị lúa mì, combo 2 hộp x 172g"
              src="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp1.jpg?v=1696238355997"
              discount="- 25%"
              price="60.000₫"
              comparePrice="80.000₫"
              variantId="99422168"
              sold="131"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FlashSaleProduct
              href="ao-chong-nang-nu-dong-uv-sunstop-master-mu-lien-mong-nhe-thoang-mat.html"
              title="Áo chống nắng NỮ dòng UV SunStop Master mũ liền mỏng nhẹ thoáng mát"
              src="http://bizweb.dktcdn.net/thumb/large/100/497/938/products/sp4.jpg?v=1696237642290"
              discount="- 23%"
              price="575.000₫"
              comparePrice="750.000₫"
              variantId="99399079"
              sold="Đang mở bán"
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