'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/userProfileStyles.css';

export default function Wishlist() {
  return (
    <div className="sc-766fe77b-0 fDtdsV">
      <div className="heading">Danh sách yêu thích</div>
      <div className="inner">
        <div className="sc-7e66c78b-0 kfqtXb">
          <Image
            src="https://frontend.tikicdn.com/_desktop-next/static/img/mascot_fail.svg"
            alt="No wishlist items"
            width={100}
            height={100}
          />
          <p className="message">
            <span>
              Hãy{' '}
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                color="#ff3945"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'rgb(255, 57, 69)' }}
              >
                <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"></path>
              </svg>{' '}
              sản phẩm bạn yêu thích khi mua sắm để xem lại thuận tiện nhất
            </span>
          </p>
          <Link href="/" className="back">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}