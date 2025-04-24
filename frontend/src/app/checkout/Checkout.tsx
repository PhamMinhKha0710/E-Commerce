"use client";

import styles from './Checkout.module.css';
import ShippingPackage from './ShippingPackage';
import AddCardModal from './AddcardModal';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
  subLabel?: string;
  checked?: boolean;
}

interface Coupon {
  code: string;
  discount: string;
  image?: string;
}

interface Banner {
  url: string;
  image: string;
}

interface PaymentOffer {
  title: string;
  subtitle: string;
  condition: string;
  image?: string;
}

interface Bank {
  name: string;
  image: string;
  alt: string;
}

interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  currency: string;
  hasVariations: boolean;
  productItemId: number | null;
}

interface AddressType {
  id: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

const paymentMethods: PaymentMethod[] = [
  { value: 'cod', label: 'Thanh toán tiền mặt', icon: 'https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png' },
  { value: 'viettelpay', label: 'Viettel Money', icon: 'https://salt.tikicdn.com/ts/upload/5f/f9/75/d7ac8660aae903818dd7da8e4772e145.png' },
  { value: 'momo', label: 'Ví Momo', icon: 'https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg' },
  { value: 'zalopay', label: 'Ví ZaloPay', icon: 'https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png' },
  { value: 'vnpay', label: 'VNPAY', subLabel: 'Quét Mã QR từ ứng dụng ngân hàng', icon: 'https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png' },
  { value: 'cybersource', label: 'Thẻ tín dụng/ Ghi nợ', icon: 'https://salt.tikicdn.com/ts/upload/7e/48/50/7fb406156d0827b736cf0fe66c90ed78.png', checked: true },
];

const atmMethod: PaymentMethod = {
  value: 'pay123',
  label: 'Thẻ ATM',
  subLabel: 'Hỗ trợ Internet Banking',
  icon: 'https://salt.tikicdn.com/ts/upload/de/61/37/aa26390d87be2ae0d5f1051ce59b3b90.png',
};

const banks: Bank[] = [
  { name: 'keb_hana_hn', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/6d/51/a1/32f7b785271389cd593aa7a2f06d243f.png', alt: 'Keb Hana HN' },
  { name: 'vietcredit', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/0e/25/a5/e819242167b68072019e2d005e9b1957.png', alt: 'VietCredit' },
  { name: 'keb_hana_hcm', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/9b/f1/37/c41bbeea6c1af2db0bc27c4ef261578c.png', alt: 'Keb Hana HCM' },
  { name: 'uob', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/7a/57/98/8dc8a1e34940efaf9c42834c10ee4575.png', alt: 'UOB' },
  { name: 'vietbank', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/7a/8d/f7/6a835a269ed30c32a83f4493a092a413.png', alt: 'Vietbank' },
  { name: 'mirae_asset', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/8d/83/55/3c3dd2cad0b895deee6b0bd2dcda70ed.png', alt: 'Mirae Asset' },
  { name: 'indovina', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/a1/e0/ce/7e7e782b8bca4e54ea77a22000723089.png', alt: 'Indovina' },
  { name: 'wooribank', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/0d/a4/3e/b9cdbfd3fa83d15fb7e2622302484cbe.jpg', alt: 'Wooribank' },
  { name: 'shinhanbank', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/cf/e7/cf/1a8e6a52b58a29da91b96a01f0c2b779.png', alt: 'ShinhanBank' },
  { name: 'sacombank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/SCB.png', alt: 'Sacombank' },
  { name: 'vib', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VIB.png', alt: 'VIB' },
  { name: 'vpbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VPB.png', alt: 'VPBank' },
  { name: 'tpbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/TPB.png', alt: 'TPBank' },
  { name: 'scb', image: 'https://salt.tikicdn.com/cache/w160/ts/upload/3e/14/63/1ad7660d2088ca2b2d56e8fccb7f07c4.png', alt: 'SCB' },
  { name: 'maritime_bank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/MSB.png', alt: 'Maritime Bank' },
  { name: 'acb', image: 'https://salt.tikicdn.com/desktop/img/new-bank/ACB.png', alt: 'ACB' },
  { name: 'seabank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/SEAB.png', alt: 'SeABank' },
  { name: 'kienlongbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/KLB.png', alt: 'KienLongBank' },
  { name: 'pvcombank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/PVCB.png', alt: 'PVComBank' },
  { name: 'abbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/ABB.png', alt: 'ABBank' },
  { name: 'bidv', image: 'https://salt.tikicdn.com/desktop/img/new-bank/BIDV.png', alt: 'BIDV' },
  { name: 'oceanbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/OJB.png', alt: 'Oceanbank' },
  { name: 'vrb', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VRB.png', alt: 'VRB' },
  { name: 'hdbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/HDB.png', alt: 'HDBank' },
  { name: 'shb', image: 'https://salt.tikicdn.com/desktop/img/new-bank/SHB.png', alt: 'SHB' },
  { name: 'public_bank_vn', image: 'https://salt.tikicdn.com/desktop/img/new-bank/PBVN.png', alt: 'PublicBankVietNam' },
  { name: 'mbbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/MB.png', alt: 'MBBank' },
  { name: 'eximbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/EIB.png', alt: 'Eximbank' },
  { name: 'ban_viet', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VCCB.png', alt: 'Bản Việt' },
  { name: 'donga_bank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/DAB.png', alt: 'DongA Bank' },
  { name: 'bac_a_bank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/NASB.png', alt: 'BAC A BANK' },
  { name: 'pg_bank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/PGB.png', alt: 'PG Bank' },
  { name: 'ncb', image: 'https://salt.tikicdn.com/desktop/img/new-bank/NCB.png', alt: 'NCB' },
  { name: 'nam_a_bank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/NAB.png', alt: 'Nam A Bank' },
  { name: 'baovietbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/BVB.png', alt: 'BaoVietBank' },
  { name: 'saigonbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/SGB.png', alt: 'SAIGONBANK' },
  { name: 'techcombank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/TCB.png', alt: 'Techcombank' },
  { name: 'agribank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VARB.png', alt: 'Agribank' },
  { name: 'vietcombank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VCB.png', alt: 'Vietcombank' },
  { name: 'vietabank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/VAB.png', alt: 'VietABank' },
  { name: 'gpbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/GPB.png', alt: 'GPBank' },
  { name: 'lienvietpostbank', image: 'https://salt.tikicdn.com/desktop/img/new-bank/LPB.png', alt: 'LienVietPostBank' },
];

const coupons: Coupon[] = [
  {
    code: 'XTRA2470QCC0',
    discount: 'Giảm 70K',
    image: 'https://salt.tikicdn.com/cache/128x128/ts/upload/11/b7/94/0ea7a1742603abb1f645e0147fe1dd17.jpg',
  },
];

const paymentOffers: PaymentOffer[] = [
  { title: 'Freeship', subtitle: 'Thẻ Shinhan Platinum', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Freeship', subtitle: 'Thẻ Shinhan Classic', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 30k', subtitle: 'Đơn từ 200k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 50k', subtitle: 'Đơn từ 300k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 50k', subtitle: 'Đơn từ 300k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 70k', subtitle: 'Đơn từ 500k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 100k', subtitle: 'Đơn từ 700k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 150k', subtitle: 'Đơn từ 1 triệu', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 30k', subtitle: 'Đơn từ 200k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 50k', subtitle: 'Đơn từ 300k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Giảm 70k', subtitle: 'Đơn từ 500k', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
  { title: 'Freeship', subtitle: 'SMILECARD', condition: 'Không giới hạn', image: 'https://salt.tikicdn.com/cache/w144/ts/upload/82/7e/9c/71b1c0645d326924f53c6329ecd2bf2a.png.webp' },
];

const banners: Banner[] = [
  { url: 'https://tiki.vn/khuyen-mai/cong-nghe-gia-hoi', image: 'https://salt.tikicdn.com/cache/w720/ts/tka/7f/0b/d3/95916a0bd08a84d64206ce6ef9e72010.png' },
  { url: 'https://tiki.vn/khuyen-mai/dien-tu-dien-gia-dung-dien-lanh', image: 'https://salt.tikicdn.com/cache/w720/ts/tka/99/ce/6a/9c0a7990ddba5207da7cc37b85bdc2f0.png' },
  { url: 'https://tiki.vn/khuyen-mai/top-dien-thoai-may-tinh-bang', image: 'https://salt.tikicdn.com/cache/w720/ts/tka/a9/ec/4f/e95b916999b2dd40b3a8e2af30e704e8.png' },
  { url: 'https://tiki.vn/khuyen-mai/xe-phu-kien-sieu-sale', image: 'https://salt.tikicdn.com/cache/w720/ts/tka/45/7b/70/fb7c0e1414d55ae6ea43af2883f2d842.png' },
  { url: 'https://tiki.vn/khuyen-mai/hang-nhap-khau-chinh-hang', image: 'https://salt.tikicdn.com/cache/w720/ts/tka/46/b7/ac/46f02024b577c3e3a825a0c955bda0ea.png' },
];

export default function Checkout() {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cybersource');
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<AddressType | null>(null);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const { cart } = useCart();
  const router = useRouter();

  // Load checkout items from localStorage or CartContext
  useEffect(() => {
    const loadCheckoutItems = () => {
      setLoading(true);
      try {
        // Read selectedCartItems from localStorage
        const savedItems = localStorage.getItem('selectedCartItems');
        if (savedItems) {
          const items = JSON.parse(savedItems) as CartItem[];
          // Validate items
          if (!items.every(item => typeof item.price === 'number' && typeof item.quantity === 'number' && item.price >= 0 && item.quantity > 0)) {
            throw new Error('Dữ liệu sản phẩm không hợp lệ.');
          }
          setCheckoutItems(items);
          console.log('Loaded checkoutItems:', items); // Debug
          setLoading(false);
          return;
        }

        // Fallback: Use selectedItems (array of indices) and CartContext
        const selectedIndices = JSON.parse(localStorage.getItem('selectedItems') || '[]') as number[];
        if (selectedIndices.length === 0) {
          toast.error("Không có sản phẩm nào để thanh toán!");
          router.push('/cart');
          return;
        }

        // Get cart from localStorage or CartContext
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
        if (cartItems.length === 0) {
          toast.error("Giỏ hàng trống!");
          router.push('/cart');
          return;
        }

        // Filter cart items based on selectedIndices
        const items = selectedIndices
          .filter(index => index >= 0 && index < cartItems.length) // Ensure valid indices
          .map(index => ({
            productId: cartItems[index].productId,
            productName: cartItems[index].productName,
            imageUrl: cartItems[index].imageUrl,
            price: cartItems[index].price,
            quantity: cartItems[index].quantity,
            currency: cartItems[index].currency || 'VND',
            hasVariations: cartItems[index].hasVariations,
            productItemId: cartItems[index].productItemId,
          }));

        if (items.length === 0) {
          toast.error("Không tìm thấy sản phẩm được chọn trong giỏ hàng!");
          router.push('/cart');
          return;
        }

        // Validate items
        if (!items.every(item => typeof item.price === 'number' && typeof item.quantity === 'number' && item.price >= 0 && item.quantity > 0)) {
          throw new Error('Dữ liệu sản phẩm không hợp lệ.');
        }

        setCheckoutItems(items);
        localStorage.setItem('selectedCartItems', JSON.stringify(items));
        console.log('Reconstructed checkoutItems:', items); // Debug
      } catch (error) {
        toast.error("Lỗi khi tải danh sách sản phẩm!");
        console.error("Error loading checkout items:", error);
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutItems();
  }, [cart, router]);

  // Fetch default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!isLoggedIn) {
        setAddressError('Vui lòng đăng nhập để xem địa chỉ mặc định.');
        setLoadingAddress(false);
        return;
      }

      setLoadingAddress(true);
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
          setAddressError(null);
        } else if (response.status === 401) {
          setAddressError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setAddress(null);
        } else if (response.status === 404) {
          setAddressError('Không tìm thấy địa chỉ mặc định.');
          setAddress(null);
        } else {
          throw new Error('Lỗi khi lấy địa chỉ mặc định.');
        }
      } catch {
        setAddressError('Lỗi khi lấy địa chỉ mặc định.');
        setAddress(null);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchDefaultAddress();
  }, [isLoggedIn]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName);
  };

  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
    if (value !== 'pay123') {
      setSelectedBank(null);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      toast.error("Không có sản phẩm để thanh toán!");
      return;
    }

    if (!address) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      router.push('/address');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Vui lòng đăng nhập để thanh toán!');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:5130/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: checkoutItems,
          paymentMethod: selectedPaymentMethod,
          bank: selectedBank,
          addressId: address.id,
        }),
      });

      if (response.status === 401) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        router.push('/auth/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Không thể tạo đơn hàng');
      }

      const { orderId } = await response.json();

      // Clear localStorage after successful order
      localStorage.removeItem('selectedItems');
      localStorage.removeItem('selectedCartItems');

      toast.success('Đặt hàng thành công!');
      router.push(`/order/success?orderId=${orderId}`);
    } catch (error) {
      toast.error('Không thể đặt hàng!');
      console.error('Error creating order:', error);
    }
  };

  // Calculate totals
  const totalPrice = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 32200; // Hardcode
  const discount = 32200; // Hardcode, set to 32,000 VNĐ as requested
  const finalTotal = totalPrice + shippingFee - discount;

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Left Section */}
        <div className={styles.left}>
          {/* Shipping Method Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Chọn hình thức giao hàng</h3>
            <div className={styles.shippingMethod}>
              <label className={styles.radioLabel}>
                <input type="radio" name="shipping-method" value="1" defaultChecked />
                <span className={styles.radioFake}></span>
                <span className={styles.label}>
                  <div className={styles.methodText}>
                    <span>Giao tiết kiệm</span>
                    <span className={styles.freeshipBadge}>-32K</span>
                  </div>
                </span>
              </label>
            </div>
            <ShippingPackage
              deliveryDate="Giao thứ 7, trước 19h, 19/04"
              method="Giao tiết kiệm"
              originalFee="32.200 ₫"
              currentFee="MIỄN PHÍ"
              items={checkoutItems.map(item => ({
                image: item.imageUrl,
                name: item.productName,
                quantity: item.quantity,
                price: `${item.price.toLocaleString()} ₫`,
              }))}
              fulfillmentText="Được giao bởi SmileNOW Smart Logistics (giao từ Hồ Chí Minh)"
            />
          </div>

          {/* Payment Method Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Chọn hình thức thanh toán</h3>
            <div className={styles.paymentMethods}>
              {paymentMethods.map((method: PaymentMethod) => (
                <label key={method.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.value}
                    checked={selectedPaymentMethod === method.value}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  />
                  <span className={styles.radioFake}></span>
                  <span className={styles.label}>
                    <div className={styles.method}>
                      <Image
                        src={method.icon}
                        alt={method.label}
                        width={32}
                        height={32}
                        className={styles.methodIcon}
                      />
                      <div className={styles.methodContent}>
                        <span>{method.label}</span>
                        {method.subLabel && <span className={styles.subLabel}>{method.subLabel}</span>}
                      </div>
                    </div>
                  </span>
                </label>
              ))}
              <div className={styles.addCard}>
                <button className={styles.addCardButton} onClick={handleOpenModal}>
                  <Image
                    src="https://salt.tikicdn.com/ts/upload/3d/7e/67/f7b262cbc0a48e658a83ec37ffee2148.png"
                    alt="add"
                    width={24}
                    height={24}
                    className={styles.addIcon}
                  />
                  <span>Thêm thẻ mới</span>
                </button>
              </div>
              <div className={styles.paymentOffers}>
                <div className={styles.offerTitle}>
                  <Image
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icons-promotion-outline.svg"
                    alt="promotion"
                    width={20}
                    height={20}
                    className={styles.offerIcon}
                  />
                  Ưu đãi thanh toán thẻ
                </div>
                <div className={styles.offerList}>
                  {paymentOffers.map((offer: PaymentOffer, index: number) => (
                    <div key={index} className={styles.offerItem}>
                      <div className={styles.offerLeft}>
                        <span className={`${styles.offerLabel} ${offer.title.includes('Giảm') ? styles.orange : ''}`}>
                          {offer.title}
                        </span>
                        <div className={styles.offerRight}>
                          <span>{offer.subtitle}</span>
                          <span className={styles.offerCondition}>{offer.condition}</span>
                        </div>
                      </div>
                      {offer.image && (
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          width={72}
                          height={30}
                          className={styles.offerImage}
                        />
                      )}
                      <svg
                        style={{
                          position: 'absolute',
                          top: '30px',
                          right: '10px',
                        }}
                        className={styles.infoIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 13.5C4.96 13.5 2.5 11.04 2.5 8C2.5 4.96 4.96 2.5 8 2.5C11.04 2.5 13.5 4.96 13.5 8C13.5 11.04 11.04 13.5 8 13.5Z"
                          fill="#0A68FF"
                        />
                        <path
                          d="M8 7.5C7.72 7.5 7.5 7.72 7.5 8V10C7.5 10.28 7.72 10.5 8 10.5C8.28 10.5 8.5 10.28 8.5 10V8C8.5 7.72 8.28 7.5 8 7.5Z"
                          fill="#0A68FF"
                        />
                        <path
                          d="M8 5.5C8.28 5.5 8.5 5.72 8.5 6C8.5 6.28 8.28 6.5 8 6.5C7.72 6.5 7.5 6.28 7.5 6C7.5 5.72 7.72 5.5 8 5.5Z"
                          fill="#0A68FF"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
              {/* Thẻ ATM */}
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="payment-method"
                  value={atmMethod.value}
                  checked={selectedPaymentMethod === atmMethod.value}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <span className={styles.radioFake}></span>
                <span className={styles.label}>
                  <div className={styles.method}>
                    <Image
                      src={atmMethod.icon}
                      alt={atmMethod.label}
                      width={32}
                      height={32}
                      className={styles.methodIcon}
                    />
                    <div className={styles.methodContent}>
                      <span>{atmMethod.label}</span>
                      {atmMethod.subLabel && <span className={styles.subLabel}>{atmMethod.subLabel}</span>}
                    </div>
                  </div>
                </span>
              </label>
              {/* Danh sách ngân hàng với hiệu ứng slide */}
              <div
                className={`${styles.bankSelection} ${
                  selectedPaymentMethod === 'pay123' ? styles.show : styles.hide
                }`}
              >
                <div className={styles.bankList}>
                  {banks.map((bank: Bank) => (
                    <label key={bank.name} className={styles.bankItem} style={{ background: '#fff' }}>
                      <input
                        type="radio"
                        name="bank-selection"
                        value={bank.name}
                        checked={selectedBank === bank.name}
                        onChange={() => handleBankSelect(bank.name)}
                        style={{ display: 'none' }}
                      />
                      <div className={styles.bankContent}>
                        {selectedBank === bank.name && (
                          <Image
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icons-info-outlined-success.svg"
                            alt="selected"
                            width={20}
                            height={20}
                            className={styles.checkedIcon}
                          />
                        )}
                        <Image
                          src={bank.image}
                          alt={bank.alt}
                          width={80}
                          height={53}
                          className={styles.bankImage}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          {/* Delivery Info */}
          <div style={{ position: 'sticky', top: '0px' }}>
            <div className={styles.deliveryInfo}>
              <div className={styles.blockHeader}>
                <h3>Giao tới</h3>
                <a href="/address">Thay đổi</a>
              </div>
              {loadingAddress ? (
                <div>Đang tải địa chỉ...</div>
              ) : addressError ? (
                <div className={styles.error}>{addressError}</div>
              ) : address ? (
                <>
                  <div className={styles.customerInfo}>
                    <p>{address.name}</p>
                    <p>{address.phone}</p>
                  </div>
                  <div className={styles.address}>
                    <span className={styles.addressType}>Nhà</span>
                    {address.address}
                  </div>
                </>
              ) : (
                <div>
                  Không tìm thấy địa chỉ mặc định.{' '}
                  <Link href="/addresses">Thêm địa chỉ</Link>
                </div>
              )}
            </div>

            {/* Coupons Section */}
            <div className={styles.couponSection}>
              <div className={styles.blockHeader}>
                <h3>Smile-Mart Khuyến Mãi</h3>
                <span>Có thể chọn 2</span>
              </div>
              <div className={styles.couponList}>
                {coupons.map((coupon: Coupon) => (
                  <div key={coupon.code} className={styles.coupon}>
                    <div className={styles.couponWrapper} style={{ position: 'relative' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 456 60"
                        width="456"
                        height="60"
                        preserveAspectRatio="none"
                        className={styles.couponBg}
                      >
                        <g fill="none" fillRule="evenodd">
                          <g stroke="#017FFF">
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <g>
                                      <path
                                        fill="#E5F2FF"
                                        d="M 443.412 0.5 c 2.071 0 3.946 0.84 5.303 2.197 c 1.358 1.357 2.197 3.232 2.197 5.303 h 0 v 44 c 0 2.071 -0.84 3.946 -2.197 5.303 c -1.357 1.358 -3.232 2.197 -5.303 2.197 h 0 H 103.531 c -0.116 -1.043 -0.587 -1.978 -1.291 -2.682 c -0.814 -0.814 -1.94 -1.318 -3.182 -1.318 c -1.243 0 -2.368 0.504 -3.182 1.318 c -0.704 0.704 -1.175 1.64 -1.29 2.682 h 0 h -48.028 c -2.071 0 -3.946 -0.84 -5.303 -2.197 c -1.358 -1.357 -2.197 -3.232 -2.197 -5.303 h 0 V 8 c 0 -2.071 0.84 -3.946 2.197 -5.303 c 1.357 -1.358 3.232 -2.197 5.303 -2.197 h 48.027 c 0.116 1.043 0.587 1.978 1.291 2.682 c 0.814 0.814 1.94 1.318 3.182 1.318 c 1.243 0 2.368 -0.504 3.182 -1.318 c 0.704 -0.704 1.175 -1.64 1.29 -2.682 H 103.530 z"
                                        transform="translate(-1024 -2912) translate(80 2252) translate(0 460) translate(464) translate(480) translate(0 200)"
                                      />
                                      <g strokeDasharray="2 4" strokeLinecap="square">
                                        <path
                                          d="M0.5 0L0.5 48"
                                          transform="translate(-1024 -2912) translate(80 2252) translate(0 460) translate(464) translate(480) translate(0 200) translate(115.608 8)"
                                        />
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <div className={styles.couponContent}>
                        {coupon.image && (
                          <div className={styles.couponImageWrapper}>
                            <Image
                              src={coupon.image}
                              alt="Coupon Logo"
                              width={32}
                              height={32}
                              className={styles.couponImage}
                            />
                          </div>
                        )}
                        <h4 className={styles.couponDiscount}>{coupon.discount}</h4>
                        <div className={styles.couponActions}>
                          <button className={styles.couponInfoButton}>
                            <Image
                              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%20%20%20%20%3Cdefs%3E%20%20%20%20%20%20%20%20%3Cpath%20id%3D%224gg7gqe5ua%22%20d%3D%22M8.333%200C3.738%200%200%203.738%200%208.333c0%204.595%203.738%208.334%208.333%208.334%204.595%200%208.334-3.739%208.334-8.334S12.928%200%208.333%200zm0%201.026c4.03%200%207.308%203.278%207.308%207.307%200%204.03-3.278%207.308-7.308%207.308-4.03%200-7.307-3.278-7.307-7.308%200-4.03%203.278-7.307%207.307-7.307zm.096%206.241c-.283%200-.512.23-.512.513v4.359c0%20.283.23.513.512.513.284%200%20.513-.23.513-.513V7.78c0-.283-.23-.513-.513-.513zm.037-3.114c-.474%200-.858.384-.858.858%200%20.473.384.857.858.857s.858-.384.858-.857c0-.474-.384-.858-.858-.858z%22%2F%3E%20%20%20%20%3C%2Fdefs%3E%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-2808%20-4528%29%20translate%282708%2080%29%20translate%2852%204304%29%20translate%2848%20144%29%20translate%281.667%201.667%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23017FFF%22%20xlink%3Ahref%3D%22%234gg7gqe5ua%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%3C%2Fg%3E%3C%2Fsvg%3E"
                              alt="info-icon"
                              width={16}
                              height={16}
                              className={styles.couponInfoIcon}
                            />
                          </button>
                          <button className={styles.couponButton}>Bỏ Chọn</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className={styles.couponMore}>
                  <span>Chọn hoặc nhập mã khác</span>
                  <svg
                    className={styles.couponMoreIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.46967 3.96967C8.76256 3.67678 9.23744 3.67678 9.53033 3.96967L17.0303 11.4697C17.3232 11.7626 17.3232 12.2374 17.0303 12.5303L9.53033 20.0303C9.23744 20.3232 8.76256 20.3232 8.46967 20.0303C8.17678 19.7374 8.17678 19.2626 8.46967 18.9697L15.4393 12L8.46967 5.03033C8.17678 4.73744 8.17678 4.26256 8.46967 3.96967Z"
                      fill="#0A68FF"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <div className={styles.blockHeader}>
                <h3>Đơn hàng</h3>
                <a href="/cart">Thay đổi</a>
              </div>
              <div className={styles.orderDetails}>
                <p>{checkoutItems.length} sản phẩm.</p>
              </div>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Tổng tiền hàng</span>
                  <span>{totalPrice.toLocaleString()} ₫</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString()} ₫</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Giảm giá vận chuyển</span>
                  <span className={styles.positive}>-{discount.toLocaleString()} ₫</span>
                </div>
                <div className={styles.total}>
                  <span>Tổng tiền thanh toán</span>
                  <div>
                    <span className={styles.totalAmount}>{finalTotal.toLocaleString()} ₫</span>
                    <span className={styles.saving}>Tiết kiệm {discount.toLocaleString()} ₫</span>
                  </div>
                </div>
                <div className={styles.additionalText}>
                  (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát sinh khác)
                </div>
              </div>
              <button className={styles.placeOrder} onClick={handlePlaceOrder}>
                Đặt hàng
              </button>
            </div>

            {/* Banners */}
            <div className={styles.banners}>
              <div className={styles.bannerSlider}>
                {banners.map((banner: Banner, index: number) => (
                  <a key={index} href={banner.url} className={styles.bannerLink}>
                    <Image
                      src={banner.image}
                      alt={`Banner ${index + 1}`}
                      width={320}
                      height={100}
                      className={styles.bannerImage}
                    />
                  </a>
                ))}
              </div>
              <div className={styles.pagination}>
                {banners.map((_, index: number) => (
                  <div
                    key={index}
                    className={index === banners.length - 1 ? styles.activeDot : styles.dot}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCardModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}