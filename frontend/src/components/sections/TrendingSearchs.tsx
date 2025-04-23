// src/app/components/TrendingSearches.tsx
import React from 'react';
import Link from 'next/link';

const TrendingSearches = () => {
  return (
    <div className="key-search">
      <div className="title-key">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 14C11.0899 14 14 11.0899 14 7.5C14 3.91015 11.0899 1 7.5 1C3.91015 1 1 3.91015 1 7.5C1 11.0899 3.91015 14 7.5 14Z" stroke="#2B2F33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 19L12.5 12.5" stroke="#2B2F33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Xu hướng tìm kiếm
      </div>
      <ul>
        <li><Link href="search3e7c.html?q=tags:(Khỏe+đẹp)&type=product">Khỏe đẹp</Link></li>
        <li><Link href="searchfaff.html?q=tags:(Nhà+cửa)&type=product">Nhà cửa</Link></li>
        <li><Link href="search8fdf.html?q=tags:(Sách)&type=product">Sách</Link></li>
        <li><Link href="searchb056.html?q=tags:(Bách+hóa)&type=product">Bách hóa</Link></li>
        <li><Link href="searchf36d.html?q=tags:(Hải+sản)&type=product">Hải sản</Link></li>
        <li><Link href="search6359.html?q=tags:(Điện+thoại)&type=product">Điện thoại</Link></li>
        <li><Link href="search19a0.html?q=tags:(Laptop)&type=product">Laptop</Link></li>
      </ul>
    </div>
  );
};

export default TrendingSearches;