'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import '@/styles/userProfileStyles.css';

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

export default function AccountInfo() {
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
    <div className="sc-4bd7d8aa-1 cMLWwS">
      <div className="info">
        <div className="info-left">
          <span className="info-title">Thông tin cá nhân</span>
          <div className="sc-4bd7d8aa-2 jTcQvv">
            <form onSubmit={handleSubmit}>
              <div className="form-info">
                <div className="form-avatar">
                  <div className="sc-a1f8c40a-0 jsHlDx">
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
                          alt="edit"
                          width={12}
                          height={12}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-name">
                  <div className="form-control">
                    <label className="input-label">Họ & Tên</label>
                    <div className="sc-4bd7d8aa-5 iIbKyr">
                      <input
                        className="input"
                        type="text"
                        name="fullName"
                        maxLength={128}
                        placeholder="Thêm họ tên"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="input-label">Nickname</label>
                    <div className="sc-4bd7d8aa-5 iIbKyr">
                      <input
                        className="input"
                        name="nickname"
                        maxLength={128}
                        placeholder="Thêm nickname"
                        type="text"
                        value={formData.nickname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Ngày sinh</label>
                <div className="sc-25667054-0 liqeHy custom-dropdown">
                  <div className="dropdown-wrapper">
                    <select name="day" value={formData.day} onChange={handleChange}>
                      <option value="">Ngày</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <select name="month" value={formData.month} onChange={handleChange}>
                      <option value="">Tháng</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <select name="year" value={formData.year} onChange={handleChange}>
                      <option value="">Năm</option>
                      {[...Array(100)].map((_, i) => (
                        <option key={i} value={2025 - i}>
                          {2025 - i}
                        </option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <label className="input-label"></label>
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
                  alt="phone"
                  width={20}
                  height={20}
                />
                <div className="detail">
                  <span>Số điện thoại</span>
                  <span>{formData.phone}</span>
                </div>
              </div>
              <div className="status">
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
                  alt="email"
                  width={20}
                  height={20}
                />
                <div className="detail">
                  <span>Địa chỉ email</span>
                  <span>{formData.email}</span>
                </div>
              </div>
              <div className="status">
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
                  alt="lock"
                  width={25}
                  height={25}
                />
                <span style={{ marginLeft: '5px' }}>Đổi mật khẩu</span>
              </div>
              <div className="status">
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
                  alt="pin"
                  width={25}
                  height={25}
                />
                <span style={{ marginLeft: '5px' }}>Thiết lập mã PIN</span>
              </div>
              <div className="status">
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
                  alt="trash"
                  width={25}
                  height={25}
                />
                <span style={{ marginLeft: '5px' }}>Yêu cầu xóa tài khoản</span>
              </div>
              <div className="status">
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
                  alt="facebook"
                  width={25}
                  height={25}
                />
                <span style={{ marginLeft: '5px' }}>Facebook</span>
              </div>
              <div className="status">
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
                  alt="google"
                  width={25}
                  height={25}
                />
                <span style={{ marginLeft: '5px' }}>Google</span>
              </div>
              <div className="status is-danger">
                <button className="button deactive">
                  <span>Đã liên kết</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}