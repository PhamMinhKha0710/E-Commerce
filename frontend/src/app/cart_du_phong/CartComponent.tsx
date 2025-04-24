"use client";

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const billFieldRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [selectedTime, setSelectedTime] = useState('');
  // const router = useRouter();

  // Trạng thái hover cho các button
  const [hoveredButtons, setHoveredButtons] = useState<{
    remove: { [key: number]: boolean };
    minus: { [key: number]: boolean };
    plus: { [key: number]: boolean };
    checkout: boolean;
    mobileRemove: { [key: number]: boolean };
  }>({
    remove: {},
    minus: {},
    plus: {},
    checkout: false,
    mobileRemove: {},
  });

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    if (dateInputRef.current) {
      flatpickr(dateInputRef.current, {
        dateFormat: 'd/m/Y',
        position: 'auto right',
        minDate: 'today',
        defaultDate: new Date(),
      });
    }

    const checkboxBill = document.querySelector('#checkbox-bill') as HTMLInputElement | null;
    const hiddenInvoice = document.querySelector('#re-checkbox-bill') as HTMLInputElement | null;

    if (checkboxBill && hiddenInvoice && billFieldRef.current) {
      if (checkboxBill.checked) {
        billFieldRef.current.style.display = 'block';
      }

      const handleCheckboxChange = () => {
        hiddenInvoice.value = checkboxBill.checked ? 'có' : 'không';
        billFieldRef.current!.style.display = checkboxBill.checked ? 'block' : 'none';
      };

      checkboxBill.addEventListener('change', handleCheckboxChange);

      return () => {
        checkboxBill.removeEventListener('change', handleCheckboxChange);
      };
    }
  }, []);

  const handleCheckout = () => {
    // router.push('/checkout');
    window.location.href = '/checkout1';
  };

  return (
    <section className="main-cart-page main-container col1-layout" style={{ marginTop: '20px' }}>
      <div className="main container cartpcstyle">
        <div className="wrap_background_aside margin-bottom-40">
          <div className="header-cart">
            <div className="title-block-page">
              <h1 className="title_cart">
                <span>Giỏ hàng của bạn</span>
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-9 col-lg-8 col-12 col-cart-left">
              <div className="cart-page d-xl-block d-none">
                <div className="drawer__inner">
                  <div className="CartPageContainer">
                    <form
                      action="/cart"
                      method="post"
                      noValidate
                      className="cart ajaxcart cartpage"
                    >
                      <div className="cart-header-info">
                        <div>Thông tin sản phẩm</div>
                        <div>Đơn giá</div>
                        <div>Số lượng</div>
                        <div>Thành tiền</div>
                      </div>
                      <div className="ajaxcart__inner ajaxcart__inner--has-fixed-footer cart_body items">
                        {cart.length === 0 ? (
                          <p>Giỏ hàng trống</p>
                        ) : (
                          cart.map((item, index) => (
                            <div
                              className="ajaxcart__row"
                              key={`${item.productId}-${item.productItemId ?? 'no-variation'}-${index}`}
                            >
                              <div
                                className="ajaxcart__product cart_product"
                                data-line={index + 1}
                              >
                                <a
                                  href={`/${item.productId}`}
                                  className="ajaxcart__product-image cart_image"
                                  title={item.productName}
                                >
                                  <Image
                                    src={item.imageUrl || '/default-image.jpg'}
                                    alt={item.productName}
                                    width={100}
                                    height={100}
                                  />
                                </a>
                                <div className="grid__item cart_info">
                                  <div className="ajaxcart__product-name-wrapper cart_name">
                                    <a
                                      href={`/${item.productId}`}
                                      className="ajaxcart__product-name h4"
                                      title={item.productName}
                                    >
                                      {item.productName}
                                    </a>
                                    <button
                                      style={{
                                        width: '70px',
                                        height: '30px',
                                        border: 'none',
                                        background: hoveredButtons.remove[index]
                                          ? '#ff4d4f'
                                          : 'transparent',
                                        color: hoveredButtons.remove[index] ? '#fff' : '#333',
                                        padding: '5px 12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: hoveredButtons.remove[index]
                                          ? 'translateY(-2px)'
                                          : 'none',
                                        boxShadow: hoveredButtons.remove[index]
                                          ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                                          : 'none',
                                      }}
                                      className="cart__btn-remove remove-item-cart ajaxifyCart--remove"
                                      data-line={index + 1}
                                      onClick={() => removeFromCart(item.productId, item.productItemId)}
                                      onMouseEnter={() =>
                                        setHoveredButtons((prev) => ({
                                          ...prev,
                                          remove: { ...prev.remove, [index]: true },
                                        }))
                                      }
                                      onMouseLeave={() =>
                                        setHoveredButtons((prev) => ({
                                          ...prev,
                                          remove: { ...prev.remove, [index]: false },
                                        }))
                                      }
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                  <div className="grid">
                                    <div className="grid__item one-half text-right cart_prices">
                                      <span className="cart-price">
                                        {item.price
                                          ? `${item.price.toLocaleString()}₫`
                                          : 'Liên hệ'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid">
                                    <div className="grid__item one-half cart_select">
                                      <div className="ajaxcart__qty input-group-btn">
                                        <button
                                          type="button"
                                          style={{
                                            border: '1px solid #ddd',
                                            background: hoveredButtons.minus[index]
                                              ? '#e5e5e5'
                                              : '#fff',
                                            color: '#333',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: hoveredButtons.minus[index]
                                              ? '0 1px 2px rgba(0, 0, 0, 0.1)'
                                              : 'none',
                                          }}
                                          className="ajaxcart__qty-adjust ajaxcart__qty--minus items-count"
                                          data-id=""
                                          data-qty={(item.quantity || 1) - 1}
                                          data-line={index + 1}
                                          aria-label="-"
                                          onClick={() =>
                                            updateQuantity(
                                              item.productId,
                                              (item.quantity || 1) - 1,
                                              item.productItemId
                                            )
                                          }
                                          onMouseEnter={() =>
                                            setHoveredButtons((prev) => ({
                                              ...prev,
                                              minus: { ...prev.minus, [index]: true },
                                            }))
                                          }
                                          onMouseLeave={() =>
                                            setHoveredButtons((prev) => ({
                                              ...prev,
                                              minus: { ...prev.minus, [index]: false },
                                            }))
                                          }
                                        >
                                          -
                                        </button>
                                        <input
                                          type="text"
                                          name="updates[]"
                                          className="ajaxcart__qty-num number-sidebar"
                                          maxLength={3}
                                          value={item.quantity || 1}
                                          min={0}
                                          data-id=""
                                          data-line={index + 1}
                                          aria-label="quantity"
                                          pattern="[0-9]*"
                                          onChange={(e) =>
                                            updateQuantity(
                                              item.productId,
                                              parseInt(e.target.value) || 1,
                                              item.productItemId
                                            )
                                          }
                                        />
                                        <button
                                          type="button"
                                          style={{
                                            border: '1px solid #ddd',
                                            background: hoveredButtons.plus[index]
                                              ? '#e5e5e5'
                                              : '#fff',
                                            color: '#333',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: hoveredButtons.plus[index]
                                              ? '0 1px 2px rgba(0, 0, 0, 0.1)'
                                              : 'none',
                                          }}
                                          className="ajaxcart__qty-adjust ajaxcart__qty--plus items-count"
                                          data-id=""
                                          data-line={index + 1}
                                          data-qty={(item.quantity || 1) + 1}
                                          aria-label="+"
                                          onClick={() =>
                                            updateQuantity(
                                              item.productId,
                                              (item.quantity || 1) + 1,
                                              item.productItemId
                                            )
                                          }
                                          onMouseEnter={() =>
                                            setHoveredButtons((prev) => ({
                                              ...prev,
                                              plus: { ...prev.plus, [index]: true },
                                            }))
                                          }
                                          onMouseLeave={() =>
                                            setHoveredButtons((prev) => ({
                                              ...prev,
                                              plus: { ...prev.plus, [index]: false },
                                            }))
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid">
                                    <div className="grid__item one-half text-right cart_prices">
                                      <span className="cart-price">
                                        {item.price
                                          ? `${(item.price * (item.quantity || 1)).toLocaleString()}₫`
                                          : 'Liên hệ'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="ajaxcart__footer ajaxcart__footer--fixed cart-footer">
                        <div className="row">
                          <div className="col-lg-4 col-12 offset-md-8 offset-lg-8 offset-xl-8">
                            <div className="ajaxcart__subtotal">
                              <div className="cart__subtotal">
                                <div className="cart__col-6">Tổng tiền:</div>
                                <div className="text-right cart__totle">
                                  <span className="total-price">
                                    {totalPrice.toLocaleString()}₫
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="cart__btn-proceed-checkout-dt">
                              <button
                                style={{
                                  border: 'none',
                                  background: hoveredButtons.checkout
                                    ? '#2a9dcc'
                                    : '#3498db',
                                  color: '#fff',
                                  padding: '12px 24px',
                                  lineHeight: '1.5',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  transform: hoveredButtons.checkout
                                    ? 'scale(1.01)'
                                    : 'none',
                                  boxShadow: hoveredButtons.checkout
                                    ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                                    : 'none',
                                  borderRadius: '4px',
                                }}
                                onClick={handleCheckout}
                                type="button"
                                className="button btn btn-default cart__btn-proceed-checkout"
                                id="btn-proceed-checkout"
                                title="Thanh toán"
                                onMouseEnter={() =>
                                  setHoveredButtons((prev) => ({
                                    ...prev,
                                    checkout: true,
                                  }))
                                }
                                onMouseLeave={() =>
                                  setHoveredButtons((prev) => ({
                                    ...prev,
                                    checkout: false,
                                  }))
                                }
                              >
                                Thanh toán
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="cart-mobile-page d-block d-xl-none">
                <div className="CartMobileContainer">
                  {cart.length === 0 ? (
                    <p>Giỏ hàng trống</p>
                  ) : (
                    cart.map((item, index) => (
                      <div
                        key={`${item.productId}-${item.productItemId ?? 'no-variation'}-${index}`}
                        className="cart-item-mobile"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            width={80}
                            height={80}
                          />
                        ) : (
                          <div style={{ width: 80, height: 80, background: '#ccc' }}>
                            No Image
                          </div>
                        )}
                        <div>
                          <h3>{item.productName}</h3>
                          <p>
                            Giá: {item.price ? `${item.price.toLocaleString()}₫` : 'Liên hệ'}
                          </p>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value),
                                item.productItemId
                              )
                            }
                          />
                          <button
                            style={{
                              border: 'none',
                              background: hoveredButtons.mobileRemove[index]
                                ? '#ff4d4f'
                                : 'transparent',
                              color: hoveredButtons.mobileRemove[index] ? '#fff' : '#333',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: hoveredButtons.mobileRemove[index]
                                ? 'translateY(-2px)'
                                : 'none',
                              boxShadow: hoveredButtons.mobileRemove[index]
                                ? '0 2px 4px rgba(0, 0, 0, 0.2)'
                                : 'none',
                            }}
                            onClick={() => removeFromCart(item.productId, item.productItemId)}
                            onMouseEnter={() =>
                              setHoveredButtons((prev) => ({
                                ...prev,
                                mobileRemove: { ...prev.mobileRemove, [index]: true },
                              }))
                            }
                            onMouseLeave={() =>
                              setHoveredButtons((prev) => ({
                                ...prev,
                                mobileRemove: { ...prev.mobileRemove, [index]: false },
                              }))
                            }
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-12 col-cart-right">
              <form method="post" noValidate className="formVAT">
                <h4>Thời gian giao hàng</h4>
                <div className="timedeli-modal">
                  <fieldset className="input_group date_pick">
                    <input
                      type="text"
                      placeholder="Chọn ngày"
                      readOnly
                      id="date"
                      name="attributes[shipdate]"
                      className="date_picker"
                      required
                      ref={dateInputRef}
                    />
                  </fieldset>
                  <fieldset className="input_group date_time">
                    <select
                      name="time"
                      className="timeer timedeli-cta"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="08h00 - 12h00">08h00 - 12h00</option>
                      <option value="14h00 - 18h00">14h00 - 18h00</option>
                      <option value="19h00 - 21h00">19h00 - 21h00</option>
                    </select>
                  </fieldset>
                </div>
                <div className="r-bill">
                  <div className="checkbox">
                    <input
                      type="hidden"
                      name="attributes[invoice]"
                      id="re-checkbox-bill"
                      value="không"
                    />
                    <input
                      type="checkbox"
                      id="checkbox-bill"
                      name="attributes[invoice]"
                      value="có"
                      className="regular-checkbox"
                    />
                    <label htmlFor="checkbox-bill" className="box"></label>
                    <label htmlFor="checkbox-bill" className="title">
                      Xuất hóa đơn công ty
                    </label>
                  </div>
                  <div className="bill-field" ref={billFieldRef}>
                    <div className="form-group">
                      <label>Tên công ty</label>
                      <input
                        type="text"
                        className="form-control val-f"
                        name="attributes[company_name]"
                        defaultValue=""
                        placeholder="Tên công ty"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mã số thuế</label>
                      <input
                        type="number"
                        className="form-control val-f val-n"
                        name="attributes[tax_code]"
                        defaultValue=""
                        placeholder="Mã số thuế"
                      />
                    </div>
                    <div className="form-group">
                      <label>Địa chỉ công ty</label>
                      <textarea
                        className="form-control val-f"
                        name="attributes[company_address]"
                        placeholder="Nhập địa chỉ công ty (bao gồm Phường/Xã, Quận/Huyện, Tỉnh/Thành phố nếu có)"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Email nhận hoá đơn</label>
                      <input
                        type="email"
                        className="form-control val-f val-email"
                        name="attributes[invoice_email]"
                        defaultValue=""
                        placeholder="Email nhận hoá đơn"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;