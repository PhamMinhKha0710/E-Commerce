'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import '@/styles/userProfileStyles.css';

// Định nghĩa kiểu dữ liệu
interface Product {
  name: string;
  store: string;
  quantity: number;
  price: string;
  image: string;
  gift?: boolean;
}

interface Order {
  status: string;
  products: Product[];
  total: string;
}

type OrderData = {
  [key: string]: Order[];
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState<string>('delivered'); // Mặc định tab "Đã giao" active
  const [searchQuery, setSearchQuery] = useState<string>('');
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleTabClick = (tab: string, index: number) => {
    setActiveTab(tab);
  };

  const handleSearch = () => {
    console.log('Tìm kiếm:', searchQuery);
    // Thêm logic tìm kiếm đơn hàng
  };

  // Đồng bộ Swiper với activeTab
  useEffect(() => {
    const index = tabIndexMap[activeTab];
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, [activeTab]);

  // Dữ liệu mẫu cho các tab
  const orderData: OrderData = {
    all: [
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Lò Vi Sóng Sharp R-205VN(S) - 20L - Hàng chính hãng',
            store: 'Tiki Trading',
            quantity: 1,
            price: '1.320.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/4f/25/95/a569eb6c41f6fb2b1d42c5433441fb8b.jpg',
          },
          {
            name: 'Ấm Đun Siêu Tốc Inox 2 Lớp Sunhouse SHD1351 (1.8 Lít) - Hàng Chính Hãng',
            store: 'Tiki Trading',
            quantity: 1,
            price: '239.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/ba/d0/1b/21d2aea0f397e053c2571a90252cff98.jpg',
          },
        ],
        total: '1.578.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Làm Chủ Các Mẫu Thiết Kế Kinh Điển Trong Lập Trình (Mastering Design Patterns)',
            store: 'Tiki Trading',
            quantity: 1,
            price: '171.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/93/94/4d/3097795c912091d56410d83e401cb182.jpg',
          },
        ],
        total: '171.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Ghế xoay văn phòng C010',
            store: 'okmua com vn',
            quantity: 1,
            price: '450.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/6b/45/49/5b01abaa98b011c27291f583a8697b1f.jpg',
          },
        ],
        total: '450.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Bao Cao Su Durex Jeans',
            store: 'Gian hàng Durex chính hãng',
            quantity: 2,
            price: '38.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/fe/69/0e/530141a12e50b7f1419d1d1ed429b810.jpg',
          },
          {
            name: 'Gel bôi trơn OZO Lubricant Performa Cool mát lạnh, gấp đôi độ trơn - Lọ 250ml',
            store: 'OZOVN STORE',
            quantity: 1,
            price: '79.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/ed/b4/1e/26e5702bd119c27c56ccb87d154a6588.jpg',
          },
        ],
        total: '224.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Mặt nạ dưỡng da Truesky tích hợp tế bào gốc giúp làm sáng da, dưỡng ẩm và ngăn ngừa lão hoá - Integrated Mask',
            store: 'Truesky Official Store',
            quantity: 12,
            price: '9.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/30/4c/6e/5c09042a2f6fd6b2dde09040101e0df8.jpg',
          },
        ],
        total: '141.536 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Khăn tắm tẩy tế bào chết cho da',
            store: 'Athayroi39',
            quantity: 1,
            price: '23.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/65/c2/e6/a1b81f959a77745b7ff1b521c8003e88.jpg',
          },
        ],
        total: '38.500 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Sữa Dưỡng Cấp Ẩm Chuyên Sâu Senka Deep Moist Emulsion 150ML',
            store: 'Senka Official Store',
            quantity: 1,
            price: '145.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/67/4b/d5/3295578e67dc93d4d5dfe4fc09685f6b.jpg',
          },
          {
            name: '[GIFT] Gel rửa mặt dịu nhẹ Senka Perfect Gel Gentle Wash 100g',
            store: 'Senka Official Store',
            quantity: 1,
            price: '0 ₫',
            gift: true,
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/a4/0a/ca/4462a3e4ad5a40ec2f1e5376f258f715.png',
          },
        ],
        total: '318.864 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Dung Dịch Vệ Sinh Chuyên Biệt Cho Nam Giới Oriss 100g',
            store: 'Lifestyles Official Store',
            quantity: 1,
            price: '120.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/d8/6e/a6/b06a8bfeface1a07d9b58dfceefd987e.jpg',
          },
        ],
        total: '136.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Cuộn 5MÉT Decal giấy dán bếp tráng nhôm cách nhiệt khổ 60cm MẪU Ô HÌNH XANH',
            store: 'trangtridep',
            quantity: 1,
            price: '135.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/eb/7a/66/7dd0c2e3e48c8af418ff4653c978adea.jpg',
          },
        ],
        total: '157.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Keo xịt PJ77 - Keo dán tường siêu chắc siêu dính chống ẩm mốc giá rẻ - Keo dán dạng xịt',
            store: 'Huong Decor',
            quantity: 1,
            price: '70.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/22/04/d0/1d3aee3b99f1fd3b58c4e8510c900b14.jpg',
          },
        ],
        total: '114.000 ₫',
      },
    ],
    pending: [], // Tab "Chờ thanh toán" rỗng
    processing: [], // Tab "Đang xử lý" rỗng
    shipping: [], // Tab "Đang vận chuyển" rỗng
    delivered: [
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Làm Chủ Các Mẫu Thiết Kế Kinh Điển Trong Lập Trình (Mastering Design Patterns)',
            store: 'Tiki Trading',
            quantity: 1,
            price: '171.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/93/94/4d/3097795c912091d56410d83e401cb182.jpg',
          },
        ],
        total: '171.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Bao Cao Su Durex Jeans',
            store: 'Gian hàng Durex chính hãng',
            quantity: 2,
            price: '38.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/fe/69/0e/530141a12e50b7f1419d1d1ed429b810.jpg',
          },
          {
            name: 'Gel bôi trơn OZO Lubricant Performa Cool mát lạnh, gấp đôi độ trơn - Lọ 250ml',
            store: 'OZOVN STORE',
            quantity: 1,
            price: '79.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/ed/b4/1e/26e5702bd119c27c56ccb87d154a6588.jpg',
          },
        ],
        total: '224.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Mặt nạ dưỡng da Truesky tích hợp tế bào gốc giúp làm sáng da, dưỡng ẩm và ngăn ngừa lão hoá - Integrated Mask',
            store: 'Truesky Official Store',
            quantity: 12,
            price: '9.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/30/4c/6e/5c09042a2f6fd6b2dde09040101e0df8.jpg',
          },
        ],
        total: '141.536 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Khăn tắm tẩy tế bào chết cho da',
            store: 'Athayroi39',
            quantity: 1,
            price: '23.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/65/c2/e6/a1b81f959a77745b7ff1b521c8003e88.jpg',
          },
        ],
        total: '38.500 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Sữa Dưỡng Cấp Ẩm Chuyên Sâu Senka Deep Moist Emulsion 150ML',
            store: 'Senka Official Store',
            quantity: 1,
            price: '145.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/67/4b/d5/3295578e67dc93d4d5dfe4fc09685f6b.jpg',
          },
          {
            name: '[GIFT] Gel rửa mặt dịu nhẹ Senka Perfect Gel Gentle Wash 100g',
            store: 'Senka Official Store',
            quantity: 1,
            price: '0 ₫',
            gift: true,
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/a4/0a/ca/4462a3e4ad5a40ec2f1e5376f258f715.png',
          },
        ],
        total: '318.864 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Dung Dịch Vệ Sinh Chuyên Biệt Cho Nam Giới Oriss 100g',
            store: 'Lifestyles Official Store',
            quantity: 1,
            price: '120.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/d8/6e/a6/b06a8bfeface1a07d9b58dfceefd987e.jpg',
          },
        ],
        total: '136.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Cuộn 5MÉT Decal giấy dán bếp tráng nhôm cách nhiệt khổ 60cm MẪU Ô HÌNH XANH',
            store: 'trangtridep',
            quantity: 1,
            price: '135.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/eb/7a/66/7dd0c2e3e48c8af418ff4653c978adea.jpg',
          },
        ],
        total: '157.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Nồi Chiên Không Dầu Comet CM6858 4.2L - Hàng Chính Hãng',
            store: 'Comet HomeAppliances Official Store',
            quantity: 1,
            price: '1.899.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/0b/69/15/650ca01cb0e026b18eb2eda3d8f5419b.jpg',
          },
        ],
        total: '1.899.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: '[CHÍNH HÃNG] SIÊU DƯỠNG THÂM 5S BIHO LADI - ĐÁNH BAY MỌI VẾT THÂM NÁCH, BẸN, THÂM MÔNG, BIKINI, BỤNG, ĐẦU GỐI, CÙI CHỎ',
            store: 'BÉ KHỎE VÀ MẸ XINH',
            quantity: 1,
            price: '269.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/43/c6/dc/74493453416711279ead9e328d2c83f1.jpg',
          },
        ],
        total: '289.000 ₫',
      },
      {
        status: 'Giao hàng thành công',
        products: [
          {
            name: 'Khay cát vệ sinh thành cao cho mèo size lớn - giao màu ngẫu nhiên',
            store: 'SALU PET',
            quantity: 1,
            price: '209.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/75/25/25/7864b01cdb7ee9bfc978d48062ea3587.png',
          },
        ],
        total: '223.000 ₫',
      },
    ],
    canceled: [
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Lò Vi Sóng Sharp R-205VN(S) - 20L - Hàng chính hãng',
            store: 'Tiki Trading',
            quantity: 1,
            price: '1.320.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/4f/25/95/a569eb6c41f6fb2b1d42c5433441fb8b.jpg',
          },
          {
            name: 'Ấm Đun Siêu Tốc Inox 2 Lớp Sunhouse SHD1351 (1.8 Lít) - Hàng Chính Hãng',
            store: 'Tiki Trading',
            quantity: 1,
            price: '239.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/ba/d0/1b/21d2aea0f397e053c2571a90252cff98.jpg',
          },
        ],
        total: '1.578.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Ghế xoay văn phòng C010',
            store: 'okmua com vn',
            quantity: 1,
            price: '450.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/6b/45/49/5b01abaa98b011c27291f583a8697b1f.jpg',
          },
        ],
        total: '450.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Keo xịt PJ77 - Keo dán tường siêu chắc siêu dính chống ẩm mốc giá rẻ - Keo dán dạng xịt',
            store: 'Huong Decor',
            quantity: 1,
            price: '70.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/22/04/d0/1d3aee3b99f1fd3b58c4e8510c900b14.jpg',
          },
        ],
        total: '114.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Keo xịt PJ77 - Keo dán tường siêu chắc siêu dính chống ẩm mốc giá rẻ - Keo dán dạng xịt',
            store: 'Huong Decor',
            quantity: 1,
            price: '70.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/22/04/d0/1d3aee3b99f1fd3b58c4e8510c900b14.jpg',
          },
        ],
        total: '105.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Cuộn 5MÉT Decal giấy dán bếp tráng nhôm cách nhiệt khổ 60cm MẪU Ô HÌNH XANH',
            store: 'trangtridep',
            quantity: 1,
            price: '135.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/eb/7a/66/7dd0c2e3e48c8af418ff4653c978adea.jpg',
          },
        ],
        total: '149.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Cuộn 5MÉT Decal giấy dán bếp tráng nhôm cách nhiệt khổ 60cm MẪU Ô HÌNH XANH',
            store: 'trangtridep',
            quantity: 1,
            price: '135.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/eb/7a/66/7dd0c2e3e48c8af418ff4653c978adea.jpg',
          },
          {
            name: 'Keo xịt PJ77 - Keo dán tường siêu chắc siêu dính chống ẩm mốc giá rẻ - Keo dán dạng xịt',
            store: 'Huong Decor',
            quantity: 1,
            price: '70.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/22/04/d0/1d3aee3b99f1fd3b58c4e8510c900b14.jpg',
          },
        ],
        total: '254.000 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Cuộn 2m giấy nhôm chống dầu mỡ, trang trí nhà bếp 40x200cm 8414',
            store: 'Thọ Lê Shop',
            quantity: 2,
            price: '36.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/a4/1b/98/27e7b2a24ed68bdc290feb8e0671f03f.jpg',
          },
        ],
        total: '80.930 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Keo xịt PJ77 - Keo dán tường siêu chắc siêu dính chống ẩm mốc giá rẻ - Keo dán dạng xịt',
            store: 'Huong Decor',
            quantity: 1,
            price: '70.000 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/22/04/d0/1d3aee3b99f1fd3b58c4e8510c900b14.jpg',
          },
        ],
        total: '100.070 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Thảm tập yoga DOPI cao cấp siêu bám DP3500 tặng kèm túi và dây - Hồng',
            store: 'SPORT79',
            quantity: 1,
            price: '288.888 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/60/00/67/ddc6795c10d50b0d468a7fc1bee9dc34.jpg',
          },
        ],
        total: '323.888 ₫',
      },
      {
        status: 'Đã hủy',
        products: [
          {
            name: 'Gel Bôi Trơn Durex Play Classic (50ml) - 100940526',
            store: 'Tiki Trading',
            quantity: 1,
            price: '68.900 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/76/f6/f9/6a0bc52e1c67cd46cdf7e22af05f2e98.jpg',
          },
          {
            name: 'Bao Cao Su Siêu Mỏng Durex Invisible Hộp 10s + Hộp 3s',
            store: 'Tiki Trading',
            quantity: 1,
            price: '239.700 ₫',
            image: 'https://salt.tikicdn.com/cache/200x200/ts/product/2f/55/17/bf4943cceebd30ffe55a26c5e48a2ff4.jpg',
          },
        ],
        total: '323.600 ₫',
      },
    ],
  };

  // Map tab với index để điều khiển Swiper
  const tabIndexMap: { [key: string]: number } = {
    all: 0,
    pending: 1,
    processing: 2,
    shipping: 3,
    delivered: 4,
    canceled: 5,
  };

  // Map index với tab để xác định tab hiện tại khi Swiper thay đổi
  const indexTabMap: { [key: number]: string } = {
    0: 'all',
    1: 'pending',
    2: 'processing',
    3: 'shipping',
    4: 'delivered',
    5: 'canceled',
  };

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-b446ca32-0 jdhSOb">
        <div className="heading">Đơn hàng của tôi</div>
        <div className="sc-b446ca32-2 iEyIQx">
          <div
            className={activeTab === 'all' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('all', 0)}
          >
            Tất cả đơn
          </div>
          <div
            className={activeTab === 'pending' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('pending', 1)}
          >
            Chờ thanh toán
          </div>
          <div
            className={activeTab === 'processing' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('processing', 2)}
          >
            Đang xử lý
          </div>
          <div
            className={activeTab === 'shipping' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('shipping', 3)}
          >
            Đang vận chuyển
          </div>
          <div
            className={activeTab === 'delivered' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('delivered', 4)}
          >
            Đã giao
          </div>
          <div
            className={activeTab === 'canceled' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('canceled', 5)}
          >
            Đã huỷ
          </div>
        </div>
        <div className="sc-b446ca32-4 dFJnoA">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            color="#808089"
            className="icon-left"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgb(128, 128, 137)' }}
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <input
            name="search"
            placeholder="Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm"
            type="search"
            className="input with-icon-left"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-right" onClick={handleSearch}>
            Tìm đơn hàng
          </div>
        </div>
        <Swiper
          initialSlide={tabIndexMap[activeTab]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveTab(indexTabMap[swiper.activeIndex])}
          spaceBetween={0}
          slidesPerView={1}
          speed={500} // Tốc độ chuyển slide (500ms)
          className="react-swipe-container carousel"
        >
          {Object.keys(orderData).map((tab, index) => (
            <SwiperSlide key={index} data-index={index}>
              <div
                className="infinite-scroll-component"
                style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 110px)' }}
              >
                {orderData[tab].length > 0 ? (
                  orderData[tab].map((order: Order, index: number) => (
                    <div key={index} className="sc-c1c610ab-0 gkrEzS">
                      <div
                        color="#808089"
                        className={`sc-c1c610ab-1 ${order.status === 'Đã hủy' ? 'bYXZFb' : 'kLVWAV'}`}
                      >
                        <span className="main-status">{order.status}</span>
                      </div>
                      <div className="sc-f5c558e2-0 mQs">
                        <div>
                          {order.products.map((product: Product, prodIndex: number) => (
                            <div key={prodIndex} className="product">
                              <div className="detail">
                                <div
                                  className="product-img"
                                  style={{ backgroundImage: `url(${product.image})` }}
                                >
                                  <span className="quantity">x{product.quantity}</span>
                                </div>
                                <div className="product-info">
                                  <p className="product-name">
                                    {product.gift && <span className="bundle gift">Quà tặng</span>}
                                    {product.name}
                                  </p>
                                  <div className="store">
                                    <span>{product.store}</span>
                                  </div>
                                  <div className="sc-fa8534d-0 bvmEgD"></div>
                                </div>
                              </div>
                              <div className="price">
                                <span>{product.price}</span>
                              </div>
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <div className="btn-more">
                              <p>Xem thêm {order.products.length - 2} sản phẩm</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="sc-c1c610ab-2 bbruGD">
                        <div className="total-money">
                          <div className="title">Tổng tiền:</div>
                          <div className="total">{order.total}</div>
                        </div>
                        <div className="button-group">
                          <div>Mua lại</div>
                          <div>Xem chi tiết</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sc-6da7ff97-0 ghxvuf">
                    <Image
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
                      alt="no orders"
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
  );
}