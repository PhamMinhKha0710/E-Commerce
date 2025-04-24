"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface RelatedProductType {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  delivery: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProductType[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  return (
    <section
      className="related-products"
      style={{
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        marginTop: "8px",
        marginBottom: "8px",
      }}
    >
      <h2 className="related-title">Sản phẩm mua kèm</h2>
      <div
        className="swiper-container-wrapper"
        style={{ position: "relative", textAlign: "center" }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={5}
          loop={products.length > 5}
          grabCursor={true}
          watchSlidesProgress={true}
          pagination={{
            el: ".related-products .swiper-pagination",
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
            300: { slidesPerView: 1 },
            500: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="related-products-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div
                className="product-card"
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  minHeight: "388px",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Link href="#" className="product-link">
                  <div className="product-image">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={163}
                      height={163}
                      style={{ display: "block", margin: "0 auto" }}
                    />
                  </div>
                  <div
                    className="product-info"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "14px", margin: "10px 0" }}>
                        {product.name}
                      </h3>
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: "gold" }}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div
                        className="product-price"
                        style={{ margin: "10px 0" }}
                      >
                        {product.originalPrice &&
                        product.originalPrice > product.price ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "gray",
                                marginRight: "5px",
                              }}
                            >
                              {product.originalPrice.toLocaleString()}₫
                            </span>
                            <br />
                            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                              {product.price.toLocaleString()}₫
                            </span>
                          </>
                        ) : (
                          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                            {product.price.toLocaleString()}₫
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          borderTop: "1px solid #e0e0e0",
                          margin: "5px 0",
                        }}
                      ></div>
                      <div
                        className="delivery-info"
                        style={{
                          fontSize: "12px",
                          color: "gray",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {product.delivery.includes("Giao chiều mai") && (
                          <Image
                            src="https://salt.tikicdn.com/cache/w96/ts/tka/65/be/89/d0c3208134f19e4bab8b50d81b41933a.png"
                            alt="Delivery"
                            width={32}
                            height={16}
                            style={{ marginRight: "5px" }}
                          />
                        )}
                        <span>{product.delivery}</span>
                      </div>
                      <button
                        className="add-to-cart"
                        style={{
                          height: "30px",
                          lineHeight: "0.5",
                          borderRadius: "5px",
                          backgroundColor: "var(--maincolor)",
                          color: "white",
                          width: "100%",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className="swiper-button-prev-custom"
          style={{
            position: "absolute",
            top: "50%",
            left: "-15px",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: prevHover ? "rgb(240, 240, 240)" : "#f0f0f0", // Bỏ dấu chấm phẩy
            border: prevHover ? '1px solid red' : '1px solid #ccc',
            cursor: "pointer",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={() => setPrevHover(true)}
          onMouseLeave={() => setPrevHover(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={prevHover ? "white" : "#333333"}
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="swiper-button-next-custom"
          style={{
            position: "absolute",
            top: "50%",
            right: "-15px",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: nextHover ? "rgb(228, 223, 223)" : "#f0f0f0", // Thêm dấu phẩy
            border: nextHover ? '1px solid red' : '1px solid #ccc',
            cursor: "pointer",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={nextHover ? "white" : "#333333"}
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <div
          className="swiper-pagination"
          style={{ bottom: "var(--swiper-pagination-bottom, -18px)" }}
        ></div>
      </div>
    </section>
  );
};

export default RelatedProducts;