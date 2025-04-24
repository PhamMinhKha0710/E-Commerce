"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface CartItemProps {
  item: {
    id: number;
    seller: string;
    name: string;
    price: number;
    quantity: number;
    available: boolean;
    delivery: string;
    image: string;
    productItemId: number | null;
  };
  isSelected: boolean;
  onSelect: (id: number) => void;
  updateQuantity: (id: number, change: number, productItemId: number | null) => void;
  onDelete: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, isSelected, onSelect, updateQuantity, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="cart-item">
      <style jsx>{`
        .modal-content {
            animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .confirm-btn {
            background: #ff6f61;
        }
        .confirm-btn:hover {
            background: #e65b4d;
        }
        .checkbox-fake {
          width: 16px;
          height: 16px;
          border: 1px solid #ccc;
          border-radius: 3px;
          display: inline-block;
          margin-right: 8px;
          position: relative;
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
        .item-row {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .item-details {
          flex: 0 0 35%;
          max-width: 35%;
          display: flex;
          align-items: center;
        }
        .item-image {
          margin-right: 10px;
        }
        .item-info {
          flex: 1;
        }
        .item-price {
          flex: 0 0 20%;
          max-width: 20%;
          text-align: center;
        }
        .item-quantity {
          flex: 0 0 13%;
          max-width: 13%;
          text-align: center;
        }
        .item-total {
          flex: 0 0 20%;
          max-width: 20%;
          padding-left: 40px;
          text-align: center;
          color: #ed4d2d;
          font-weight: 800;
          font-size: 15px;
        }
        .item-actions {
          flex: 0 0 3%;
          max-width: 3%;
          text-align: center;
        }
        .quantity-control {
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d1d5db;
          border-radius: 2px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .quantity-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #fff;
          color: #1f2937;
          font-size: 18px;
          font-weight: 200;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .quantity-btn:hover:not(:disabled) {
          color: #ed4d2d;
        }
        .quantity-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          background: #f3f4f6;
        }
        .quantity-control input {
          width: 50px;
          height: 36px;
          text-align: center;
          border: none;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          font-size: 14px;
          color: #1f2937;
          background: #fff;
        }
        .quantity-note {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        .coupon-section {
          padding: 10px 0;
        }
        .coupon-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .out-of-stock {
          color: red;
          font-size: 12px;
        }
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 300px;
          max-width: 90%;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .modal-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-around;
        }
        .modal-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease;
        }
        .confirm-btn {
          background: #ed4d2d;
          color: #ffffff;
        }
        .confirm-btn:hover {
          background: #c24125;
        }
        .cancel-btn {
          background: #f3f4f6;
          color: #1f2937;
        }
        .cancel-btn:hover {
          background: #e5e7eb;
        }
      `}</style>
      <div className="seller-info">
        <Image
          src="https://salt.tikicdn.com/ts/upload/30/24/79/8317b36e87e7c0920e33de0ab5c21b62.png"
          alt="Seller"
          width={20}
          height={20}
          className="seller-icon"
        />
        <Link href="#" className="seller-link" style={{ color: '#38383D' }}>
          {item.seller}
          <svg
            className="more"
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
              fill="var(--maincolor)"
            />
          </svg>
        </Link>
      </div>
      <div className="item-row">
        <div className="item-details">
          <label className="checkbox-label">
            <span
              className={`checkbox-fake ${isSelected ? 'selected' : ''}`}
              onClick={() => item.available && onSelect(item.id)}
              style={{ cursor: item.available ? 'pointer' : 'not-allowed', opacity: item.available ? 1 : 0.5 }}
            />
          </label>
          <div className="item-image">
            <Image src={item.image} alt={item.name} width={80} height={80} />
          </div>
          <div className="item-info">
            <Link
              href="#"
              className="item-name"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.name}
            </Link>
            {item.id === 1 && <p className="item-note">Sách không hỗ trợ Bookcare</p>}
            <div className="delivery-info">
              <Image
                src="https://salt.tikicdn.com/cache/w96/ts/tka/65/be/89/d0c3208134f19e4bab8b50d81b41933a.png"
                alt="Delivery"
                width={32}
                height={16}
                className="delivery-icon"
              />
              <span>{item.delivery}</span>
            </div>
            {!item.available && <p className="out-of-stock">Hết hàng</p>}
          </div>
        </div>
        <div className="item-price">
          <span>{item.price.toLocaleString()}₫</span>
          <p className="price-note" style={{ fontSize: '11px' }}>
            Giá chưa áp dụng khuyến mãi
          </p>
        </div>
        <div className="item-quantity">
          {item.available ? (
            <>
              <div className="quantity-control">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, -1, item.productItemId)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input type="text" value={item.quantity} readOnly />
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, 1, item.productItemId)}
                >
                  +
                </button>
              </div>
              <p className="quantity-note">Còn 1 sản phẩm</p>
            </>
          ) : (
            <div className="quantity-placeholder">
              <span className="out-of-stock">Sản phẩm tạm hết hàng</span>
            </div>
          )}
        </div>
        <div className="item-total">
          {item.available && <span>{(item.price * item.quantity).toLocaleString()}₫</span>}
        </div>
        <div className="item-actions">
          <Image
            src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg"
            alt="Delete"
            width={17}
            height={17}
            className="delete-icon"
            onClick={handleDeleteClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      <div className="coupon-section">
        <div className="coupon-wrapper">
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
          <span style={{ color: '#38383d' }}>Thêm mã khuyến mãi của Shop</span>
          <svg
            className="more"
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
              fill="var(--maincolor)"
            />
          </svg>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#ed4d2d"/>
            </svg>
            <div className="modal-title">Xác nhận xóa</div>
            <div className="modal-message">
                Bạn có chắc chắn muốn xóa sản phẩm {item.name} khỏi giỏ hàng?
            </div>
            <div className="modal-buttons">
                <button className="modal-button confirm-btn" onClick={handleConfirmDelete}>
                Xác nhận
                </button>
                <button className="modal-button cancel-btn" onClick={handleCancelDelete}>
                Hủy
                </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;