"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image"; // Sử dụng Image từ Next.js để tối ưu hình ảnh

const BrandSection = () => {
  const swiperRef = useRef(null);

  // Dữ liệu thương hiệu (có thể lấy từ API hoặc props nếu cần)
  const brands = [
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand1.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand1.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand2.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand2.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand3.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand3.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand4.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand4.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand5.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand5.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand6.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand6.jpg?1736305669595",
      alt: "ND Mall",
    },
    {
      href: "/collections/all",
      title: "ND Mall",
      imgSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/brand7.jpg?1736305669595",
      logoSrc: "http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo_brand7.jpg?1736305669595",
      alt: "ND Mall",
    },
  ];

  return (
    <div className="sec_brand">
      <div className="container">
        <div className="color-bg">
          <div className="block-title">
            <h2>
              <Image
                width={26}
                height={25}
                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon-title-brand.png?1736305669595"
                alt="Thương hiệu chính hãng"
              />
              Thương hiệu chính hãng
            </h2>
            <a href="/thuong-hieu" className="view_more" title="Xem tất cả">
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
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={5} // Mặc định hiển thị 5 thương hiệu
              loop={false}
              grabCursor={true}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                300: { slidesPerView: 2 },
                500: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                991: { slidesPerView: 5 },
                1200: { slidesPerView: 5 },
              }}
              className="swiper-brand swiper-container"
              ref={swiperRef}
            >
              {brands.map((brand, index) => (
                <SwiperSlide key={index}>
                  <a href={brand.href} title={brand.title}>
                    <Image
                      className="img-responsive img-brand"
                      src={brand.imgSrc}
                      alt={brand.alt}
                      width={200} // Điều chỉnh kích thước phù hợp
                      height={100}
                      loading="lazy" // Tự động lazy load với Next.js
                    />
                    <Image
                      className="img-responsive logo-brand"
                      src={brand.logoSrc}
                      alt={brand.alt}
                      width={100}
                      height={50}
                      loading="lazy"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev-custom ">
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
        </div>
      </div>
    </div>
  );
};

export default BrandSection;