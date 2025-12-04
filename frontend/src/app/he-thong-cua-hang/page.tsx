'use client';

import React, { useState, useEffect } from 'react';
import './StoreSystemPage.css';
import Breadcrumb from '@/components/sections/Breadcrum';

// Dữ liệu mẫu các cửa hàng
const stores = [
  {
    id: 1,
    name: 'ND Theme Hà Nội',
    address: 'Tầng 6 - 266 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Hà Nội',
    phone: '1900 6750',
    city: 'Hà Nội',
    district: 'Ba Đình',
    lat: 21.028817,
    lng: 105.818349,
  },
  {
    id: 2,
    name: 'ND Theme Nghệ An',
    address: 'Khối 2, Thị Trấn Tân Lạc, Quỳ Châu, Nghệ An',
    phone: '1900 6750',
    city: 'Nghệ An',
    district: 'Quỳ Châu',
    lat: 19.5,
    lng: 105.3,
  },
  {
    id: 3,
    name: 'ND Theme Hà Nội',
    address: '165 Cầu Giấy, Ba Đình, Hà Nội',
    phone: '1900 6750',
    city: 'Hà Nội',
    district: 'Ba Đình',
    lat: 21.030000,
    lng: 105.800000,
  },
  {
    id: 4,
    name: 'ND Theme TP.HCM',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '1900 6750',
    city: 'TP.HCM',
    district: 'Quận 1',
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: 5,
    name: 'ND Theme Đà Nẵng',
    address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
    phone: '1900 6750',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    lat: 16.0544,
    lng: 108.2022,
  },
  {
    id: 6,
    name: 'ND Theme Hải Phòng',
    address: '321 Lạch Tray, Ngô Quyền, Hải Phòng',
    phone: '1900 6750',
    city: 'Hải Phòng',
    district: 'Ngô Quyền',
    lat: 20.8449,
    lng: 106.6881,
  },
  {
    id: 7,
    name: 'ND Theme Hà Nội',
    address: '456 Hoàng Hoa Thám, Tây Hồ, Hà Nội',
    phone: '1900 6750',
    city: 'Hà Nội',
    district: 'Tây Hồ',
    lat: 21.050000,
    lng: 105.820000,
  },
  {
    id: 8,
    name: 'ND Theme TP.HCM',
    address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
    phone: '1900 6750',
    city: 'TP.HCM',
    district: 'Quận 7',
    lat: 10.7306,
    lng: 106.7172,
  }
];

const cities = ['Tất cả', 'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Nghệ An'];

// Lấy danh sách quận/huyện theo thành phố
const getDistricts = (city: string) => {
  if (city === 'Tất cả') return ['Tất cả'];
  const cityStores = stores.filter(store => store.city === city);
  const districts = [...new Set(cityStores.map(store => store.district))];
  return ['Tất cả', ...districts];
};

export default function StoreSystemPage() {
  const [selectedCity, setSelectedCity] = useState('Tất cả');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const [selectedStore, setSelectedStore] = useState<number | null>(stores[0]?.id || null);

  const districts = getDistricts(selectedCity);

  // Reset district khi đổi thành phố
  useEffect(() => {
    setSelectedDistrict('Tất cả');
  }, [selectedCity]);

  const filteredStores = stores.filter(store => {
    const matchCity = selectedCity === 'Tất cả' || store.city === selectedCity;
    const matchDistrict = selectedDistrict === 'Tất cả' || store.district === selectedDistrict;
    return matchCity && matchDistrict;
  });

  // Set store đầu tiên làm mặc định khi filter thay đổi
  useEffect(() => {
    if (filteredStores.length > 0 && !filteredStores.find(s => s.id === selectedStore)) {
      setSelectedStore(filteredStores[0].id);
    }
  }, [filteredStores, selectedStore]);

  const currentStore = stores.find(s => s.id === selectedStore) || filteredStores[0] || stores[0];

  const getMapUrl = (store: typeof stores[0]) => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096705912595!2d${store.lng}!3d${store.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece8053%3A0x1e375bf26a5bd052!2z${encodeURIComponent(store.address)}!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s`;
  };

  return (
    <div className="store-system-page">
      {/* Hero Section */}
      <section className="store-hero">
        <div className="container">
          <Breadcrumb items={[
            { label: "Trang chủ", href: "/" },
            { label: "Hệ thống cửa hàng", isActive: true }
          ]} />
        </div>
      </section>

      {/* Stats Section - Hiển thị ở trên */}
      <section className="store-stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-title">Hệ thống 8 cửa hàng</div>
                <div className="stat-desc">Trên toàn quốc</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-title">Hơn 100 nhân viên</div>
                <div className="stat-desc">Để phục vụ quý khách</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="stat-text">
                <div className="stat-title">Mở cửa 8-22h</div>
                <div className="stat-desc">Cả CN & Lễ tết</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Layout 2 cột */}
      <section className="store-main-section">
        <div className="container">
          <div className="store-layout">
            {/* Cột trái - Filter và Danh sách cửa hàng */}
            <div className="store-list-column">
              {/* Filter Section */}
              <div className="filter-section">
                <div className="filter-group">
                  <label htmlFor="city-select">Chọn tỉnh thành</label>
                  <select
                    id="city-select"
                    className="filter-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="district-select">Chọn quận/huyện</label>
                  <select
                    id="district-select"
                    className="filter-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Danh sách cửa hàng */}
              <div className="store-list">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className={`store-card ${selectedStore === store.id ? 'active' : ''}`}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <div className="store-card-content">
                      <h3 className="store-name">{store.name}</h3>
                      <div className="store-address">
                        <strong>Địa chỉ:</strong> {store.address}
                      </div>
                      <div className="store-phone">
                        <strong>Hotline:</strong> {store.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột phải - Google Map */}
            <div className="store-map-column">
              {currentStore && (
                <>
                  {/* Info box phía trên map */}
                  <div className="map-info-box">
                    <div className="map-info-content">
                      <div className="map-info-address">{currentStore.address}</div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${currentStore.lat},${currentStore.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-directions-btn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Chỉ đường
                      </a>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${currentStore.lat},${currentStore.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-view-larger"
                    >
                      Xem bản đồ lớn hơn
                    </a>
                  </div>

                  {/* Google Map */}
                  <div className="store-map-container">
                    <iframe
                      src={getMapUrl(currentStore)}
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={currentStore.name}
                    ></iframe>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
