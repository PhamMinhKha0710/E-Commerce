//ProductImageCarousel.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState } from 'react';
import Image from 'next/image'; // Import Image từ Next.js
import SwiperCore from 'swiper'; // Import SwiperCore để định nghĩa kiểu
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  // Sử dụng SwiperCore | null thay vì any
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className="product-image-block relative">
      <div className="swiper-image">
        {/* Main Image Slider */}
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation
          spaceBetween={0}
          slidesPerView={1}
          className="gallery-top"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} data-hash={index}>
              <a href={image} title="Click để xem">
                <Image
                  height={540}
                  width={540}
                  src={image}
                  alt={alt}
                  className="img-responsive mx-auto d-block swiper-lazy"
                  loading="lazy" // Tương đương với swiper-lazy
                />
              </a>
            </SwiperSlide>
          ))}
          <div className="product-reviews-wish">
            <a
              href="javascript:void(0)"
              className="action btn-compare js-btn-wishlist setWishlist btn-views"
              data-wish="tai-nghe-bluetooth-headphone-edifier-w820nb-plus-thoang-khi-thoai-mai"
              title="Thêm vào yêu thích"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                <path
                  d="M1.21763 5.64124C0.581381 3.86545 1.37671 1.60538 3.12641 1.12108C4.08078 0.798209 5.35327 1.12106 5.98952 2.08967C6.62577 1.12106 7.89826 0.798209 8.85263 1.12108C10.7614 1.76682 11.3977 3.86545 10.7614 5.64124C9.96609 8.38563 6.78483 10 5.98952 10C5.19421 9.83856 2.17201 8.54707 1.21763 5.64124Z"
                  stroke="white"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Swiper>

        {/* Thumbnail Slider */}
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={5}
          slidesPerView={5}
          watchSlidesProgress
          className="gallery-thumbs"
          navigation
          breakpoints={{
            300: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 5, spaceBetween: 10 },
            768: { slidesPerView: 5, spaceBetween: 10 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1199: { slidesPerView: 5, spaceBetween: 10 },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} data-hash={index}>
              <div className="p-100">
                <Image
                  height={80}
                  width={80}
                  src={image.replace('1024x1024', 'medium')} // Điều chỉnh kích thước ảnh
                  alt={alt}
                  className="swiper-lazy"
                  loading="lazy" // Tương đương với swiper-lazy
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}