'use client';

import { useState } from 'react';
import '@/styles/userProfileStyles.css';

export default function CreateAddress() {
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Ngọc Tiệp',
    company: '',
    telephone: '',
    region: '',
    district: '',
    ward: '',
    street: '',
    deliveryAddressType: '',
    isDefault: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mô phỏng gửi form (không có backend)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-29d1cb0-0 jtOJlT">
        <div className="heading">Tạo sổ địa chỉ</div>
        <div className="inner">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="fullName" className="input-label">
                Họ và tên:
              </label>
              <div>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  maxLength={50}
                  className="sc-e0d759ef-0 bNwWMM"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="company" className="input-label">
                Công ty:
              </label>
              <input
                type="text"
                name="company"
                placeholder="Nhập công ty"
                className="sc-e0d759ef-0 bNwWMM"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="telephone" className="input-label">
                Số điện thoại:
              </label>
              <div>
                <input
                  type="text"
                  required
                  name="telephone"
                  placeholder="Nhập số điện thoại"
                  className="sc-e0d759ef-0 bNwWMM"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="region" className="input-label">
                Tỉnh/Thành phố:
              </label>
              <select
                name="region"
                required
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="294">Hồ Chí Minh</option>
                <option value="297">Hà Nội</option>
                <option value="291">Đà Nẵng</option>
                <option value="278">An Giang</option>
                <option value="280">Bà Rịa - Vũng Tàu</option>
                <option value="282">Bắc Giang</option>
                <option value="281">Bắc Kạn</option>
                <option value="279">Bạc Liêu</option>
                <option value="283">Bắc Ninh</option>
                <option value="284">Bến Tre</option>
                <option value="285">Bình Dương</option>
                <option value="286">Bình Phước</option>
                <option value="287">Bình Thuận</option>
                <option value="316">Bình Định</option>
                <option value="289">Cà Mau</option>
                <option value="290">Cần Thơ</option>
                <option value="288">Cao Bằng</option>
                <option value="293">Gia Lai</option>
                <option value="295">Hà Giang</option>
                <option value="296">Hà Nam</option>
                <option value="299">Hà Tĩnh</option>
                <option value="300">Hải Dương</option>
                <option value="301">Hải Phòng</option>
                <option value="319">Hậu Giang</option>
                <option value="302">Hoà Bình</option>
                <option value="320">Hưng Yên</option>
                <option value="321">Khánh Hòa</option>
                <option value="322">Kiên Giang</option>
                <option value="323">Kon Tum</option>
                <option value="304">Lai Châu</option>
                <option value="306">Lâm Đồng</option>
                <option value="305">Lạng Sơn</option>
                <option value="324">Lào Cai</option>
                <option value="325">Long An</option>
                <option value="326">Nam Định</option>
                <option value="327">Nghệ An</option>
                <option value="307">Ninh Bình</option>
                <option value="328">Ninh Thuận</option>
                <option value="329">Phú Thọ</option>
                <option value="308">Phú Yên</option>
                <option value="309">Quảng Bình</option>
                <option value="310">Quảng Nam</option>
                <option value="311">Quảng Ngãi</option>
                <option value="330">Quảng Ninh</option>
                <option value="312">Quảng Trị</option>
                <option value="313">Sóc Trăng</option>
                <option value="331">Sơn La</option>
                <option value="332">Tây Ninh</option>
                <option value="333">Thái Bình</option>
                <option value="334">Thái Nguyên</option>
                <option value="335">Thanh Hóa</option>
                <option value="303">Thừa Thiên Huế</option>
                <option value="336">Tiền Giang</option>
                <option value="314">Trà Vinh</option>
                <option value="315">Tuyên Quang</option>
                <option value="337">Vĩnh Long</option>
                <option value="338">Vĩnh Phúc</option>
                <option value="339">Yên Bái</option>
                <option value="292">Đắk Lắk</option>
                <option value="340">Đắk Nông</option>
                <option value="341">Điện Biên</option>
                <option value="317">Đồng Nai</option>
                <option value="318">Đồng Tháp</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="district" className="input-label">
                Quận huyện:
              </label>
              <select
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
              >
                <option value="">Chọn Quận/Huyện</option>
                <option value="484">Quận 1</option>
                <option value="486">Quận 3</option>
                <option value="487">Quận 4</option>
                <option value="488">Quận 5</option>
                <option value="489">Quận 6</option>
                <option value="490">Quận 7</option>
                <option value="491">Quận 8</option>
                <option value="493">Quận 10</option>
                <option value="494">Quận 11</option>
                <option value="495">Quận 12</option>
                <option value="496">Quận Bình Tân</option>
                <option value="497">Quận Bình Thạnh</option>
                <option value="498">Quận Gò Vấp</option>
                <option value="499">Quận Phú Nhuận</option>
                <option value="500">Quận Tân Bình</option>
                <option value="501">Quận Tân Phú</option>
                <option value="502">Thành phố Thủ Đức</option>
                <option value="503">Huyện Bình Chánh</option>
                <option value="504">Huyện Cần Giờ</option>
                <option value="505">Huyện Củ Chi</option>
                <option value="506">Huyện Hóc Môn</option>
                <option value="507">Huyện Nhà Bè</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="ward" className="input-label">
                Phường xã:
              </label>
              <select
                name="ward"
                required
                value={formData.ward}
                onChange={handleChange}
              >
                <option value="">Chọn Phường/Xã</option>
                <option value="10379">Phường Bến Nghé</option>
                <option value="10380">Phường Bến Thành</option>
                <option value="10381">Phường Cầu Kho</option>
                <option value="10382">Phường Cầu Ông Lãnh</option>
                <option value="10383">Phường Cô Giang</option>
                <option value="10384">Phường Đa Kao</option>
                <option value="10385">Phường Nguyễn Cư Trinh</option>
                <option value="10386">Phường Nguyễn Thái Bình</option>
                <option value="10387">Phường Phạm Ngũ Lão</option>
                <option value="10388">Phường Tân Định</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="address" className="input-label">
                Địa chỉ:
              </label>
              <div>
                <textarea
                  required
                  name="street"
                  rows={5}
                  placeholder="Nhập địa chỉ"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="deliveryAddressType" className="input-label">
                Loại địa chỉ:
              </label>
              <label className="sc-4eb57b3a-0 jlPMUA">
                <input
                  type="radio"
                  name="deliveryAddressType"
                  value=""
                  checked={formData.deliveryAddressType === ''}
                  onChange={handleChange}
                />
                <span className="radio-fake"></span>
                <span className="label">Nhà riêng / Chung cư</span>
              </label>
              <label className="sc-4eb57b3a-0 jlPMUA">
                <input
                  type="radio"
                  name="deliveryAddressType"
                  value="company"
                  checked={formData.deliveryAddressType === 'company'}
                  onChange={handleChange}
                />
                <span className="radio-fake"></span>
                <span className="label">Cơ quan / Công ty</span>
              </label>
            </div>
            <div className="form-control">
              <label className="input-label">&nbsp;</label>
              <label className="sc-2142d018-0 gUCfOs">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                <span className="checkbox-fake"></span>
                <span className="label">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
            <div className="form-control">
              <label className="input-label">&nbsp;</label>
              <button type="submit" className="btn-submit">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}