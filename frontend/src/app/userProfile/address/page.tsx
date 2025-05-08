'use client';

import Link from 'next/link';
import Image from 'next/image';
import '@/styles/userProfileStyles.css';

// Định nghĩa kiểu dữ liệu cho AddressItem
interface AddressItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export default function Address() {
  // Dữ liệu giả cho danh sách địa chỉ
  const addresses: AddressItem[] = [
    {
      id: '22840504',
      name: 'Đoàn Thanh Như Ngọc',
      address: 'ấp 2, Xã Qưới Sơn, Huyện Châu Thành, Bến Tre',
      phone: '0932814812',
      isDefault: true,
    },
    {
      id: '16724247',
      name: 'Nguyễn Ngọc Tiệp',
      address: 'nhà trọ số 4 hẻm 17 đường 28, Phường Linh Đông, Thành phố Thủ Đức, Hồ Chí Minh',
      phone: '0375623446',
      isDefault: false,
    },
    {
      id: '21393893',
      name: 'Nguyễn Ngọc Tiệp',
      address: 'thôn Eaklang, Xã Ea Sin, Huyện Krông Búk, Đắk Lắk',
      phone: '0325476238',
      isDefault: false,
    },
  ];

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-3c008a3f-0 gCmlYJ">
        <div className="heading">Sổ địa chỉ</div>
        <div className="inner">
          <div className="new">
            <Link href="/userProfile/address/create">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              <span>Thêm địa chỉ mới</span>
            </Link>
          </div>
          {addresses.map((address) => (
            <div key={address.id} className="item">
              <div className="info">
                <div className="name">
                  {address.name}
                  {address.isDefault && (
                    <span>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                      </svg>
                      <span>Địa chỉ mặc định</span>
                    </span>
                  )}
                </div>
                <div className="address">
                  <span>Địa chỉ: </span>
                  {address.address}
                </div>
                <div className="phone">
                  <span>Điện thoại: </span>
                  {address.phone}
                </div>
              </div>
              <div className="action">
                <Link className="edit" href={`/userProfile/address/edit/${address.id}`}>
                  Chỉnh sửa
                </Link>
                {!address.isDefault && <button className="delete">Xóa</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}