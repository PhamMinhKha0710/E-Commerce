// src/app/cart/page.tsx
import CartComponent from '@/app/cart_du_phong/CartComponent';
import Breadcrumb from '@/components/sections/Breadcrum';

export const viewport = {
  themeColor: '#ffffff', // Đặt themeColor trong viewport để tránh lỗi
};

export default function CartPage() {
  return (
    <div className="bodywrap">
      <section className="bread-crumb">
        <div className="container">
            <Breadcrumb items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Sản phẩm", href: "/products" },
                    { label: "Giỏ hàng", isActive: true }
            ]} />
        </div>
      </section>
      <CartComponent />
    </div>
  );
}