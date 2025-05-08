'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import '@/styles/userProfileStyles.css';

// Định nghĩa kiểu dữ liệu cho ReturnItem
interface ReturnItem {
  id: string;
  status: string;
  product: string;
  reason: string;
  date: string;
  image: string;
  quantity: number;
  price: string;
}

export default function Returns() {
  const [activeTab, setActiveTab] = useState<string>('all'); // Mặc định tab "Tất cả" active
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleTabClick = (tab: string, index: number) => {
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
  const returnData: { [key: string]: ReturnItem[] } = {
    all: [
      {
        id: '1',
        status: 'Đang tiến hành',
        product: 'Lò Vi Sóng Sharp R-205VN(S) - 20L - Hàng chính hãng',
        reason: 'Sản phẩm lỗi kỹ thuật',
        date: '2025-05-01',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/4f/25/95/a569eb6c41f6fb2b1d42c5433441fb8b.jpg',
        quantity: 1,
        price: '1.320.000 ₫',
      },
      {
        id: '2',
        status: 'Đã xong',
        product: 'Làm Chủ Các Mẫu Thiết Kế Kinh Điển Trong Lập Trình',
        reason: 'Sản phẩm không đúng mô tả',
        date: '2025-04-15',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/93/94/4d/3097795c912091d56410d83e401cb182.jpg',
        quantity: 1,
        price: '171.000 ₫',
      },
      {
        id: '3',
        status: 'Đang tiến hành',
        product: 'Bao Cao Su Durex Jeans',
        reason: 'Sản phẩm hết hạn',
        date: '2025-05-03',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/fe/69/0e/530141a12e50b7f1419d1d1ed429b810.jpg',
        quantity: 2,
        price: '38.000 ₫',
      },
    ],
    inProgress: [
      {
        id: '1',
        status: 'Đang tiến hành',
        product: 'Lò Vi Sóng Sharp R-205VN(S) - 20L - Hàng chính hãng',
        reason: 'Sản phẩm lỗi kỹ thuật',
        date: '2025-05-01',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/4f/25/95/a569eb6c41f6fb2b1d42c5433441fb8b.jpg',
        quantity: 1,
        price: '1.320.000 ₫',
      },
      {
        id: '3',
        status: 'Đang tiến hành',
        product: 'Bao Cao Su Durex Jeans',
        reason: 'Sản phẩm hết hạn',
        date: '2025-05-03',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/fe/69/0e/530141a12e50b7f1419d1d1ed429b810.jpg',
        quantity: 2,
        price: '38.000 ₫',
      },
    ],
    completed: [
      {
        id: '2',
        status: 'Đã xong',
        product: 'Làm Chủ Các Mẫu Thiết Kế Kinh Điển Trong Lập Trình',
        reason: 'Sản phẩm không đúng mô tả',
        date: '2025-04-15',
        image: 'https://salt.tikicdn.com/cache/200x200/ts/product/93/94/4d/3097795c912091d56410d83e401cb182.jpg',
        quantity: 1,
        price: '171.000 ₫',
      },
    ],
  };

  // Map tab với index để điều khiển Swiper
  const tabIndexMap: { [key: string]: number } = {
    all: 0,
    inProgress: 1,
    completed: 2,
  };

  // Map index với tab để xác định tab hiện tại khi Swiper thay đổi
  const indexTabMap: { [key: number]: string } = {
    0: 'all',
    1: 'inProgress',
    2: 'completed',
  };

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-276ef7ec-0 ciA-DhB">
        <div className="heading">Quản lý đổi trả</div>
        <div className="sc-276ef7ec-1 kJDuxw">
          <div
            className={activeTab === 'all' ? 'sc-276ef7ec-2 dPxpxF' : 'sc-276ef7ec-2 eYjPfG'}
            onClick={() => handleTabClick('all', 0)}
          >
            Tất cả
          </div>
          <div
            className={activeTab === 'inProgress' ? 'sc-276ef7ec-2 dPxpxF' : 'sc-276ef7ec-2 eYjPfG'}
            onClick={() => handleTabClick('inProgress', 1)}
          >
            Đang tiến hành
          </div>
          <div
            className={activeTab === 'completed' ? 'sc-276ef7ec-2 dPxpxF' : 'sc-276ef7ec-2 eYjPfG'}
            onClick={() => handleTabClick('completed', 2)}
          >
            Đã xong
          </div>
        </div>
        <div>
          <Swiper
            initialSlide={tabIndexMap[activeTab]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveTab(indexTabMap[swiper.activeIndex])}
            spaceBetween={0}
            slidesPerView={1}
            speed={500}
            className="react-swipe-container carousel"
          >
            {Object.entries(returnData).map(([tab], index) => (
              <SwiperSlide key={tab} data-index={index}>
                <div
                  className="infinite-scroll-component"
                  style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 110px)' }}
                >
                  {returnData[tab].length > 0 ? (
                    returnData[tab].map((returnItem) => (
                      <div key={returnItem.id} className="sc-return-item">
                        <div
                          className={`sc-return-status ${
                            returnItem.status === 'Đã xong' ? 'completed' : 'in-progress'
                          }`}
                        >
                          <span className="status-text">{returnItem.status}</span>
                        </div>
                        <div className="sc-return-details">
                          <div className="detail">
                            <div
                              className="return-img"
                              style={{ backgroundImage: `url(${returnItem.image})` }}
                            >
                              <span className="quantity">x{returnItem.quantity}</span>
                            </div>
                            <div className="return-info">
                              <p className="return-product">{returnItem.product}</p>
                              <p className="return-reason">Lý do: {returnItem.reason}</p>
                              <p className="return-date">Ngày yêu cầu: {returnItem.date}</p>
                            </div>
                          </div>
                          <div className="price">
                            <span>{returnItem.price}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sc-6da7ff97-0 ghxvuf">
                      <Image
                        src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                        alt="no returns"
                        width={120}
                        height={120}
                      />
                      <p>Chưa có đơn hàng</p>
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