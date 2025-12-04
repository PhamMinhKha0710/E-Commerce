'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/userProfileStyles.css';
import { getUserAccount, UserAccountInfo, getProfileOverview, ProfileOverviewResponse, updateProfile } from '@/services/profileService';

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
    fullName: '',
    nickname: '',
    day: '',
    month: '',
    year: '',
    gender: 'male',
    phone: '',
    email: '',
    password: '',
    facebook: '',
    google: '',
    nationality: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserAccountInfo | null>(null);
  const [profileOverview, setProfileOverview] = useState<ProfileOverviewResponse | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Bạn cần đăng nhập để xem thông tin tài khoản");
        setLoading(false);
        return;
      }

      try {
        // Fetch both user account and profile overview
        const [accountData, overviewData] = await Promise.all([
          getUserAccount(token),
          getProfileOverview(token)
        ]);
        
        setUserInfo(accountData);
        setProfileOverview(overviewData);
        
        // Parse date of birth if available (assuming it might be stored separately)
        // For now, we'll just set the basic info
        setFormData(prev => ({
          ...prev,
          fullName: `${accountData.firstName} ${accountData.lastName}`.trim(),
          phone: accountData.phoneNumber || '',
          email: accountData.email || '',
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không thể tải thông tin tài khoản";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (typeof window === "undefined") {
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Bạn cần đăng nhập để cập nhật thông tin");
      setSaving(false);
      return;
    }

    try {
      // Parse fullName to firstName and lastName
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare update data
      const updateData: { firstName?: string; lastName?: string; phoneNumber?: string } = {};
      
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (formData.phone) updateData.phoneNumber = formData.phone;

      // Call API to update profile
      const updatedUser = await updateProfile(token, updateData);
      
      // Update local state
      setUserInfo(updatedUser);
      setFormData(prev => ({
        ...prev,
        fullName: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        phone: updatedUser.phoneNumber || '',
      }));
      
      setSuccessMessage("Cập nhật thông tin thành công!");
      
      // Refresh profile overview
      const overviewData = await getProfileOverview(token);
      setProfileOverview(overviewData);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể cập nhật thông tin tài khoản";
      setError(message);
    } finally {
      setSaving(false);
    }
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  const formatDate = (value?: string | null) => {
    if (!value) return "Chưa cập nhật";
    return new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("cancel")) return "cancelled";
    if (normalized.includes("ship") || normalized.includes("transport")) return "shipping";
    if (normalized.includes("complete") || normalized.includes("delivered") || normalized.includes("success")) return "completed";
    return "pending";
  };

  const quickLinks = [
    { href: "/userProfile/orders", label: "Đơn hàng", description: "Theo dõi trạng thái", icon: "🧾" },
    { href: "/userProfile/address", label: "Sổ địa chỉ", description: "Quản lý giao hàng", icon: "📍" },
    { href: "/userProfile/notifications", label: "Thông báo", description: "Cập nhật ưu đãi", icon: "🔔" },
    { href: "/userProfile/wishlist", label: "Yêu thích", description: "Danh sách đã lưu", icon: "❤️" },
    { href: "/userProfile/returns", label: "Đổi trả", description: "Xử lý yêu cầu", icon: "♻️" },
    { href: "/userProfile/support", label: "Hỗ trợ", description: "Liên hệ CSKH", icon: "💬" },
  ];

  const statCards = profileOverview ? [
    { label: "Tổng đơn hàng", value: profileOverview.stats.totalOrders, hint: "Đã đặt thành công" },
    { label: "Đang xử lý", value: profileOverview.stats.pendingOrders, hint: "Chờ xác nhận" },
    { label: "Đang vận chuyển", value: profileOverview.stats.shippingOrders, hint: "Trên đường giao" },
    { label: "Đã hoàn tất", value: profileOverview.stats.completedOrders, hint: "Giao thành công" },
    { label: "Đã hủy", value: profileOverview.stats.cancelledOrders, hint: "Hủy bởi bạn hoặc hệ thống" },
    { label: "Tổng chi tiêu", value: formatCurrency(profileOverview.stats.totalSpent), hint: "Từ trước đến nay" },
  ] : [];

  if (loading) {
    return (
      <div className="sc-4bd7d8aa-1 cMLWwS" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sc-4bd7d8aa-1 cMLWwS" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Không thể tải thông tin</h2>
        <p style={{ color: '#f44336', marginBottom: '20px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header Overview Section */}
      {profileOverview && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '32px', 
          marginBottom: '24px',
          boxShadow: '0 12px 32px rgba(237, 77, 45, 0.06)',
          border: '1px solid #f1f1f5'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
              <div>
                <Image
                  src={profileOverview.user.avatarUrl || "/images/user.png"}
                  alt={profileOverview.user.firstName}
                  width={80}
                  height={80}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <p style={{ color: '#666', marginBottom: '4px' }}>Chào mừng trở lại,</p>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                  {profileOverview.user.firstName} {profileOverview.user.lastName}
                  {profileOverview.user.isVerified && <span style={{ 
                    marginLeft: '8px', 
                    padding: '2px 8px', 
                    background: '#4CAF50', 
                    color: 'white', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }}>Đã xác thực</span>}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#666' }}>
                  <span>Tham gia từ {formatDate(profileOverview.user.createdAt)}</span>
                  <span>Vai trò: {profileOverview.user.role === "Admin" ? "Quản trị viên" : "Khách hàng"}</span>
                  <span>Hoạt động gần nhất: {formatDate(profileOverview.user.lastActive)}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Email</span>
                <strong>{profileOverview.user.email}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Số điện thoại</span>
                <strong>{profileOverview.user.phoneNumber || "Chưa cập nhật"}</strong>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            {statCards.map((card) => (
              <div key={card.label} style={{ 
                padding: '16px', 
                background: '#f8f9fb', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>{card.label}</span>
                <strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px' }}>
                  {typeof card.value === "number" && card.label !== "Tổng chi tiêu" ? card.value : card.value}
                </strong>
                <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{card.hint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Address and Quick Links Section */}
      {profileOverview && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 12px 32px rgba(237, 77, 45, 0.06)',
            border: '1px solid #f1f1f5'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Địa chỉ mặc định</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Dùng cho các đơn hàng gần nhất của bạn</p>
              </div>
              <Link href="/userProfile/address" style={{ fontSize: '14px', color: '#ed4d2d', textDecoration: 'none' }}>
                Quản lý
              </Link>
            </div>
            {profileOverview.defaultAddress ? (
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>{profileOverview.defaultAddress.recipientName}</strong>
                <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>{profileOverview.defaultAddress.phone}</span>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>{profileOverview.defaultAddress.addressLine}</p>
                {profileOverview.defaultAddress.isDefault && <span style={{ 
                  display: 'inline-block', 
                  padding: '2px 8px', 
                  background: '#ed4d2d', 
                  color: 'white', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  marginTop: '8px'
                }}>Mặc định</span>}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ marginBottom: '12px', color: '#666' }}>Bạn chưa lưu địa chỉ nhận hàng nào.</p>
                <Link href="/userProfile/address" style={{ 
                  display: 'inline-block', 
                  padding: '8px 16px', 
                  background: '#ed4d2d', 
                  color: 'white', 
                  borderRadius: '4px', 
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                  Thêm địa chỉ mới
                </Link>
              </div>
            )}
          </div>

          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0 12px 32px rgba(237, 77, 45, 0.06)',
            border: '1px solid #f1f1f5'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Lối tắt tài khoản</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Tiết kiệm thời gian quản lý tài khoản</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  padding: '12px', 
                  background: '#f8f9fb', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fb'}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{item.label}</strong>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      {profileOverview && (
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 12px 32px rgba(237, 77, 45, 0.06)',
          border: '1px solid #f1f1f5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Đơn hàng gần đây</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Nắm trạng thái các đơn mới nhất</p>
            </div>
            <Link href="/userProfile/orders" style={{ fontSize: '14px', color: '#ed4d2d', textDecoration: 'none' }}>
              Xem tất cả
            </Link>
          </div>
          {profileOverview.recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ marginBottom: '12px', color: '#666' }}>Bạn chưa có đơn hàng nào. Khám phá sản phẩm ngay!</p>
              <Link href="/collections/all" style={{ 
                display: 'inline-block', 
                padding: '8px 16px', 
                background: '#ed4d2d', 
                color: 'white', 
                borderRadius: '4px', 
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Bắt đầu mua sắm
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profileOverview.recentOrders.map((order) => (
                <div key={order.orderId} style={{ 
                  padding: '16px', 
                  background: '#f8f9fb', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>#{order.orderNumber}</strong>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{formatDate(order.orderDate)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        marginBottom: '4px',
                        background: getStatusBadgeClass(order.status) === 'completed' ? '#4CAF50' : 
                                    getStatusBadgeClass(order.status) === 'shipping' ? '#2196F3' :
                                    getStatusBadgeClass(order.status) === 'cancelled' ? '#f44336' : '#FF9800',
                        color: 'white'
                      }}>{order.status}</span>
                      <strong style={{ display: 'block', marginTop: '4px' }}>{formatCurrency(order.orderTotal)}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((item, index) => (
                      <div key={`${order.orderId}-${index}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.productName} width={48} height={48} style={{ borderRadius: '4px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>📦</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>{item.productName}</strong>
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            SL: {item.quantity} · {formatCurrency(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Info Form Section */}
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
                        src={userInfo?.avatarUrl || "https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png"}
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
                {error && (
                  <div style={{ 
                    marginBottom: '12px', 
                    padding: '12px', 
                    background: '#fee', 
                    color: '#c33', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div style={{ 
                    marginBottom: '12px', 
                    padding: '12px', 
                    background: '#efe', 
                    color: '#3c3', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {successMessage}
                  </div>
                )}
                <button 
                  type="submit" 
                  className="sc-4bd7d8aa-3 dAcgvk btn-submit"
                  disabled={saving}
                  style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
    </div>
  );
}