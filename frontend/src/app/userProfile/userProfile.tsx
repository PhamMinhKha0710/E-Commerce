'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/userProfileStyles.css';

// Định nghĩa type cho formData
interface FormData {
  fullName: string;
  nickname: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  facebook: string;
  google: string;
  nationality: string;
}

export default function UserProfile() {
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Nguyễn Ngọc Tiếp',
    nickname: '',
    day: '',
    month: '',
    year: '',
    gender: 'male',
    phone: '0375623446',
    email: 'nguyenngoctieptn@gmail.com',
    password: '',
    facebook: '',
    google: '',
    nationality: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dữ liệu đã cập nhật:', formData);
  };

  // Danh sách quốc gia (dữ liệu mẫu)
  const nationalities = [
    { value: '', label: 'Chọn quốc tịch' },
    { value: 'vn', label: 'Việt Nam' },
    { value: 'us', label: 'Hoa Kỳ' },
    { value: 'jp', label: 'Nhật Bản' },
    { value: 'kr', label: 'Hàn Quốc' },
    { value: 'cn', label: 'Trung Quốc' },
    { value: 'fr', label: 'Pháp' },
    { value: 'de', label: 'Đức' },
    { value: 'uk', label: 'Anh' },
    { value: 'au', label: 'Úc' },
    { value: 'ca', label: 'Canada' },
  ];

  return (
    <main className="container">
      <div className="container-fluid sc-6d96a9af-0 eTnNSC" style={{ marginBottom: '30px' }}>
        {/* Breadcrumb */}
        <div className="sc-33a27214-0 gOqQTE">
          <div data-view-id="breadcrumb_container" className="sc-d53003fc-0 hKGNKY">
            <div className="sc-6d96a9af-0 eTnNSC">
              <div className="breadcrumb">
                <Link href="/" className="breadcrumb-item" data-view-id="breadcrumb_item" data-view-index="0">
                  <span>Trang chủ</span>
                </Link>
                <span className="icon icon-next">
                  <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#808089"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L6.35355 5.64645C6.54882 5.84171 6.54882 6.15829 6.35355 6.35355L1.35355 11.3536C1.15829 11.5488 0.841709 11.5488 0.646447 11.3536C0.451184 11.1583 0.451184 10.8417 0.646447 10.6464L5.29289 6L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z"
                    />
                  </svg>
                </span>
                <Link href="#" className="breadcrumb-item" data-view-id="breadcrumb_item" data-view-index="1">
                  <span title="Thông tin tài khoản">Thông tin tài khoản</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar và Main Content */}
          <div className="row">
            {/* Sidebar */}
            <aside className="col-lg-3 col-md-4 col-sm-12 sc-33a27214-2 jIYTAs" style={{ backgroundColor: '#e7eef6' }}>
              <div className="sc-33a27214-3 bThJSs">
                <Image src="https://salt.tikicdn.com/desktop/img/avatar.png" alt="avatar" width={40} height={40} />
                <div className="info">
                  Tài khoản của <strong>Nguyễn Ngọc Tiếp</strong>
                </div>
              </div>
              <ul className="sc-33a27214-4 iXwMON">
                <li>
                  <Link href="/customer/account/edit" className="is-active">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                    <span>Thông tin tài khoản</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/notification">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                    </svg>
                    <span>Thông báo của tôi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/sales/order/history">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"></path>
                    </svg>
                    <span>Quản lý đơn hàng</span>
                  </Link>
                </li>
                <li>
                  <Link href="/return-tracking/history">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/order_return.svg"
                      alt="order return"
                      width={20}
                      height={20}
                    />
                    <span>Quản lý đổi trả</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/address">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                    </svg>
                    <span>Sổ địa chỉ</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/paymentcard">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path>
                    </svg>
                    <span>Thông tin thanh toán</span>
                  </Link>
                </li>
                <li>
                  <Link href="/review-hub">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/account/reviewhub.png"
                      alt="review hub"
                      width={20}
                      height={20}
                    />
                    <span>Đánh giá sản phẩm</span>
                  </Link>
                </li>
                <li>
                  <Link href="/danh-rieng-cho-ban">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                    </svg>
                    <span>Sản phẩm bạn đã xem</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/wishlist">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    <span>Sản phẩm yêu thích</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/review">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
                    </svg>
                    <span>Nhận xét của tôi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chia-se-co-loi">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/share-to-earn/icon-s2e.svg"
                      alt="share to earn"
                      width={20}
                      height={20}
                    />
                    <span>Chia sẻ có lời</span>
                  </Link>
                </li>
                <li>
                  <Link href="/bao-hiem-so/hop-dong?source_screen=my_account">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/account/insurance.png"
                      alt="insurance icon"
                      width={20}
                      height={20}
                    />
                    <span>Hợp đồng bảo hiểm</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/coupons">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/mycoupon/coupon_code.svg"
                      alt="coupon code"
                      width={20}
                      height={20}
                    />
                    <span>Mã giảm giá</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/astra?checkout_flow=my_account">
                    <Image
                      src="https://salt.tikicdn.com/ts/upload/4b/4d/c3/05e31a32a296bd21da7d0403e6e2c87b.png"
                      className="icon"
                      alt="astra"
                      width={20}
                      height={20}
                    />
                    <div className="group-info">
                      <span>Astra của bạn</span>
                      <span>1,96 ASA</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/reward?checkout_flow=my_account">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.4502 1.04387C12.7301 0.179997 10.7547 -0.155053 8.8445 0.0662299C5.15543 0.450037 1.83253 3.08668 0.598636 6.58095C-0.25034 8.90254 -0.195333 11.5417 0.757405 13.8245C1.64114 15.9761 3.30758 17.7926 5.37158 18.8665C7.23943 19.8479 9.42581 20.208 11.5098 19.8842C13.3552 19.6116 15.1115 18.7965 16.5205 17.5776C18.1307 16.2011 19.2832 14.2983 19.7495 12.2305C20.256 10.0265 19.9897 7.65236 18.9932 5.62205C18.037 3.65176 16.4118 2.01652 14.4502 1.04387Z"
                        fill="#FDD835"
                      />
                      <path
                        opacity="0.5"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9817 1.98661C12.4427 1.21366 10.6753 0.913881 8.96611 1.11187C5.66537 1.45528 2.69225 3.81438 1.58823 6.94083C0.828624 9.01805 0.87784 11.3794 1.73029 13.4219C2.521 15.347 4.01203 16.9723 5.85876 17.9332C7.53 18.8113 9.48624 19.1334 11.3509 18.8437C13.002 18.5999 14.5734 17.8705 15.8341 16.7799C17.2748 15.5484 18.306 13.8459 18.7233 11.9957C19.1764 10.0237 18.9381 7.89946 18.0465 6.08287C17.191 4.31998 15.7368 2.85687 13.9817 1.98661Z"
                        stroke="#FFB500"
                        strokeWidth="0.685714"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.842 10C16.842 6.22059 13.7794 3.1579 9.99994 3.1579C6.22422 3.1579 3.15784 6.22059 3.15784 10C3.15784 13.7757 6.22422 16.8421 9.99994 16.8421C13.7794 16.8421 16.842 13.7757 16.842 10ZM15.7894 10.0082C15.7894 13.1987 13.2009 15.7895 9.99994 15.7895C6.80307 15.7895 4.21047 13.1987 4.21047 10.0082C4.21047 9.45737 4.29212 8.93105 4.43502 8.42105H15.5608C15.7078 8.93105 15.7894 9.45737 15.7894 10.0082Z"
                        fill="#FFB500"
                      />
                    </svg>
                    <span>Quản lý Tiki Xu của tôi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/bookcare">
                    <Image
                      className="icon"
                      src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/bookcare.svg"
                      alt="bookcare"
                      width={20}
                      height={20}
                    />
                    <span>BookCare của tôi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/customer/help-center?src=sidebar_my_account">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V15C22 16.9002 20.6751 18.4909 18.8986 18.8987C18.4908 20.6751 16.9002 22 15 22H11C10.4477 22 10 21.5523 10 21C10 20.4477 10.4477 20 11 20H15C15.8316 20 16.5447 19.4924 16.8463 18.7702C15.7621 18.3181 15 17.248 15 16V12C15 10.3431 16.3431 9 18 9H19C19.1463 9 19.2901 9.01047 19.4308 9.03071C18.2518 6.08262 15.3691 4 12 4C8.63091 4 5.74825 6.08262 4.56916 9.03071C4.70986 9.01047 4.85371 9 5 9H6C7.65685 9 9 10.3431 9 12V16C9 17.6569 7.65685 19 6 19C3.79086 19 2 17.2091 2 15V12Z"
                        fill="#808089"
                      />
                    </svg>
                    <span>Hỗ trợ khách hàng</span>
                  </Link>
                </li>
              </ul>
            </aside>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8 col-sm-12 sc-33a27214-1 fyHfjl">
              <div className="sc-4bd7d8aa-0 dlCdjY">Thông tin tài khoản</div>
              <div className="sc-4bd7d8aa-1 cMLWwS">
                <div className="info">
                  <div className="info-left">
                    <span className="info-title">Thông tin cá nhân</span>
                    <div className="sc-4bd7d8aa-2 jTcQvv">
                      <form onSubmit={handleSubmit}>
                        <div className="form-info">
                          <div className="form-avatar">
                            <div className="sc-a1f8c40a-0 jsHlDx">
                              <div>
                                <div className="avatar-view">
                                  <Image
                                    src="https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png"
                                    alt="avatar"
                                    className="default"
                                    width={60}
                                    height={60}
                                  />
                                  <div className="edit">
                                    <Image
                                      src="https://frontend.tikicdn.com/_desktop-next/static/img/account/edit.png"
                                      className="edit_img"
                                      alt=""
                                      width={12}
                                      height={12}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-name">
                            <div className="form-control">
                              <label className="input-label">Họ & Tên</label>
                              <div>
                                <div className="sc-4bd7d8aa-5 iIbKyr">
                                  <input
                                    className="input"
                                    type="search"
                                    name="fullName"
                                    maxLength={128}
                                    placeholder="Thêm họ tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-control">
                              <label className="input-label">Nickname</label>
                              <div>
                                <div className="sc-4bd7d8aa-5 iIbKyr">
                                  <input
                                    className="input"
                                    name="userName"
                                    maxLength={128}
                                    placeholder="Thêm nickname"
                                    type="search"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="input-label">Ngày sinh</label>
                          <div className="sc-25667054-0 liqeHy custom-dropdown">
                            <div className="dropdown-wrapper">
                              <select name="day" value={formData.day} onChange={handleChange}>
                                <option value="0">Ngày</option>
                                {[...Array(31)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                              <span className="dropdown-arrow">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.30806 6.43306C3.55214 6.18898 3.94786 6.18898 4.19194 6.43306L10 12.2411L15.8081 6.43306C16.0521 6.18898 16.4479 6.18898 16.6919 6.43306C16.936 6.67714 16.936 7.07286 16.6919 7.31694L10.4419 13.5669C10.1979 13.811 9.80214 13.811 9.55806 13.5669L3.30806 7.31694C3.06398 7.07286 3.06398 6.67714 3.30806 6.43306Z"
                                    fill="#808089"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="dropdown-wrapper">
                              <select name="month" value={formData.month} onChange={handleChange} >
                                <option value="0">Tháng</option>
                                {[...Array(12)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                              <span className="dropdown-arrow">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.30806 6.43306C3.55214 6.18898 3.94786 6.18898 4.19194 6.43306L10 12.2411L15.8081 6.43306C16.0521 6.18898 16.4479 6.18898 16.6919 6.43306C16.936 6.67714 16.936 7.07286 16.6919 7.31694L10.4419 13.5669C10.1979 13.811 9.80214 13.811 9.55806 13.5669L3.30806 7.31694C3.06398 7.07286 3.06398 6.67714 3.30806 6.43306Z"
                                    fill="#808089"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="dropdown-wrapper">
                              <select name="year" value={formData.year} onChange={handleChange} style={{ color: '#808089' }}>
                                <option value="0">Năm</option>
                                {[...Array(100)].map((_, i) => (
                                  <option key={i} value={2025 - i}>
                                    {2025 - i}
                                  </option>
                                ))}
                              </select>
                              <span className="dropdown-arrow">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.30806 6.43306C3.55214 6.18898 3.94786 6.18898 4.19194 6.43306L10 12.2411L15.8081 6.43306C16.0521 6.18898 16.4479 6.18898 16.6919 6.43306C16.936 6.67714 16.936 7.07286 16.6919 7.31694L10.4419 13.5669C10.1979 13.811 9.80214 13.811 9.55806 13.5669L3.30806 7.31694C3.06398 7.07286 3.06398 6.67714 3.30806 6.43306Z"
                                    fill="#808089"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="input-label">Giới tính</label>
                          <label className="sc-4606929f-0 gLFqiB">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === 'male'}
                              onChange={handleChange}
                            />
                            <span className="radio-fake"></span>
                            <span className="label">Nam</span>
                          </label>
                          <label className="sc-4606929f-0 gLFqiB">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === 'female'}
                              onChange={handleChange}
                            />
                            <span className="radio-fake"></span>
                            <span className="label">Nữ</span>
                          </label>
                          <label className="sc-4606929f-0 gLFqiB">
                            <input
                              type="radio"
                              name="gender"
                              value="other"
                              checked={formData.gender === 'other'}
                              onChange={handleChange}
                            />
                            <span className="radio-fake"></span>
                            <span className="label">Khác</span>
                          </label>
                        </div>
                        <div className="form-control">
                          <label className="input-label">Quốc tịch</label>
                          <div className="sc-4bd7d8aa-5 iIbKyr custom-dropdown">
                            <div className="dropdown-wrapper">
                              <select name="nationality" value={formData.nationality} onChange={handleChange}>
                                {nationalities.map((nation) => (
                                  <option key={nation.value} value={nation.value}>
                                    {nation.label}
                                  </option>
                                ))}
                              </select>
                              <span className="dropdown-arrow">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.30806 6.43306C3.55214 6.18898 3.94786 6.18898 4.19194 6.43306L10 12.2411L15.8081 6.43306C16.0521 6.18898 16.4479 6.18898 16.6919 6.43306C16.936 6.67714 16.936 7.07286 16.6919 7.31694L10.4419 13.5669C10.1979 13.811 9.80214 13.811 9.55806 13.5669L3.30806 7.31694C3.06398 7.07286 3.06398 6.67714 3.30806 6.43306Z"
                                    fill="#808089"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="input-label"> </label>
                          <button type="submit" className="sc-4bd7d8aa-3 dAcgvk btn-submit">
                            Lưu thay đổi
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="info-vertical"></div>
                  <div className="info-right">
                    <span className="info-title">Số điện thoại và Email</span>
                    <div className="sc-4bd7d8aa-4 gIgrOQ">
                      <div className="list-item">
                        <div className="info">
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/phone.png"
                            className="icon"
                            alt=""
                            width={20}
                            height={20}
                          />
                          <div className="detail">
                            <span>Số điện thoại</span>
                            <span>{formData.phone}</span>
                          </div>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active" style={{ whiteSpace: 'nowrap' }}>
                            <span>Cập nhật</span>
                          </button>
                        </div>
                      </div>
                      <div className="list-item">
                        <div className="info">
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/email.png"
                            className="icon"
                            alt=""
                            width={20}
                            height={20}
                          />
                          <div className="detail">
                            <span>Địa chỉ email</span>
                            <span>{formData.email}</span>
                          </div>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active" style={{ whiteSpace: 'nowrap' }}>
                            <span>Cập nhật</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="info-title">Bảo mật</span>
                    <div className="sc-4bd7d8aa-4 gIgrOQ">
                      <div className="list-item">
                        <div>
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/lock.png"
                            className="icon"
                            alt=""
                            width={25}
                            height={25}
                          />
                          <span style={{ marginLeft: '5px' }}>Đổi mật khẩu</span>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active" style={{ whiteSpace: 'nowrap' }}>
                            <span>Cập nhật</span>
                          </button>
                        </div>
                      </div>
                      <div className="list-item">
                        <div>
                          <Image
                            src="https://salt.tikicdn.com/ts/upload/99/50/d7/cc0504daa05199e1fb99cd9a89e60fa5.jpg"
                            className="icon iconleft"
                            alt=""
                            width={25}
                            height={25}
                          />
                          <span style={{ marginLeft: '5px' }}>Thiết lập mã PIN</span>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active">
                            <span>Thiết lập</span>
                          </button>
                        </div>
                      </div>
                      <div className="list-item">
                        <div>
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg"
                            className="icon iconleft"
                            alt=""
                            width={25}
                            height={25}
                          />
                          <span style={{ marginLeft: '5px' }}>Yêu cầu xóa tài khoản</span>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active">
                            <span>Yêu cầu</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="info-title">Liên kết mạng xã hội</span>
                    <div className="sc-4bd7d8aa-4 gIgrOQ">
                      <div className="list-item">
                        <div>
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/facebook.png"
                            className="icon"
                            alt=""
                            width={25}
                            height={25}
                          />
                          <span style={{ marginLeft: '5px' }}>Facebook</span>
                        </div>
                        <div className="status">
                          <span></span>
                          <button className="button active">
                            <span>Liên kết</span>
                          </button>
                        </div>
                      </div>
                      <div className="list-item">
                        <div>
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/account/google.png"
                            className="icon"
                            alt=""
                            width={25}
                            height={25}
                          />
                          <span style={{ marginLeft: '5px' }}>Google</span>
                        </div>
                        <div className="status is-danger">
                          <span></span>
                          <button className="button deactive">
                            <span>Đã liên kết</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}