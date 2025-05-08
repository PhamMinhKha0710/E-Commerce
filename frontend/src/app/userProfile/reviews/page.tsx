'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import '@/styles/userProfileStyles.css';

// Định nghĩa kiểu dữ liệu cho ReviewItem
interface ReviewItem {
  id: string;
  productName: string;
  image: string;
  rating: number;
  reviewContent: string;
  suggestion?: string;
  likes: number;
  comments: { sellerName: string; content: string; time: string }[];
}

// Định nghĩa kiểu dữ liệu cho PendingReviewItem
interface PendingReviewItem {
  id: string;
  productName: string;
  image: string;
  price: string;
  purchaseDate: string;
}

export default function Reviews() {
  const [activeTab, setActiveTab] = useState<string>('reviewed'); // Mặc định tab "Đã đánh giá" active
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Đồng bộ Swiper với activeTab
  useEffect(() => {
    const index = tabIndexMap[activeTab];
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, [activeTab]);

  // Dữ liệu giả cho các tab
  const reviewData: { pending: PendingReviewItem[]; reviewed: ReviewItem[] } = {
    pending: [
      {
        id: '1',
        productName: 'Máy Xay Sinh Tố Philips HR2223/00 - Hàng Chính Hãng',
        image: 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/product/0b/69/15/650ca01cb0e026b18eb2eda3d8f5419b.jpg',
        price: '1.250.000 ₫',
        purchaseDate: '2025-05-01',
      },
      {
        id: '2',
        productName: 'Tai Nghe Bluetooth AirPods Pro 2023 - Hàng Chính Hãng Apple',
        image: 'https://salt.tikicdn.com/cache/280x280/ts/product/1b/2c/3d/4e5f6g7h8i9j0k1l2m3n4o5p6q.jpg',
        price: '5.990.000 ₫',
        purchaseDate: '2025-04-28',
      },
      {
        id: '3',
        productName: 'Sách "Nhà Giả Kim" - Paulo Coelho',
        image: 'https://salt.tikicdn.com/cache/280x280/ts/product/3a/4b/5c/6d7e8f9g0h1i2j3k4l5m6n.jpg',
        price: '85.000 ₫',
        purchaseDate: '2025-04-25',
      },
    ],
    reviewed: [
      {
        id: '1',
        productName: 'Gel bôi trơn OZO Lubricant Performa Cool mát lạnh, gấp đôi độ trơn - Lọ 250ml',
        image: 'https://salt.tikicdn.com/cache/280x280/ts/product/d3/62/b9/76de91be84d0e629ba8c2b531c21847a.jpg',
        rating: 5,
        reviewContent: 'Thơm dùng tốt ae ạ ms dùng nhưng cảm thấy thoải mái rất thích',
        likes: 0,
        comments: [
          {
            sellerName: 'Lifestyles Official Store',
            content:
              'Cảm ơn bạn đã lựa chọn sản phẩm của LifeStyles ạ! LifeStyles rất vui vì bạn đã hài lòng khi trải nghiệm với sản phẩm này. Feedback của bạn rất quan trọng trong việc hoàn thiện và phát triển về cả sản phẩm lẫn dịch vụ giúp LifeStyles ngày càng tốt hơn để phục vụ cho quý các khách hàng. Nếu bạn cần hỗ trợ cứ "Chat ngay" cho LifeStyles, sẽ có Nhân viên CS cho bạn. Với đánh giá 5 sao này bạn hãy inbox cho LifeStyles để nhận ngay mã giảm giá cho đơn hàng sau nhé! Chúc bạn một ngày nhiều năng lượng',
            time: '3 năm trước',
          },
        ],
      },
      {
        id: '2',
        productName: 'Dung Dịch Vệ Sinh Chuyên Biệt Cho Nam Giới Oriss 100g',
        image: 'https://salt.tikicdn.com/cache/280x280/ts/product/6a/1b/f8/9db983952f2c8dbd1a6a8eadf01688c8.jpg',
        rating: 5,
        reviewContent: 'Hơi mỏng dán tường gạch men chứ xi không thì ko dính nhé cần keo dán tường',
        likes: 1,
        comments: [],
      },
      {
        id: '3',
        productName: 'Cuộn 5MÉT Decal giấy dán bếp tráng nhôm cách nhiệt khổ 60cm MẪU Ô HÌNH XANH',
        image: 'https://salt.tikicdn.com/cache/280x280/ts/product/eb/7a/66/7dd0c2e3e48c8af418ff4653c978adea.jpg',
        rating: 5,
        reviewContent: 'Chất lượng tốt',
        likes: 0,
        comments: [],
      },
      {
        id: '4',
        productName: 'Nồi Chiên Không Dầu Comet CM6858 4.2L - Hàng Chính Hãng - CM6858MG',
        image: 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/product/0b/69/15/650ca01cb0e026b18eb2eda3d8f5419b.jpg',
        rating: 5,
        reviewContent: 'Lọ đẹp như hình, kem thơm còn chất lượng thì ms dùng lần đầu chưa biết đc. Shop cực kì dễ thương còn tặng cho kẹp tóc nữa nè kk',
        likes: 2,
        comments: [
          {
            sellerName: 'BÉ KHỎE VÀ MẸ XINH',
            content:
              'Cảm ơn bạn đã tin tưởng và lựa chọn SIÊU DƯỠNG THÂM 5S BIHO LADI bên shop nha. Chúc bạn luôn xinh đẹp, gặp nhiều may mắn và hạnh phúc. Trong quá trình sử dụng, cần hỗ trợ gì cứ nhắn shop ĐT/zalo: *** nha!',
            time: '4 năm trước',
          },
        ],
      },
    ],
  };

  // Map tab với index để điều khiển Swiper
  const tabIndexMap: { [key: string]: number } = {
    pending: 0,
    reviewed: 1,
  };

  // Map index với tab để xác định tab hiện tại khi Swiper thay đổi
  const indexTabMap: { [key: number]: string } = {
    0: 'pending',
    1: 'reviewed',
  };

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-716e004a-0 ipQyos my-reviews">
        <div className="sc-716e004a-2 kexiKt">
          <div className="header__title">Chúc mừng! Đánh giá của bạn đã nhận được</div>
          <div className="header__description">
            <div className="description__block">
              <Image
                src="https://salt.tikicdn.com/ts/upload/dd/f8/8a/dad8ab29ec06c995bd915438481d533b.png"
                alt=""
                width={28}
                height={28}
              />
              <div className="content">
                659<span>Lượt xem</span>
              </div>
            </div>
            <div className="description__block--border"></div>
            <div className="description__block">
              <Image
                src="https://salt.tikicdn.com/ts/upload/76/e4/3f/6d4510e0d9a08c2bec6a7c5b5a97b0ac.png"
                alt=""
                width={28}
                height={28}
              />
              <div className="content">
                1 <span>Lượt cảm ơn</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sc-716e004a-3 fCTRFW">
          <div
            className={activeTab === 'pending' ? 'tab tab--active' : 'tab'}
            onClick={() => handleTabClick('pending')}
          >
            Chờ đánh giá
          </div>
          <div
            className={activeTab === 'reviewed' ? 'tab tab--active' : 'tab'}
            onClick={() => handleTabClick('reviewed')}
          >
            Đã đánh giá
          </div>
        </div>
        <div className="sc-716e004a-4 kKIhiW">
          <Swiper
            initialSlide={tabIndexMap[activeTab]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveTab(indexTabMap[swiper.activeIndex])}
            spaceBetween={0}
            slidesPerView={1}
            speed={500}
            className="react-swipe-container carousel"
          >
            {Object.entries(reviewData).map(([tab], index) => (
              <SwiperSlide key={tab} data-index={index}>
                <div
                  className="infinite-scroll-component"
                  style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 110px)' }}
                >
                  {tab === 'pending' ? (
                    reviewData.pending.length > 0 ? (
                      <div className="pending-reviews">
                        <div className="pending-reviews__title">Sản phẩm chờ đánh giá</div>
                        <div className="pending-reviews__list">
                          {reviewData.pending.map((item) => (
                            <div key={item.id} className="pending-review-item">
                              <div className="pending-review-item__image">
                                <Image
                                  src={item.image}
                                  alt={item.productName}
                                  width={100}
                                  height={100}
                                  className="pending-review-item__image-img"
                                />
                              </div>
                              <div className="pending-review-item__info">
                                <div className="pending-review-item__name">{item.productName}</div>
                                <div className="pending-review-item__price">{item.price}</div>
                                <div className="pending-review-item__date">
                                  Ngày mua: {item.purchaseDate}
                                </div>
                              </div>
                              <div className="pending-review-item__action">
                                <button className="pending-review-item__button">Đánh giá ngay</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="sc-6da7ff97-0 ghxvuf">
                        <Image
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                          alt="no reviews"
                          width={120}
                          height={120}
                        />
                        <p>Chưa có đánh giá</p>
                      </div>
                    )
                  ) : reviewData.reviewed.length > 0 ? (
                    reviewData.reviewed.map((review) => (
                      <div key={review.id} className="waiting__block">
                        <div className="sc-a0ff12a9-0 dKGlZ">
                          <div className="sc-a0ff12a9-1 chycVt">
                            <Image
                              src={review.image}
                              alt={review.productName}
                              className="sc-a0ff12a9-2 kNktCZ"
                              width={280}
                              height={280}
                            />
                          </div>
                          <div className="w-full">
                            <div className="sc-a0ff12a9-3 fQjsCS">
                              <div className="sc-a0ff12a9-4 kbvRdl"></div>
                              <div className="sc-a0ff12a9-5 kMpuPf">
                                <div className="upgrade-seller__name--bold">{review.productName}</div>
                              </div>
                              <div className="mt-4 flex items-center">
                                <div className="sc-a0ff12a9-6 dKrXBP">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        d="M7.99996 2L9.74653 5.87769L14 6.32895L10.826 9.17675L11.7082 13.3333L7.99996 11.2157L4.29176 13.3333L5.17396 9.17675L1.99996 6.32895L6.2534 5.87769L7.99996 2Z"
                                        fill="#FFD52E"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.00001 1.33301L9.94064 5.67171L14.6667 6.17662L11.14 9.363L12.1202 14.0138L8.00001 11.6443L3.87978 14.0138L4.86001 9.363L1.33334 6.17662L6.05938 5.67171L8.00001 1.33301ZM8.00001 2.86252L6.48282 6.25453L2.78799 6.64927L5.54515 9.14039L4.77881 12.7764L8.00001 10.9239L11.2212 12.7764L10.4549 9.14039L13.212 6.64927L9.5172 6.25453L8.00001 2.86252Z"
                                        fill="#FFA142"
                                      />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="sc-a0ff12a9-17 gcEHAI">
                              <div>{review.reviewContent}</div>
                              {review.suggestion && (
                                <div className="wrapper-suggestion">
                                  <div className="wrapper-suggestion__item">{review.suggestion}</div>
                                </div>
                              )}
                            </div>
                            <div className="flex mt-12">
                              <div className="flex items-center">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="svg-icon"
                                >
                                  <g clipPath="url(#clip0_8914_24235)">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M9.75 3C9.41179 3 9.11542 3.22637 9.02643 3.55266L6.92715 11.25H3.75C3.33579 11.25 3 11.5858 3 12V20.25C3 20.6642 3.33579 21 3.75 21H16.8203C17.5364 20.9992 18.2286 20.7424 18.7718 20.2758C19.315 19.8093 19.6734 19.1637 19.7823 18.456L20.59 13.206C20.6558 12.7785 20.6283 12.3419 20.5095 11.926C20.3907 11.5101 20.1834 11.1249 19.9018 10.7966C19.6202 10.4683 19.2709 10.2049 18.8779 10.0242C18.4849 9.84356 18.0575 9.75002 17.625 9.75H12.75V6C12.75 5.20435 12.4339 4.44129 11.8713 3.87868C11.3087 3.31607 10.5456 3 9.75 3ZM6.75 19.5V12.75H4.5V19.5H6.75ZM8.25 12.1004L10.2949 4.60247C10.4865 4.67716 10.6625 4.79115 10.8107 4.93934C11.092 5.22064 11.25 5.60217 11.25 6V10.5C11.25 10.9142 11.5858 11.25 12 11.25H17.625C17.8412 11.25 18.0549 11.2968 18.2514 11.3871C18.4479 11.4774 18.6225 11.6092 18.7633 11.7733C18.9041 11.9374 19.0078 12.1301 19.0672 12.338C19.1266 12.5459 19.1403 12.7643 19.1075 12.978L18.2997 18.228C18.2453 18.5819 18.0661 18.9046 17.7945 19.1379C17.5229 19.3712 17.1768 19.4996 16.8187 19.5H8.25V12.1004Z"
                                      fill="#808089"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_8914_24235">
                                      <rect width="18" height="18" fill="white" transform="translate(3 3)" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                {review.likes > 0 && <div className="count">{review.likes}</div>}
                              </div>
                              <div className="flex items-center ml-20">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="svg-icon"
                                >
                                  <g clipPath="url(#clip0_8914_24240)">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M3 11.25C3 6.95165 7.15905 3.75 12 3.75C16.8409 3.75 21 6.95165 21 11.25C21 13.0141 20.2499 14.5969 19.0855 15.8642L19.4951 19.414C19.5254 19.6772 19.4147 19.9369 19.2037 20.0972C18.9927 20.2575 18.7128 20.2946 18.4674 20.1947L14.2797 18.4913C13.5273 18.6864 12.7812 18.75 12 18.75C7.15905 18.75 3 15.5483 3 11.25ZM12 5.25C7.69095 5.25 4.5 8.04835 4.5 11.25C4.5 14.4517 7.69095 17.25 12 17.25C12.7787 17.25 13.451 17.1792 14.1095 16.9816C14.2734 16.9325 14.4491 16.9408 14.6076 17.0053L17.8598 18.3282L17.5549 15.686C17.5287 15.4585 17.6078 15.2316 17.7697 15.0697C18.8609 13.9785 19.5 12.6602 19.5 11.25C19.5 8.04835 16.3091 5.25 12 5.25Z"
                                      fill="#808089"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_8914_24240">
                                      <rect width="18" height="18" fill="white" transform="translate(3 3)" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                {review.comments.length > 0 && (
                                  <div className="count">{review.comments.length}</div>
                                )}
                              </div>
                            </div>
                            <div className="sc-ec796e73-0 gcjILr reply-comment">
                              <div className="reply-comment__outer">
                                <div
                                  className="reply-comment__avatar"
                                  style={{ backgroundImage: "url('//tiki.vn/assets/img/avatar-s.png')" }}
                                >
                                  <Image
                                    src="https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png"
                                    alt=""
                                    width={24}
                                    height={24}
                                  />
                                </div>
                                <div className="reply-comment__wrapper">
                                  <div style={{ minHeight: '40px' }}>
                                    <textarea
                                      placeholder="Viết câu trả lời"
                                      className="sc-ec796e73-1 iYALpL reply-comment__input"
                                      rows={1}
                                      style={{ height: '40px' }}
                                    />
                                  </div>
                                  <Image
                                    src="https://salt.tikicdn.com/ts/upload/1e/49/2d/92f01c5a743f7c8c1c7433a0a7090191.png"
                                    alt="submit"
                                    className="reply-comment__submit"
                                    width={24}
                                    height={24}
                                    data-view-id="pdp_product_review_reply_submit"
                                  />
                                </div>
                              </div>
                            </div>
                            {review.comments.length > 0 && (
                              <div className="wrapper-list-comment">
                                {review.comments.map((comment, idx) => (
                                  <div key={idx} className="wrapper-list-comment__item">
                                    <div
                                      className="wrapper-list-comment__item__avatar"
                                      style={{ backgroundImage: "url('//tiki.vn/assets/img/avatar-s.png')" }}
                                    >
                                      <Image
                                        src={
                                          comment.sellerName === 'Lifestyles Official Store'
                                            ? 'https://vcdn.tikicdn.com/ts/seller/0a/f7/de/85274bf7f77240acdd9087e0b659a082.jpg'
                                            : 'https://vcdn.tikicdn.com/ts/seller/80/10/a9/b12177b4851ea288440113f7659da3a7.jpg'
                                        }
                                        alt=""
                                        width={24}
                                        height={24}
                                      />
                                    </div>
                                    <div className="wrapper-list-comment__item__info">
                                      <div className="wrapper-list-comment__item__info__name">
                                        {comment.sellerName}
                                      </div>
                                      <div className="wrapper-list-comment__item__info__content">
                                        {comment.content}
                                      </div>
                                      <div className="wrapper-list-comment__item__info__time-diff">
                                        {comment.time}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="svg-icon"
                            >
                              <g clipPath="url(#clip0_8914_24278)">
                                <path
                                  d="M10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12Z"
                                  fill="#808089"
                                />
                                <path
                                  d="M10.5 5.25C10.5 6.07843 11.1716 6.75 12 6.75C12.8284 6.75 13.5 6.07843 13.5 5.25C13.5 4.42157 12.8284 3.75 12 3.75C11.1716 3.75 10.5 4.42157 10.5 5.25Z"
                                  fill="#808089"
                                />
                                <path
                                  d="M10.5 18.75C10.5 19.5784 11.1716 20.25 12 20.25C12.8284 20.25 13.5 19.5784 13.5 18.75C13.5 17.9216 12.8284 17.25 12 17.25C11.1716 17.25 10.5 17.9216 10.5 18.75Z"
                                  fill="#808089"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_8914_24278">
                                  <rect
                                    width="18"
                                    height="18"
                                    fill="white"
                                    transform="translate(21 3) rotate(90)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sc-6da7ff97-0 ghxvuf">
                      <Image
                        src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                        alt="no reviews"
                        width={120}
                        height={120}
                      />
                      <p>Chưa có đánh giá</p>
                    </div>
                  )}
                  {reviewData.reviewed.length > 0 && tab === 'reviewed' && (
                    <div className="sc-2019c903-0 knTpwS">
                      <div className="sc-2019c903-4 eWLpWF">1-5 trong tổng 6</div>
                      <div className="flex items-center">
                        <div className="sc-2019c903-1 bQoDlf page-item">1</div>
                        <div className="sc-2019c903-1 bvpSQn page-item">2</div>
                        <Image
                          className="sc-2019c903-2 sc-2019c903-3 hezUBb hEpxVZ arrow"
                          src="https://salt.tikicdn.com/ts/brickv2og/ae/dd/ba/8733afa7e25db2e39f3e89c570382180.png"
                          alt="next-arrow"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}