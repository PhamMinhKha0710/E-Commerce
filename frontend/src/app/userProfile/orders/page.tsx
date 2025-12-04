'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import '@/styles/userProfileStyles.css';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

// Định nghĩa kiểu dữ liệu từ API
interface OrderItem {
  productItemId: number;
  productId: number;
  categoryId: number;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
  imageUrl?: string;
  storeName?: string;
  isGift: boolean;
  hasVariations: boolean;
}

interface Order {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  orderTotal: number;
  status: string;
  statusDisplay: string;
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DisplayProduct {
  name: string;
  store: string;
  quantity: number;
  price: string;
  image: string;
  gift: boolean;
}

interface DisplayOrder {
  status: string;
  products: DisplayProduct[];
  total: string;
  orderId: number;
  orderNumber: string;
  orderDate: string;
}

// Map tab với status API
const tabStatusMap: { [key: string]: string } = {
  all: 'all',
  pending: 'waiting_for_payment',
  processing: 'processing',
  shipping: 'shipping',
  delivered: 'completed',
  canceled: 'cancelled',
};

// Map tab với index để điều khiển Swiper
const tabIndexMap: { [key: string]: number } = {
  all: 0,
  pending: 1,
  processing: 2,
  shipping: 3,
  delivered: 4,
  canceled: 5,
};

// Map index với tab để xác định tab hiện tại khi Swiper thay đổi
const indexTabMap: { [key: number]: string } = {
  0: 'all',
  1: 'pending',
  2: 'processing',
  3: 'shipping',
  4: 'delivered',
  5: 'canceled',
};

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
  });
};

// Fetch function - CHỈ GỌI TỪ useQuery
const fetchOrders = async (status: string, search?: string): Promise<OrdersResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Vui lòng đăng nhập lại');
  }

  const params = new URLSearchParams({
    status,
    page: '1',
    pageSize: '100',
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`http://localhost:5130/api/orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
};

// Convert Order từ API sang format hiển thị
const convertOrderToDisplay = (order: Order): DisplayOrder => {
  return {
    status: order.statusDisplay,
    products: order.items.map((item) => ({
      name: item.productName,
      store: item.storeName || 'Cửa hàng',
      quantity: item.quantity,
      price: formatCurrency(item.price),
      image: item.imageUrl || '/placeholder-product.png',
      gift: item.isGift,
    })),
    total: formatCurrency(order.orderTotal),
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    orderDate: order.orderDate,
  };
};

// Pure Component: ProductItem
interface ProductItemProps {
  product: DisplayProduct;
  orderId: number;
  productIndex: number;
}

const ProductItem = memo(({ product, orderId, productIndex }: ProductItemProps) => (
  <div key={`${orderId}-product-${productIndex}`} className="product">
    <div className="detail">
      <div
        className="product-img"
        style={{ backgroundImage: `url(${product.image})` }}
      >
        <span className="quantity">x{product.quantity}</span>
      </div>
      <div className="product-info">
        <p className="product-name">
          {product.gift && <span className="bundle gift">Quà tặng</span>}
          {product.name}
        </p>
        <div className="store">
          <span>{product.store}</span>
        </div>
        <div className="sc-fa8534d-0 bvmEzD"></div>
      </div>
    </div>
    <div className="price">
      <span>{product.price}</span>
    </div>
  </div>
));

ProductItem.displayName = 'ProductItem';

// Pure Component: OrderCard
interface OrderCardProps {
  displayOrder: DisplayOrder;
  originalOrder: Order;
  onReorder: (order: Order) => void;
  onViewDetails: (orderId: number) => void;
  tab: string;
  index: number;
}

const OrderCard = memo(({ displayOrder, originalOrder, onReorder, onViewDetails, tab, index }: OrderCardProps) => {
  return (
    <div key={`${tab}-${displayOrder.orderId}-${index}`} className="sc-c1c610ab-0 gkrEzS">
      <div
        color="#808089"
        className={`sc-c1c610ab-1 ${displayOrder.status === 'Đã hủy' ? 'bYXZFb' : 'kLVWAV'}`}
      >
        <span className="main-status">{displayOrder.status}</span>
      </div>
      <div className="sc-f5c558e2-0 mQs">
        <div>
          {displayOrder.products.map((product, prodIndex) => (
            <ProductItem
              key={`${displayOrder.orderId}-product-${prodIndex}`}
              product={product}
              orderId={displayOrder.orderId}
              productIndex={prodIndex}
            />
          ))}
          {displayOrder.products.length > 2 && (
            <div className="btn-more">
              <p>Xem thêm {displayOrder.products.length - 2} sản phẩm</p>
            </div>
          )}
        </div>
      </div>
      <div className="sc-c1c610ab-2 bbruGD">
        <div className="total-money">
          <div className="title">Tổng tiền:</div>
          <div className="total">{displayOrder.total}</div>
        </div>
        <div className="button-group">
          {(displayOrder.status === 'Đã hủy' || displayOrder.status === 'Giao hàng thành công') && (
            <div onClick={() => onReorder(originalOrder)}>Mua lại</div>
          )}
          <div onClick={() => onViewDetails(displayOrder.orderId)}>Xem chi tiết</div>
        </div>
      </div>
    </div>
  );
});

OrderCard.displayName = 'OrderCard';

// Pure Component: OrdersList
interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
  onReorder: (order: Order) => void;
  onViewDetails: (orderId: number) => void;
  tab: string;
}

const OrdersList = memo(({ orders, isLoading, onReorder, onViewDetails, tab }: OrdersListProps) => {
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="sc-6da7ff97-0 ghxvuf">
        <Image
          src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
          alt="no orders"
          width={120}
          height={120}
        />
        <p>Chưa có đơn hàng</p>
      </div>
    );
  }

  const displayOrders = orders.map(convertOrderToDisplay);

  return (
    <>
      {displayOrders.map((displayOrder, index) => {
        const originalOrder = orders.find((o) => o.orderId === displayOrder.orderId)!;
        return (
          <OrderCard
            key={`${tab}-${displayOrder.orderId}-${index}`}
            displayOrder={displayOrder}
            originalOrder={originalOrder}
            onReorder={onReorder}
            onViewDetails={onViewDetails}
            tab={tab}
            index={index}
          />
        );
      })}
    </>
  );
});

OrdersList.displayName = 'OrdersList';

export default function Orders() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const swiperRef = useRef<SwiperClass | null>(null);

  // Query key duy nhất - chỉ thay đổi khi activeTab hoặc searchQuery thay đổi
  const status = tabStatusMap[activeTab] || 'all';
  const queryKey = ['orders', activeTab, searchQuery || ''];

  // CHỈ GỌI API 1 LẦN DUY NHẤT với useQuery
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchOrders(status, searchQuery || undefined),
    enabled: isLoggedIn, // Chỉ fetch khi đã đăng nhập
    staleTime: 60 * 1000, // Cache 1 phút
  });

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Query key thay đổi → TanStack Query tự động refetch 1 lần duy nhất
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    // Query key thay đổi → TanStack Query tự động refetch 1 lần duy nhất
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Xử lý "Mua lại"
  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.items) {
        await addToCart({
          productId: item.productId,
          productName: item.productName,
          categoryId: item.categoryId,
          imageUrl: item.imageUrl || '',
          price: item.price,
          quantity: item.quantity,
          currency: 'VND',
          hasVariations: item.hasVariations,
          productItemId: item.productItemId,
        });
      }
      router.push('/cart');
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  // Xử lý "Xem chi tiết"
  const handleViewDetails = (orderId: number) => {
    router.push(`/userProfile/orders/${orderId}`);
  };

  // Đồng bộ Swiper với activeTab
  useEffect(() => {
    const index = tabIndexMap[activeTab];
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, [activeTab]);

  if (!isLoggedIn) {
    return (
      <div className="sc-33a27214-1 fyHfjl">
        <div className="sc-b446ca32-0 jdhSOb">
          <div className="heading">Đơn hàng của tôi</div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Vui lòng đăng nhập để xem đơn hàng</p>
            <Link href="/auth/login" style={{ color: 'var(--maincolor)', textDecoration: 'none' }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const errorMessage = error instanceof Error ? error.message : error ? 'Có lỗi xảy ra khi tải đơn hàng' : null;

  return (
    <div className="sc-33a27214-1 fyHfjl">
      <div className="sc-b446ca32-0 jdhSOb">
        <div className="heading">Đơn hàng của tôi</div>
        <div className="sc-b446ca32-2 iEyIQx">
          <div
            className={activeTab === 'all' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('all')}
          >
            Tất cả đơn
          </div>
          <div
            className={activeTab === 'pending' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('pending')}
          >
            Chờ thanh toán
          </div>
          <div
            className={activeTab === 'processing' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('processing')}
          >
            Đang xử lý
          </div>
          <div
            className={activeTab === 'shipping' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('shipping')}
          >
            Đang vận chuyển
          </div>
          <div
            className={activeTab === 'delivered' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('delivered')}
          >
            Đã giao
          </div>
          <div
            className={activeTab === 'canceled' ? 'sc-b446ca32-3 fwJLeL' : 'sc-b446ca32-3 jDDrpU'}
            onClick={() => handleTabClick('canceled')}
          >
            Đã huỷ
          </div>
        </div>
        <div className="sc-b446ca32-4 dFJnoA">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            color="#808089"
            className="icon-left"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgb(128, 128, 137)' }}
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <input
            name="search"
            placeholder="Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm"
            type="search"
            className="input with-icon-left"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="search-right" onClick={handleSearch}>
            Tìm đơn hàng
          </div>
        </div>
        {errorMessage && (
          <div style={{ padding: '16px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', margin: '16px 0' }}>
            {errorMessage}
          </div>
        )}
        <Swiper
          initialSlide={tabIndexMap[activeTab]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveTab(indexTabMap[swiper.activeIndex])}
          spaceBetween={0}
          slidesPerView={1}
          speed={500}
          className="react-swipe-container carousel"
        >
          {Object.keys(tabIndexMap).map((tab) => {
            // Chỉ hiển thị data cho tab hiện tại, các tab khác hiển thị empty
            const isActiveTab = tab === activeTab;
            const tabOrders = isActiveTab ? orders : [];
            const tabLoading = isActiveTab ? isLoading : false;

            return (
              <SwiperSlide key={tab}>
                <div
                  className="infinite-scroll-component"
                  style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 110px)' }}
                >
                  <OrdersList
                    orders={tabOrders}
                    isLoading={tabLoading}
                    onReorder={handleReorder}
                    onViewDetails={handleViewDetails}
                    tab={tab}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
