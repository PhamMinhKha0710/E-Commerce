"use client";

import Image from 'next/image';
import CartItem from './CartItem';
import SummarySidebar from './SummarySidebar';
import RelatedProducts from './RelatedProduct';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

// Define the type for cart items in localStorage
interface CartItemFromStorage {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  currency: string;
  hasVariations: boolean;
  productItemId: number | null;
}

// Define the type for cart items in component
interface CartItemType {
  id: number;
  seller: string;
  name: string;
  price: number;
  quantity: number;
  available: boolean;
  delivery: string;
  image: string;
  key: string;
  productItemId: number | null;
}

// Define the type for related products
interface RelatedProductType {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  delivery: string;
  image: string;
}

// Hardcode danh sách seller và delivery để sử dụng mặc định
const defaultSellers = [
  'Hiệu Sách Tự Do',
  'Phụ tùng phụ kiện Thuận Macsim',
  'Kingbason Vua túi chống sốc Laptop',
];

const defaultDeliveries = [
  'Giao ngày mai',
  'Giao thứ 4, 23/04',
  'Giao thứ 5, 24/04',
];

// Dữ liệu relatedProducts
const relatedProducts: RelatedProductType[] = [
  {
    id: 1,
    name: 'Miếng lót, Đệm Lót Khủy Tay dày 8mm - Gối Tập Yoga, Đệm PAD Cao Su Hỗ Trợ Giảm Đau Đầu Gối và Các Tư Thế YOGA',
    price: 31500,
    originalPrice: 60000,
    delivery: 'Giao chiều mai',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/6e/c1/ab/72627c051ca586d4b79accb78aec8ced.jpg.webp',
  },
  {
    id: 2,
    name: 'Bút Sơn Vẽ Sáng Tạo TOYO SA-101',
    price: 19000,
    originalPrice: null,
    delivery: 'Giao thứ 3, 22/04',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/12/fb/71/9373729fb3fd00e58f1420ab34a149aa.jpg.webp',
  },
  {
    id: 3,
    name: 'Con Lăn Massage Tập Gym, Yoga, Thể Hình - Gậy tập thẳng lưng, vai, gậy chống gù lưng, gậy tập yoga gậy chống gù lưng tập yoga bằng thép không gỉ(hàng nhập khẩu)',
    price: 36900,
    originalPrice: 79000,
    delivery: 'Giao chiều mai',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/6e/c1/ab/72627c051ca586d4b79accb78aec8ced.jpg.webp',
  },
  {
    id: 4,
    name: 'Chổi vẽ màu acrylic, sơn tường, màu 3d tranh vẽ các loại nhiều size - A32',
    price: 8900,
    originalPrice: null,
    delivery: 'Giao thứ 4, 23/04',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/9e/a6/0a/2d5efd2af311a010accf8e1e02943d3d.jpg.webp',
  },
  {
    id: 5,
    name: 'BG Bơm bóng cầm tay mini - Dụng cụ bơm bóng Yoga (hàng nhập khẩu)',
    price: 22500,
    originalPrice: 45000,
    delivery: 'Giao chiều mai',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/9e/52/14/ebdedca135591395cfbeefd5f3e788ae.png.webp',
  },
  {
    id: 6,
    name: 'Gạch Tập Yoga Cao Cấp miDoctor (Gối Tập Yoga)',
    price: 39000,
    originalPrice: null,
    delivery: 'Giao thứ 4, 23/04',
    image: 'https://salt.tikicdn.com/cache/750x750/ts/product/9e/52/14/ebdedca135591395cfbeefd5f3e788ae.png.webp',
  },
];

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, error } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cartItemsState, setCartItemsState] = useState<CartItemType[]>([]);

  // Kiểm tra trạng thái đăng nhập và chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', pathname);
      router.push('/auth/login');
    }
  }, [isLoggedIn, router, pathname]);

  // Đồng bộ cartItemsState với cart
  useEffect(() => {
    if (isLoggedIn) {
      const updatedCartItemsState = cart.map((item: CartItemFromStorage) => ({
        id: item.productId,
        key: `${item.productId}-${item.productItemId ?? 'no-variation'}`,
        seller: defaultSellers[Math.floor(Math.random() * defaultSellers.length)],
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        available: true,
        delivery: defaultDeliveries[Math.floor(Math.random() * defaultDeliveries.length)],
        image: item.imageUrl || 'https://salt.tikicdn.com/cache/280x280/ts/product/38/1b/03/7fc03405d21adb0186acfad5321c0788.jpg.webp',
        productItemId: item.productItemId,
      }));
      setCartItemsState(updatedCartItemsState);
      // Reset selectedItems nếu cart thay đổi để tránh chỉ số không hợp lệ
      setSelectedItems([]);
      localStorage.setItem('selectedItems', JSON.stringify([]));
    }
  }, [cart, isLoggedIn]);

  // Lấy selectedItems từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedSelectedItems = localStorage.getItem('selectedItems');
      if (storedSelectedItems) {
        const parsedItems = JSON.parse(storedSelectedItems);
        if (Array.isArray(parsedItems)) {
          // Chỉ giữ các chỉ số hợp lệ (nhỏ hơn độ dài cartItemsState)
          setSelectedItems(parsedItems.filter((index: number) => index >= 0 && index < cartItemsState.length));
        }
      }
    } catch (err) {
      console.error('Error parsing selectedItems from localStorage:', err);
    }
  }, [cartItemsState.length]);

  // Lưu selectedItems vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    } catch (err) {
      console.error('Error saving selectedItems to localStorage:', err);
    }
  }, [selectedItems]);

  const handleSelectAll = () => {
    if (selectedItems.length === cartItemsState.filter(item => item.available).length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItemsState
        .map((item, index) => (item.available ? index : -1))
        .filter(index => index !== -1));
    }
  };

  const handleSelectItem = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(itemIndex => itemIndex !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleUpdateQuantity = (id: number, change: number, productItemId: number | null) => {
    const item = cartItemsState.find(item => item.id === id);
    if (item && item.available) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity, productItemId);
    }
  };

  const handleDelete = (index: number) => {
    const item = cartItemsState[index];
    if (item) {
      removeFromCart(item.id, item.productItemId ?? null);
      setSelectedItems(selectedItems
        .filter(itemIndex => itemIndex !== index)
        .map(itemIndex => (itemIndex > index ? itemIndex - 1 : itemIndex)));
    }
  };

  if (!isLoggedIn) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Đang chuyển hướng đến trang đăng nhập...</div>;
  }

  return (
    <div className="container" style={{ display: 'flex', flexWrap: 'wrap' }}>
      <style jsx>{`
        .container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 16px;
        }
        .checkout-main {
          flex: 0 0 75%;
          max-width: 75%;
          padding-right: 16px;
        }
        .summary-sidebar {
          flex: 0 0 25%;
          max-width: 25%;
          position: sticky;
          top: 16px;
          align-self: flex-start;
        }
        .cart-header {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .cart-header .checkbox-label {
          flex: 0 0 35%;
          max-width: 35%;
          display: flex;
          align-items: center;
        }
        .cart-header .header-text:nth-child(2) {
          flex: 0 0 25%;
          max-width: 25%;
          padding-right: 10px;
          text-align: center;
        }
        .cart-header .header-text:nth-child(3) {
          flex: 0 0 13%;
          max-width: 13%;
          text-align: center;
        }
        .cart-header .header-text:nth-child(4) {
          flex: 0 0 24%;
          max-width: 24%;
          text-align: center;
          padding-left: 20px;
        }
        .cart-header .delete-all {
          flex: 0 0 3%;
          max-width: 3%;
          text-align: center;
          cursor: pointer;
        }
        .checkbox-fake {
          width: 16px;
          height: 16px;
          border: 1px solid #ccc;
          border-radius: 3px;
          display: inline-block;
          margin-right: 8px;
          position: relative;
          cursor: pointer;
        }
        .checkbox-fake.selected::after {
          content: '✔';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--maincolor);
          font-size: 12px;
        }
        @media (max-width: 768px) {
          .checkout-main {
            flex: 0 0 100%;
            max-width: 100%;
            padding-right: 0;
          }
          .summary-sidebar {
            flex: 0 0 100%;
            max-width: 100%;
            position: static;
          }
          .cart-header .checkbox-label {
            flex: 0 0 40%;
            max-width: 40%;
          }
          .cart-header .header-text:nth-child(2) {
            flex: 0 0 20%;
            max-width: 20%;
          }
          .cart-header .header-text:nth-child(3) {
            flex: 0 0 20%;
            max-width: 20%;
          }
          .cart-header .header-text:nth-child(4) {
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
      `}</style>
      <h1 className="checkout-title">Giỏ Hàng</h1>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <div className="checkout-main col-9">
          <div className="cart-section">
            <div className="cart-header">
              <label className="checkbox-label">
                <span
                  className={`checkbox-fake ${selectedItems.length === cartItemsState.filter(item => item.available).length && cartItemsState.length > 0 ? 'selected' : ''}`}
                  onClick={handleSelectAll}
                />
                <span className="label-text">Tất cả ({cartItemsState.length} sản phẩm)</span>
              </label>
              <span className="header-text">Đơn giá</span>
              <span className="header-text">Số lượng</span>
              <span className="header-text">Thành tiền</span>
              <Image
                src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg"
                alt="Delete all"
                width={20}
                height={20}
                className="delete-all"
                onClick={() => {
                  cart.forEach(item => removeFromCart(item.productId, item.productItemId ?? null));
                  setSelectedItems([]);
                }}
              />
            </div>
            {cartItemsState.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Giỏ hàng của bạn đang trống.</div>
            ) : (
              cartItemsState.map((item, index) => (
                <CartItem
                  key={item.key}
                  item={item}
                  isSelected={selectedItems.includes(index)}
                  onSelect={() => handleSelectItem(index)}
                  updateQuantity={handleUpdateQuantity}
                  onDelete={() => handleDelete(index)}
                />
              ))
            )}
            <div className="freeship-banner">
              <Image
                src="https://salt.tikicdn.com/ts/upload/f7/85/80/51da5722c3cfa1d6d93644188d07c51a.png"
                alt="Freeship"
                width={79}
                height={16}
                className="freeship-icon"
              />
              <span style={{ color: '#27272A' }}>
                FREESHIP XTRA Freeship 15k đơn từ 45k, Freeship 70k đơn từ 100k
              </span>
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
          <RelatedProducts products={relatedProducts} />
        </div>
        <SummarySidebar selectedItems={selectedItems} cartItems={cartItemsState} />
      </div>
    </div>
  );
}