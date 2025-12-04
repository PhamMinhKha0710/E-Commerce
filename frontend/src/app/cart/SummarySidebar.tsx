'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Define the type for address
interface AddressType {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

// Define the type for cart items
interface CartItemType {
  id: number;
  seller: string;
  categoryId: number;
  name: string;
  price: number;
  quantity: number;
  available: boolean;
  delivery: string;
  image: string;
  productItemId: number | null;
}

// Define the type for promotion response
interface PromotionResponseDto {
  discountRate: number;
  limitDiscountPrice: number;
  isAvailable: boolean;
  remainingQuantity: number;
  startDate: string;
  endDate: string;
  listCartIdPromotion: number[];
}

// Define the type for coupon
interface Coupon {
  code: string;
  discountPercent: number;
  limitDiscountPrice: number;
  listCartIdPromotion: number[];
}

interface SummarySidebarProps {
  selectedItems: number[];
  cartItems: CartItemType[];
}

const SummarySidebar: React.FC<SummarySidebarProps> = ({ selectedItems, cartItems }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState<AddressType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [isCouponInputVisible, setIsCouponInputVisible] = useState<boolean>(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Fetch default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!isLoggedIn) {
        setError('Vui lòng đăng nhập để xem địa chỉ mặc định.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Không tìm thấy access token.');
        }

        const response = await fetch('http://localhost:5130/api/addresses/default', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: AddressType = await response.json();
          setAddress(data);
          setError(null);
        } else if (response.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setAddress(null);
        } else if (response.status === 404) {
          setError('Không tìm thấy địa chỉ mặc định.');
          setAddress(null);
        } else {
          throw new Error('Lỗi khi lấy địa chỉ mặc định.');
        }
      } catch {
        setError('Lỗi khi lấy địa chỉ mặc định.');
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultAddress();
  }, [isLoggedIn]);

  // Load coupons from localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem('cartCoupons');
    if (savedCoupons) {
      try {
        const parsedCoupons = JSON.parse(savedCoupons);
        if (Array.isArray(parsedCoupons)) {
          // Validate coupon structure
          const validCoupons = parsedCoupons.filter(coupon => 
            coupon && 
            coupon.code && 
            typeof coupon.discountPercent === 'number' &&
            typeof coupon.limitDiscountPrice === 'number' &&
            Array.isArray(coupon.listCartIdPromotion)
          );
          if (validCoupons.length > 0) {
            setCoupons(validCoupons);
            console.log('Loaded coupons from localStorage:', validCoupons);
          }
        }
      } catch (err) {
        console.error('Error parsing saved coupons:', err);
      }
    }
  }, []);

  // Save coupons to localStorage
  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem('cartCoupons', JSON.stringify(coupons));
    } else {
      localStorage.removeItem('cartCoupons');
    }
  }, [coupons]);

  const checkCoupon = async (code: string): Promise<PromotionResponseDto | null> => {
    try {
      const response = await fetch(`http://localhost:5130/api/admin/Promotions/client/${code}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });

      if (response.ok) {
        const data: PromotionResponseDto = await response.json();
        const now = new Date();
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (!data.isAvailable) {
          setCouponError('Mã khuyến mãi hiện không khả dụng.');
          toast.error('Mã khuyến mãi hiện không khả dụng.');
          return null;
        }

        if (data.remainingQuantity <= 0) {
          setCouponError('Mã khuyến mãi đã hết lượt sử dụng.');
          toast.error('Mã khuyến mãi đã hết lượt sử dụng.');
          return null;
        }

        if (now < startDate) {
          setCouponError('Mã khuyến mãi chưa bắt đầu.');
          toast.error(`Mã khuyến mãi chưa bắt đầu. Hiệu lực từ ${startDate.toLocaleDateString('vi-VN')}.`);
          return null;
        }

        if (now > endDate) {
          setCouponError('Mã khuyến mãi đã hết hạn.');
          toast.error(`Mã khuyến mãi đã hết hạn vào ${endDate.toLocaleDateString('vi-VN')}.`);
          return null;
        }

        // Check if coupon applies to any selected items
        const selectedCartItems = selectedItems
          .filter(index => index >= 0 && index < cartItems.length && cartItems[index].available)
          .map(index => cartItems[index]);

        const applicableItems = selectedCartItems.filter((item) =>
          data.listCartIdPromotion.includes(item.categoryId)
        );
        
        if (applicableItems.length === 0 && selectedItems.length > 0) {
          setCouponError('Mã khuyến mãi không áp dụng cho sản phẩm nào trong đơn hàng.');
          toast.error('Mã khuyến mãi không áp dụng cho sản phẩm nào trong đơn hàng.');
          return null;
        }

        return data;
      } else if (response.status === 404) {
        setCouponError('Mã khuyến mãi không hợp lệ.');
        toast.error('Mã khuyến mãi không hợp lệ.');
        return null;
      } else {
        throw new Error(`Lỗi không xác định: ${response.status}`);
      }
    } catch {
      setCouponError('Lỗi khi kiểm tra mã khuyến mãi.');
      toast.error('Lỗi khi kiểm tra mã khuyến mãi.');
      return null;
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã khuyến mãi.');
      toast.error('Vui lòng nhập mã khuyến mãi.');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const couponData = await checkCoupon(couponCode.trim());
      if (!couponData) {
        return;
      }

      const newCoupon: Coupon = {
        code: couponCode.trim(),
        discountPercent: couponData.discountRate,
        limitDiscountPrice: couponData.limitDiscountPrice,
        listCartIdPromotion: couponData.listCartIdPromotion,
      };

      // Check if coupon already exists
      if (coupons.some(c => c.code === newCoupon.code)) {
        setCouponError('Mã khuyến mãi này đã được áp dụng.');
        toast.error('Mã khuyến mãi này đã được áp dụng.');
        return;
      }

      // Limit to 2 coupons
      if (coupons.length >= 2) {
        setCouponError('Bạn chỉ có thể áp dụng tối đa 2 mã khuyến mãi.');
        toast.error('Bạn chỉ có thể áp dụng tối đa 2 mã khuyến mãi.');
        return;
      }

      setCoupons([...coupons, newCoupon]);
      setCouponCode('');
      setIsCouponInputVisible(false);
      toast.success(`Áp dụng mã khuyến mãi thành công! Còn ${couponData.remainingQuantity} lượt.`);
    } catch {
      setCouponError('Lỗi khi áp dụng mã khuyến mãi.');
      toast.error('Lỗi khi áp dụng mã khuyến mãi.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = (code: string) => {
    setCoupons(coupons.filter((coupon) => coupon.code !== code));
    toast.info('Đã bỏ mã khuyến mãi.');
  };

  const handleToggleCouponInput = () => {
    setIsCouponInputVisible(!isCouponInputVisible);
    setCouponError(null);
  };

  const banners = [
    {
      href: 'https://tiki.vn/khuyen-mai/dien-tu-dien-gia-dung-dien-lanh?itm_campaign=UNK_YPD_TKA_BNA_UNK_ALL_UNK_UNK_UNK_UNK_X.213283_Y.1795603_Z.3934240_CN.Default-banners-for-all-display-placements&itm_medium=CPM&itm_source=tiki-ads',
      src: 'https://salt.tikicdn.com/cache/w720/ts/tka/99/ce/6a/9c0a7990ddba5207da7cc37b85bdc2f0.png',
    },
    {
      href: 'https://tiki.vn/khuyen-mai/cong-nghe-gia-hoi?itm_campaign=UNK_YPD_TKA_BNA_UNK_ALL_UNK_UNK_UNK_UNK_X.213283_Y.1795603_Z.3934243_CN.Default-banners-for-all-display-placements&itm_medium=CPM&itm_source=tiki-ads&waypoint_id=giamtoi50',
      src: 'https://salt.tikicdn.com/cache/w720/ts/tka/7f/0b/d3/95916a0bd08a84d64206ce6ef9e72010.png',
    },
    {
      href: 'https://tiki.vn/khuyen-mai/top-dien-thoai-may-tinh-bang?itm_campaign=UNK_YPD_TKA_BNA_UNK_ALL_UNK_UNK_UNK_UNK_X.213283_Y.1795603_Z.3934246_CN.Default-banners-for-all-display-placements&itm_medium=CPM&itm_source=tiki-ads&waypoint_id=tikichon',
      src: 'https://salt.tikicdn.com/cache/w720/ts/tka/a9/ec/4f/e95b916999b2dd40b3a8e2af30e704e8.png',
    },
    {
      href: 'https://tiki.vn/khuyen-mai/hang-nhap-khau-chinh-hang?itm_campaign=UNK_YPD_TKA_BNA_UNK_ALL_UNK_UNK_UNK_UNK_X.213283_Y.1795603_Z.3934237_CN.Default-banners-for-all-display-placements&itm_medium=CPM&itm_source=tiki-ads&tmsx=009cfe78-c61e-4cec-ac87-3f80ef62f1cf&waypoint_id=HANQUOC',
      src: 'https://salt.tikicdn.com/cache/w720/ts/tka/46/b7/ac/46f02024b577c3e3a825a0c955bda0ea.png',
    },
    {
      href: 'https://tiki.vn/khuyen-mai/xe-phu-kien-sieu-sale?itm_campaign=UNK_YPD_TKA_BNA_UNK_ALL_UNK_UNK_UNK_UNK_X.213283_Y.1795603_Z.3934248_CN.Default-banners-for-all-display-placements&itm_medium=CPM&itm_source=tiki-ads&waypoint_id=tikichon',
      src: 'https://salt.tikicdn.com/cache/w720/ts/tka/45/7b/70/fb7c0e1414d55ae6ea43af2883f2d842.png',
    },
  ];

  // Calculate total price of selected items
  const totalPrice = selectedItems
    .filter(index => index >= 0 && index < cartItems.length && cartItems[index].available)
    .reduce((total, index) => total + cartItems[index].price * cartItems[index].quantity, 0);

  // Calculate discount from coupons
  let discount = 0;
  if (coupons.length > 0 && cartItems.length > 0) {
    // Use all cart items if no items are selected, otherwise use selected items
    const itemsToCheck = selectedItems.length > 0
      ? selectedItems
          .filter(index => index >= 0 && index < cartItems.length && cartItems[index].available)
          .map(index => cartItems[index])
      : cartItems.filter(item => item.available);

    coupons.forEach((coupon) => {
      // Check if coupon applies to any items
      const applicableItems = itemsToCheck.filter((item) => {
        // If listCartIdPromotion is empty or undefined, apply to all items
        if (!coupon.listCartIdPromotion || coupon.listCartIdPromotion.length === 0) {
          return true;
        }
        // Otherwise, check if item's categoryId is in the promotion list
        return coupon.listCartIdPromotion.includes(item.categoryId);
      });
      
      if (applicableItems.length > 0) {
        const applicableTotal = applicableItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        
        const discountAmount = (applicableTotal * coupon.discountPercent) / 100;
        
        // Apply limit if specified (limitDiscountPrice > 0 means there's a limit)
        const limitedDiscount = coupon.limitDiscountPrice > 0 
          ? Math.min(discountAmount, coupon.limitDiscountPrice)
          : discountAmount;
        
        discount += limitedDiscount;
      }
    });
  }

  const finalTotal = Math.max(0, totalPrice - discount);

  // Count selected items
  const selectedCount = selectedItems.length;

  // Handle checkout button click
  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    // Create selectedCartItems based on selectedItems
    const selectedCartItems = selectedItems
      .filter(index => index >= 0 && index < cartItems.length && cartItems[index].available)
      .map(index => ({
        productId: cartItems[index].id,
        productName: cartItems[index].name,
        categoryId: cartItems[index].categoryId,
        imageUrl: cartItems[index].image,
        price: cartItems[index].price,
        quantity: cartItems[index]. quantity,
        currency: 'VND',
        hasVariations: cartItems[index].productItemId !== null,
        productItemId: cartItems[index].productItemId,
      }));

    // Save selectedCartItems to localStorage
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    // Save coupons to localStorage for checkout page
    if (coupons.length > 0) {
      localStorage.setItem('cartCoupons', JSON.stringify(coupons));
    }

    router.push('/checkout');
  };

  return (
    <aside className="summary-sidebar" style={{ width: '292px' }}>
      <style jsx>{`
        .summary-sidebar {
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .change-link {
          font-size: 14px;
          color: var(--maincolor);
          text-decoration: none;
        }
        .change-link:hover {
          text-decoration: underline;
        }
        .customer-info {
          display: flex;
          gap: 8px;
          font-size: 14px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .address-info {
          font-size: 14px;
          color: #666;
        }
        .address-type {
          background: #e5e7eb;
          padding: 2px 8px;
          border-radius: 4px;
          margin-right: 8px;
          font-size: 12px;
        }
        .error-message {
          color: red;
          font-size: 14px;
        }
        .coupon-info {
          margin: 16px 0;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }
        .coupon-usage {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #666;
        }
        .coupon-add {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--maincolor);
          cursor: pointer;
        }
        .coupon-input-section {
          margin-top: 12px;
        }
        .coupon-input-wrapper {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .coupon-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
        }
        .coupon-apply-button {
          padding: 8px 16px;
          background: var(--maincolor);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .coupon-apply-button:hover {
          opacity: 0.9;
        }
        .coupon-apply-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .coupon-error {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }
        .coupon-list {
          margin-top: 8px;
        }
        .coupon-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .coupon-remove {
          color: red;
          cursor: pointer;
          font-size: 12px;
        }
        .order-total {
          margin-top: 16px;
        }
        .total-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
        }
        .total-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .total-final {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
        }
        .total-value {
          text-align: right;
        }
        .total-amount {
          color: #ed4d2d;
          font-size: 18px;
        }
        .total-note {
          display: block;
          font-size: 12px;
          color: #666;
          font-weight: normal;
        }
        .total-empty {
          color: #666;
          font-size: 14px;
        }
        .checkout-button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .checkout-button:hover {
          background: #c24125;
        }
        .checkout-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .swiper-pagination-bullet {
          width: 16px;
          height: 2px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          background: rgb(10, 104, 255);
        }
      `}</style>
      <div style={{ position: 'sticky', top: '16px' }}>
        <div className="shipping-info">
          <div className="section-header">
            <h2>Giao tới</h2>
            <Link href="/address" className="change-link">
              Thay đổi
            </Link>
          </div>
          {loading ? (
            <div>Đang tải địa chỉ...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : address ? (
            <>
              <div className="customer-info">
                <span className="customer-name">{address.name}</span>
                <span className="customer-phone">{address.phone}</span>
              </div>
              <div className="address-info">
                <span className="address-type">Nhà</span>
                <span>{address.address}</span>
              </div>
            </>
          ) : (
            <div>
              Không tìm thấy địa chỉ mặc định.{' '}
              <Link href="/addresses">Thêm địa chỉ</Link>
            </div>
          )}
        </div>
        <div className="coupon-info">
          <div className="section-header">
            <h2>Smile Khuyến Mãi</h2>
            <div className="coupon-usage">
              <span>{coupons.length > 0 ? `Đã áp dụng ${coupons.length} mã` : 'Có thể chọn 2'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="info-icon"
                style={{ background: '#ffffff' }}
              >
                <path
                  d="M12.75 11.25C12.75 10.8358 12.4142 10.5 12 10.5C11.5858 10.5 11.25 10.8358 11.25 11.25V15.75C11.25 16.1642 11.5858 16.5 12 16.5C12.4142 16.5 12.75 16.1642 12.75 15.75V11.25Z"
                  fill="var(--maincolor)"
                />
                <path
                  d="M12.75 8.25C12.75 8.66421 12.4142 9 12 9C11.5858 9 11.25 8.66421 11.25 8.25C11.25 7.83579 11.5858 7.5 12 7.5C12.4142 7.5 12.75 7.83579 12.75 8.25Z"
                  fill="var(--maincolor)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12Z"
                  fill="var(--maincolor)"
                />
              </svg>
            </div>
          </div>
          {coupons.length > 0 && (
            <div className="coupon-list">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="coupon-item">
                  <span>Mã: {coupon.code} - Giảm {coupon.discountPercent}%</span>
                  <span className="coupon-remove" onClick={() => handleRemoveCoupon(coupon.code)}>
                    Xóa
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="coupon-input-section">
            <div className="coupon-add" onClick={handleToggleCouponInput}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="coupon-icon"
              >
                <g clipPath="url(#clip0_1392_114948)">
                  <path
                    d="M7.9165 9.16659C8.60686 9.16659 9.1665 8.60694 9.1665 7.91659C9.1665 7.22623 8.60686 6.66659 7.9165 6.66659C7.22615 6.66659 6.6665 7.22623 6.6665 7.91659C6.6665 8.60694 7.22615 9.16659 7.9165 9.16659Z"
                    fill="var(--maincolor)"
                  />
                  <path
                    d="M13.3332 12.0833C13.3332 12.7736 12.7735 13.3333 12.0832 13.3333C11.3928 13.3333 10.8332 12.7736 10.8332 12.0833C10.8332 11.3929 11.3928 10.8333 12.0832 10.8333C12.7735 10.8333 13.3332 11.3929 13.3332 12.0833Z"
                    fill="var(--maincolor)"
                  />
                  <path
                    d="M12.2558 8.92251C12.5812 8.59707 12.5812 8.06943 12.2558 7.744C11.9303 7.41856 11.4027 7.41856 11.0772 7.744L7.74392 11.0773C7.41848 11.4028 7.41848 11.9304 7.74392 12.2558C8.06935 12.5813 8.59699 12.5813 8.92243 12.2558L12.2558 8.92251Z"
                    fill="var(--maincolor)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.33317 3.33325C2.4127 3.33325 1.6665 4.07944 1.6665 4.99992V7.64295C1.6665 7.86396 1.7543 8.07592 1.91058 8.23221L2.49978 8.82141C3.15066 9.47228 3.15066 10.5276 2.49978 11.1784L1.91058 11.7676C1.7543 11.9239 1.6665 12.1359 1.6665 12.3569V14.9999C1.6665 15.9204 2.4127 16.6666 3.33317 16.6666L16.6665 16.6666C17.587 16.6666 18.3332 15.9204 18.3332 14.9999V12.3569C18.3332 12.127 18.2387 11.9125 18.0798 11.7584L17.4998 11.1784C16.8489 10.5276 16.8489 9.47228 17.4998 8.82141L18.0798 8.24143C18.2387 8.08737 18.3332 7.87288 18.3332 7.64295V4.99992C18.3332 4.07945 17.587 3.33325 16.6665 3.33325H3.33317ZM16.3213 12.3569L16.6665 12.7022V14.9999H3.33317V12.7021L3.6783 12.3569C4.98004 11.0552 4.98004 8.94464 3.6783 7.6429L3.33317 7.29777V4.99992L16.6665 4.99992V7.29766L16.3213 7.6429C15.0195 8.94464 15.0195 11.0552 16.3213 12.3569Z"
                    fill="var(--maincolor)"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1392_114948">
                    <rect width="16.6667" height="16.6667" fill="white" transform="translate(1.6665 1.66663)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Chọn hoặc nhập mã khác</span>
              <svg
                className="more"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isCouponInputVisible ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.46967 3.96967C8.76256 3.67678 9.23744 3.67678 9.53033 3.96967L17.0303 11.4697C17.3232 11.7626 17.3232 12.2374 17.0303 12.5303L9.53033 20.0303C9.23744 20.3232 8.76256 20.3232 8.46967 20.0303C8.17678 19.7374 8.17678 19.2626 8.46967 18.9697L15.4393 12L8.46967 5.03033C8.17678 4.73744 8.17678 4.26256 8.46967 3.96967Z"
                  fill="var(--maincolor)"
                />
              </svg>
            </div>
            {isCouponInputVisible && (
              <div className="coupon-input-wrapper">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã khuyến mãi"
                  className="coupon-input"
                  disabled={isApplyingCoupon}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyCoupon();
                    }
                  }}
                />
                <button
                  className="coupon-apply-button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </div>
            )}
            {couponError && <div className="coupon-error">{couponError}</div>}
          </div>
        </div>
        <div className="order-total">
          <ul className="total-list">
            <li className="total-item">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString()}₫</span>
            </li>
            <li className="total-item">
              <span>Giảm giá</span>
              <span>{discount > 0 ? `-${discount.toLocaleString()}₫` : '0₫'}</span>
            </li>
          </ul>
          <div className="total-final">
            <span>Tổng tiền thanh toán</span>
            <div className="total-value">
              {selectedCount === 0 ? (
                <span className="total-empty">Vui lòng chọn sản phẩm</span>
              ) : (
                <>
                  <span className="total-amount">{finalTotal.toLocaleString()}₫</span>
                  <span className="total-note">(Đã bao gồm VAT nếu có)</span>
                </>
              )}
            </div>
          </div>
          <button
            className="checkout-button"
            style={{ background: 'var(--maincolor)' }}
            onClick={handleCheckout}
            disabled={selectedCount === 0}
          >
            Mua Hàng ({selectedCount})
          </button>
        </div>
        <div className="banner-section" style={{ marginTop: '12px' }}>
          <div className="carousel-container" style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              grabCursor={true}
              pagination={{
                el: '.banner-section .swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              className="banner-swiper"
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ height: '100%', borderRadius: '8px', width: '100%' }}>
                      <Link href={banner.href} className="banner-link" rel="nofollow">
                        <picture style={{ width: '100%' }}>
                          <source type="image/webp" srcSet={`${banner.src}.webp`} />
                          <Image
                            src={banner.src}
                            alt={`Banner ${index + 1}`}
                            width={292}
                            height={120}
                            style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                          />
                        </picture>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              className="swiper-button-prev-custom"
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0899 14.5899C11.7645 14.9153 11.2368 14.9153 10.9114 14.5899L5.91139 9.58991C5.58596 9.26447 5.58596 8.73683 5.91139 8.4114L10.9114 3.41139C11.2368 3.08596 11.7645 3.08596 12.0899 3.41139C12.4153 3.73683 12.4153 4.26447 12.0899 4.58991L7.67916 9.00065L12.0899 13.4114C12.4153 13.7368 12.4153 14.2645 12.0899 14.5899Z"
                  fill="#0A68FF"
                />
              </svg>
            </button>
            <button
              className="swiper-button-next-custom"
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                  fill="#0A68FF"
                />
              </svg>
            </button>
            <div
              className="swiper-pagination"
              style={{
                bottom: 'var(--swiper-pagination-bottom, -18px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px',
              }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SummarySidebar;