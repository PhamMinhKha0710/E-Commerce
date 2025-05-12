'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import '@/styles/userProfileStyles.css';
import Breadcrumb from '@/components/sections/Breadcrum';

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: 'Thông tin tài khoản',
      href: '/userProfile/account',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
        </svg>
      ),
    },
    {
      label: 'Thông báo của tôi',
      href: '/userProfile/notifications',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
        </svg>
      ),
    },
    {
      label: 'Quản lý đơn hàng',
      href: '/userProfile/orders',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"></path>
        </svg>
      ),
    },
    {
      label: 'Quản lý đổi trả',
      href: '/userProfile/returns',
      icon: <Image src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/order_return.svg" alt="order return" width={20} height={20} className="icon" />,
    },
    {
      label: 'Sổ địa chỉ',
      href: '/userProfile/address',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
        </svg>
      ),
    },
    {
      label: 'Đánh giá sản phẩm',
      href: '/userProfile/reviews',
      icon: <Image src="https://frontend.tikicdn.com/_desktop-next/static/img/account/reviewhub.png" alt="review hub" width={20} height={20} className="icon" />,
    },
    {
      label: 'Sản phẩm bạn đã xem',
      href: '/userProfile/viewed',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
        </svg>
      ),
    },
    {
      label: 'Sản phẩm yêu thích',
      href: '/userProfile/wishlist',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
      ),
    },
    {
      label: 'Nhận xét của tôi',
      href: '/userProfile/comments',
      icon: (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path>
        </svg>
      ),
    },
    {
      label: 'Mã giảm giá',
      href: '/userProfile/coupons',
      icon: <Image src="https://frontend.tikicdn.com/_desktop-next/static/img/mycoupon/coupon_code.svg" alt="coupon" width={20} height={20} className="icon" />,
    },
    {
      label: 'Hỗ trợ khách hàng',
      href: '/userProfile/support',
      icon: (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V15C22 16.9002 20.6751 18.4909 18.8986 18.8987C18.4908 20.6751 16.9002 22 15 22H11C10.4477 22 10 21.5523 10 21C10 20.4477 10.4477 20 11 20H15C15.8316 20 16.5447 19.4924 16.8463 18.7702C15.7621 18.3181 15 17.248 15 16V12C15 10.3431 16.3431 9 18 9H19C19.1463 9 19.2901 9.01047 19.4308 9.03071C18.2518 6.08262 15.3691 4 12 4C8.63091 4 5.74825 6.08262 4.56916 9.03071C4.70986 9.01047 4.85371 9 5 9H6C7.65685 9 9 10.3431 9 12V16C9 17.6569 7.65685 19 6 19C3.79086 19 2 17.2091 2 15V12Z"
            fill="#808089"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="container">
      <div className="container-fluid sc-6d96a9af-0 eTnNSC" style={{ marginBottom: '30px' }}>
        <div className="sc-33a27214-0 gOqQTE">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Hồ sơ', href: '/userProfile' },
              { label: sidebarItems.find(item => item.href === pathname)?.label || 'Hồ sơ', isActive: true },
            ]}
          />
        </div>
        <div className="row">
          <aside className="col-lg-3 col-md-4 col-sm-12 sc-33a27214-2 jIYTAs" style={{ backgroundColor: '#e7eef6' }}>
            <div className="sc-33a27214-3 bThJSs">
              <Image src="https://salt.tikicdn.com/desktop/img/avatar.png" alt="avatar" width={40} height={40} />
              <div>
                <p style={{ marginBottom: '0px' }}>Tài khoản của</p>
                <strong>Nguyễn Ngọc Tiệp</strong>
              </div>
            </div>
            <ul className="sc-33a27214-4 iXwMON">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={pathname === item.href ? 'is-active' : ''}>
                    {item.icon}
                    <div className="group-info">
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="col-lg-9 col-md-8 col-sm-12 sc-33a27214-1 fyHfjl">{children}</div>
        </div>
      </div>
    </main>
  );
}