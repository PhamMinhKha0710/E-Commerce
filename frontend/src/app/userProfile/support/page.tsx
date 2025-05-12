'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/userProfileStyles.css';

export default function Support() {
  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-fe76e2bf-0 ia-dWcS">
        <h2>Trung tâm hỗ trợ</h2>
        <div className="container">
          <h3>Chăm sóc khách hàng</h3>
          <div className="sc-c6bbd53-0 dvNnGh">
            <div className="sc-c6bbd53-1 dcEDod">
              <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 11 4 6.01V6h16zM4 18V8.99l8 5 8-5V18H4z"
                  fill="#0a68ff"
                />
              </svg>
              <p className="item-label">Hotline</p>
              <p className="item-action">1900-6035</p>
              <p className="item-description">1000 đ/phút, 8h-21h kể cả thứ 7, CN</p>
            </div>
            <div className="sc-c6bbd53-1 dcEDod">
              <Image
                src="https://salt.tikicdn.com/ts/ta/4e/cd/92/b3593adaf274fc49a6ace088ff96471b.png"
                width={40}
                height={43}
                alt="Assistant"
                style={{ borderRadius: '43px', border: '1px solid rgb(235, 235, 240)' }}
              />
              <p className="item-label">Gặp Trợ lý cá nhân</p>
              <button className="item-action">Chat ngay</button>
              <p className="item-description">8h-21h kể cả Thứ 7, CN</p>
            </div>
            <div className="sc-c6bbd53-1 dcEDod">
              <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#0a68ff"
                />
              </svg>
              <p className="item-label">Gửi yêu cầu hỗ trợ</p>
              <button className="item-action">Tạo đơn yêu cầu</button>
              <p className="item-description">Hoặc email đến hotro@tiki.vn</p>
            </div>
          </div>
          <h3 style={{ marginTop: '40px' }}>Tra cứu thông tin</h3>
          <div className="sc-394ade6c-0 jZVhjg">
            <div className="sc-394ade6c-1 jxdiBl">
              <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"
                  fill="#808089"
                />
              </svg>
              <h5 className="section-title">Đơn hàng và thanh toán</h5>
              <p className="section-description">
                Cách tra cứu đơn hàng, sử dụng mã giảm giá và các phương thức thanh toán...
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPGWA3/%C4%91%E1%BA%B7t-h%C3%A0ng-v%C3%A0-thanh-to%C3%A1n"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="sc-394ade6c-1 jxdiBl">
              <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="#808089"
                />
              </svg>
              <h5 className="section-title">Tài khoản của tôi</h5>
              <p className="section-description">
                Cách đăng ký tài khoản tại Tiki, chỉnh sửa thông tin cá nhân, theo dõi đơn hàng...
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPKWA3/t%C3%A0i-kho%E1%BA%A3n-c%E1%BB%A7a-t%C3%B4i"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="sc-394ade6c-1 jxdiBl">
                <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path
                        d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
                        fill="#808089"
                    />
                </svg>
              <h5 className="section-title">Đơn hàng và vận chuyển</h5>
              <p className="section-description">
                Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi trả online ...
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPJWA3/giao-nh%E1%BA%ADn-h%C3%A0ng"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="sc-394ade6c-1 jxdiBl">
            <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM144 221.3c0-33.8 27.4-61.3 61.3-61.3c16.2 0 31.8 6.5 43.3 17.9l7.4 7.4 7.4-7.4c11.5-11.5 27.1-17.9 43.3-17.9c33.8 0 61.3 27.4 61.3 61.3c0 16.2-6.5 31.8-17.9 43.3l-82.7 82.7c-6.2 6.2-16.4 6.2-22.6 0l-82.7-82.7c-11.5-11.5-17.9-27.1-17.9-43.3z"
                    fill="#808089"
                />
            </svg>
              <h5 className="section-title">Đổi trả, bảo hành và hồi hoàn</h5>
              <p className="section-description">
                Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi trả online ...
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPIWA3/%C4%91%E1%BB%95i-tr%E1%BA%A3-b%E1%BA%A3o-h%C3%A0nh-v%C3%A0-b%E1%BB%93i-ho%C3%A0n"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="sc-394ade6c-1 jxdiBl">
            <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z"
                    fill="#808089"
                />
            </svg>
              <h5 className="section-title">Dịch vụ và chương trình</h5>
              <p className="section-description">
                Chính sách của các dịch vụ và chương trình dành cho khách hàng Tiki
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPHWA3/d%E1%BB%8Bch-v%E1%BB%A5-v%C3%A0-ch%C6%B0%C6%A1ng-tr%C3%ACnh"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="sc-394ade6c-1 jxdiBl">
            <svg className="svg-important" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                    fill="#808089"
                />
            </svg>
              <h5 className="section-title">Thông tin về Tiki</h5>
              <p className="section-description">
                Quy chế hoạt động và chính sách của sàn thương mại điện tử Tiki
              </p>
              <Link
                href="https://hotro.tiki.vn/s/topic/0TO5Y00000BiIPLWA3/th%C3%B4ng-tin-v%E1%BB%81-tiki"
                target="_blank"
                className="section-cta"
              >
                Xem chi tiết
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" stroke="#0a68ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}