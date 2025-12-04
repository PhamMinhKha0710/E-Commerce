"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './WishlistNotification.css';

interface WishlistNotificationProps {
  show: boolean;
  onClose: () => void;
  productCount?: number;
}

const WishlistNotification: React.FC<WishlistNotificationProps> = ({
  show,
  onClose,
  productCount = 1,
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Tự động đóng sau 5 giây
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Đợi animation hoàn thành
  };

  const handleClick = () => {
    router.push('/yeu-thich');
    handleClose();
  };

  if (!show) return null;

  return (
    <div
      className={`wishlist-notification ${isVisible ? 'show' : ''}`}
      onClick={handleClick}
    >
      <div className="wishlist-notification-content">
        <div className="wishlist-notification-text">
          <strong>Tuyệt vời!</strong>
          <br />
          Bạn vừa thêm {productCount} sản phẩm vào mục yêu thích thành công{' '}
          <span className="wishlist-notification-link">bấm vào đây để tới trang yêu thích</span>
        </div>
        <button
          className="wishlist-notification-close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default WishlistNotification;

