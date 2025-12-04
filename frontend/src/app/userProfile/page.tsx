'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProfileOverview, ProfileOverviewResponse } from "@/services/profileService";

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

export default function UserProfileOverview() {
  const [profile, setProfile] = useState<ProfileOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Bạn cần đăng nhập để xem hồ sơ của mình.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfileOverview(token);
        setProfile(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không thể tải dữ liệu hồ sơ";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Không thể mở hồ sơ</h2>
        <p>{error}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/auth/login" className="btn primary">
            Đăng nhập ngay
          </Link>
          <Link href="/" className="btn ghost">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { user, stats, defaultAddress, recentOrders } = profile;
  const quickLinks = [
    { href: "/userProfile/orders", label: "Đơn hàng", description: "Theo dõi trạng thái", icon: "🧾" },
    { href: "/userProfile/address", label: "Sổ địa chỉ", description: "Quản lý giao hàng", icon: "📍" },
    { href: "/userProfile/notifications", label: "Thông báo", description: "Cập nhật ưu đãi", icon: "🔔" },
    { href: "/userProfile/wishlist", label: "Yêu thích", description: "Danh sách đã lưu", icon: "❤️" },
    { href: "/userProfile/returns", label: "Đổi trả", description: "Xử lý yêu cầu", icon: "♻️" },
    { href: "/userProfile/support", label: "Hỗ trợ", description: "Liên hệ CSKH", icon: "💬" },
  ];

  const statCards = [
    { label: "Tổng đơn hàng", value: stats.totalOrders, hint: "Đã đặt thành công" },
    { label: "Đang xử lý", value: stats.pendingOrders, hint: "Chờ xác nhận" },
    { label: "Đang vận chuyển", value: stats.shippingOrders, hint: "Trên đường giao" },
    { label: "Đã hoàn tất", value: stats.completedOrders, hint: "Giao thành công" },
    { label: "Đã hủy", value: stats.cancelledOrders, hint: "Hủy bởi bạn hoặc hệ thống" },
    { label: "Tổng chi tiêu", value: formatCurrency(stats.totalSpent), hint: "Từ trước đến nay" },
  ];

  return (
    <div style={{ padding: '20px' }}>
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
                src={user.avatarUrl || "/images/user.png"}
                alt={user.firstName}
                width={80}
                height={80}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <p style={{ color: '#666', marginBottom: '4px' }}>Chào mừng trở lại,</p>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                {user.firstName} {user.lastName}
                {user.isVerified && <span style={{ 
                  marginLeft: '8px', 
                  padding: '2px 8px', 
                  background: '#4CAF50', 
                  color: 'white', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }}>Đã xác thực</span>}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#666' }}>
                <span>Tham gia từ {formatDate(user.createdAt)}</span>
                <span>Vai trò: {user.role === "Admin" ? "Quản trị viên" : "Khách hàng"}</span>
                <span>Hoạt động gần nhất: {formatDate(user.lastActive)}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Số điện thoại</span>
              <strong>{user.phoneNumber || "Chưa cập nhật"}</strong>
            </div>
            <Link href="/userProfile/account" style={{ 
              display: 'inline-block', 
              padding: '8px 16px', 
              background: '#ed4d2d', 
              color: 'white', 
              borderRadius: '4px', 
              textDecoration: 'none',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Chỉnh sửa thông tin
            </Link>
          </div>
        </div>

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
          {defaultAddress ? (
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>{defaultAddress.recipientName}</strong>
              <span style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>{defaultAddress.phone}</span>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>{defaultAddress.addressLine}</p>
              {defaultAddress.isDefault && <span style={{ 
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

      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        padding: '24px',
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
        {recentOrders.length === 0 ? (
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
            {recentOrders.map((order) => (
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
    </div>
  );
}

