'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import '@/styles/userProfileStyles.css';

// Định nghĩa kiểu dữ liệu từ API
interface OrderLine {
  id: number;
  productItemId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Address {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  orderDate: string;
  orderTotal: number;
  shippingAmount: number;
  discountAmount: number;
  note: string;
  status: string;
  promotionId?: number;
  shippingAddress: Address;
  orderLines: OrderLine[];
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status display
const getStatusDisplay = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('pending') || statusLower.includes('unpaid') || statusLower.includes('waiting')) {
    return 'Chờ Vận Chuyển';
  }
  if (statusLower.includes('processing') || statusLower.includes('confirmed')) {
    return 'Đang xử lý';
  }
  if (statusLower.includes('shipping') || statusLower.includes('transport')) {
    return 'Đang vận chuyển';
  }
  if (statusLower.includes('completed') || statusLower.includes('success') || statusLower.includes('delivered')) {
    return 'Giao hàng thành công';
  }
  if (statusLower.includes('cancel')) {
    return 'Đã hủy';
  }
  if (statusLower.includes('return')) {
    return 'Đã trả hàng';
  }
  return status;
};

// Fetch order detail
const fetchOrderDetail = async (orderId: string): Promise<OrderDetail> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Vui lòng đăng nhập lại');
  }

  const response = await fetch(`http://localhost:5130/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    if (response.status === 404) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    throw new Error(`Failed to fetch order: ${response.status}`);
  }

  return response.json();
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const orderId = params.orderId as string;

  // Fetch order detail với TanStack Query
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: isLoggedIn && !!orderId,
    staleTime: 60 * 1000, // Cache 1 phút
  });

  // Xử lý "Mua lại"
  const handleReorder = async () => {
    if (!order) return;

    try {
      // Lấy thông tin sản phẩm từ orderLines
      // Note: API hiện tại không trả về đầy đủ thông tin sản phẩm, cần fetch thêm
      // Tạm thời chỉ hiển thị thông báo
      alert('Tính năng mua lại đang được phát triển. Vui lòng thêm sản phẩm vào giỏ hàng thủ công.');
      router.push('/cart');
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="sc-33a27214-1 fyHfjl">
        <div className="sc-b446ca32-0 jdhSOb">
          <div className="heading">Chi tiết đơn hàng</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Vui lòng đăng nhập để xem chi tiết đơn hàng</p>
            <Link href="/auth/login" style={{ color: 'var(--maincolor)', textDecoration: 'none' }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="sc-33a27214-1 fyHfjl">
        <div className="sc-b446ca32-0 jdhSOb">
          <div className="heading">Chi tiết đơn hàng</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải chi tiết đơn hàng';
    return (
      <div className="sc-33a27214-1 fyHfjl">
        <div className="sc-b446ca32-0 jdhSOb">
          <div className="heading">Chi tiết đơn hàng</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#ff4d4f', marginBottom: '16px' }}>{errorMessage}</p>
            <button
              onClick={() => router.push('/userProfile/orders')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--maincolor)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="sc-33a27214-1 fyHfjl">
        <div className="sc-b446ca32-0 jdhSOb">
          <div className="heading">Chi tiết đơn hàng</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Không tìm thấy đơn hàng</p>
            <button
              onClick={() => router.push('/userProfile/orders')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--maincolor)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '16px',
              }}
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);
  const isCancelled = order.status.toLowerCase().includes('cancel');
  const isCompleted = order.status.toLowerCase().includes('completed') || order.status.toLowerCase().includes('success') || order.status.toLowerCase().includes('delivered');

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-b446ca32-0 jdhSOb">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => router.back()}
            style={{
              marginRight: '16px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Quay lại
          </button>
          <div className="heading">Chi tiết đơn hàng</div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="sc-c1c610ab-0 gkrEzS" style={{ marginBottom: '20px' }}>
          <div className={`sc-c1c610ab-1 ${isCancelled ? 'bYXZFb' : 'kLVWAV'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="main-status">{statusDisplay}</span>
              <span style={{ fontSize: '14px', color: '#808089' }}>Mã đơn: {order.orderNumber}</span>
            </div>
          </div>
          <div style={{ padding: '15px' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ fontSize: '14px', color: '#333' }}>Ngày đặt hàng:</strong>
              <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>{formatDate(order.orderDate)}</span>
            </div>
            {order.note && (
              <div style={{ marginTop: '12px' }}>
                <strong style={{ fontSize: '14px', color: '#333' }}>Ghi chú:</strong>
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#666' }}>{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        {order.shippingAddress && (
          <div className="sc-c1c610ab-0 gkrEzS" style={{ marginBottom: '20px' }}>
            <div className="sc-c1c610ab-1 kLVWAV">
              <span className="main-status">Địa chỉ giao hàng</span>
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                <strong>{order.shippingAddress.name}</strong>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {order.shippingAddress.address}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Điện thoại: {order.shippingAddress.phone}</div>
            </div>
          </div>
        )}

        {/* Danh sách sản phẩm */}
        <div className="sc-c1c610ab-0 gkrEzS" style={{ marginBottom: '20px' }}>
          <div className="sc-c1c610ab-1 kLVWAV">
            <span className="main-status">Sản phẩm</span>
          </div>
          <div className="sc-f5c558e2-0 mQs">
            {order.orderLines.map((line) => (
              <div key={line.id} className="product">
                <div className="detail">
                  <div
                    className="product-img"
                    style={{
                      backgroundImage: `url(${line.imageUrl || '/placeholder-product.png'})`,
                    }}
                  >
                    <span className="quantity">x{line.quantity}</span>
                  </div>
                  <div className="product-info">
                    <p className="product-name">{line.productName}</p>
                    <div className="store">
                      <span>Cửa hàng</span>
                    </div>
                  </div>
                </div>
                <div className="price">
                  <span>{formatCurrency(line.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="sc-c1c610ab-0 gkrEzS" style={{ marginBottom: '20px' }}>
          <div className="sc-c1c610ab-1 kLVWAV">
            <span className="main-status">Tổng tiền</span>
          </div>
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Tạm tính:</span>
              <span style={{ fontSize: '14px', color: '#333' }}>
                {formatCurrency(order.orderTotal - order.shippingAmount + order.discountAmount)}
              </span>
            </div>
            {order.shippingAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Phí vận chuyển:</span>
                <span style={{ fontSize: '14px', color: '#333' }}>{formatCurrency(order.shippingAmount)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Giảm giá:</span>
                <span style={{ fontSize: '14px', color: '#28a745' }}>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Tổng cộng:</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#ff4d4f' }}>
                {formatCurrency(order.orderTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="sc-c1c610ab-2 bbruGD">
          <div className="button-group" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {(isCancelled || isCompleted) && (
              <div
                onClick={handleReorder}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333',
                }}
              >
                Mua lại
              </div>
            )}
            <div
              onClick={() => router.push('/userProfile/orders')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--maincolor)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Quay lại danh sách
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

