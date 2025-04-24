// src/app/checkout/page.tsx
"use client";

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTruck, faCreditCard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import 'flag-icons/css/flag-icons.min.css';
import dynamic from 'next/dynamic';
import type { ActionMeta } from 'react-select';

// Định nghĩa interface OptionType
interface OptionType {
  value: string;
  label: string;
}

// Import react-select động với SSR tắt
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function CheckoutPage() {
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerAddress: '0',
    email: 'nguyenngoctieptn@gmail.com',
    billingName: 'a',
    billingPhone: '+84375623446',
    billingAddress: '350 le duc tho',
    billingProvince: '2',
    billingDistrict: '42',
    billingWard: '9266',
    note: '',
    shippingMethod: '773109_0,40.000 VND',
    paymentMethod: '',
    reductionCode: '',
    billingPhoneRegion: 'VN',
  });

  // Dữ liệu cho react-select
  const provinceOptions: OptionType[] = [
    { value: '1', label: 'Hà Nội' },
    { value: '2', label: 'TP Hồ Chí Minh' },
  ];

  const districtOptions: OptionType[] = [
    { value: '42', label: 'Quận Gò Vấp' },
    { value: '31', label: 'Quận 2' },
  ];

  const wardOptions: OptionType[] = [
    { value: '9266', label: 'Phường 6' },
    { value: '9340', label: 'Phường Thảo Điền' },
  ];

  // Sản phẩm tĩnh phù hợp với giao diện CartItem
  const staticProduct = {
    productId: 1,
    productName: 'Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái',
    imageUrl: 'http://bizweb.dktcdn.net/thumb/thumb/100/497/938/products/sp20.jpg?v=1696241238643',
    price: 1399000,
    quantity: 1,
    currency: 'VND',
    hasVariations: false,
    productItemId: null,
  };

  // Sử dụng giỏ hàng nếu có, nếu không thì dùng sản phẩm tĩnh
  const products = cart.length > 0 ? cart : [staticProduct];

  // Tính toán tổng phụ và tổng cộng
  const subtotalPrice = products.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const shippingFee = 40000;
  const totalPrice = subtotalPrice + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProvinceChange = (newValue: unknown, _actionMeta: ActionMeta<unknown>) => {
    const typedValue = newValue as OptionType | null;
    setFormData({ ...formData, billingProvince: typedValue ? typedValue.value : '' });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDistrictChange = (newValue: unknown, _actionMeta: ActionMeta<unknown>) => {
    const typedValue = newValue as OptionType | null;
    setFormData({ ...formData, billingDistrict: typedValue ? typedValue.value : '' });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWardChange = (newValue: unknown, _actionMeta: ActionMeta<unknown>) => {
    const typedValue = newValue as OptionType | null;
    setFormData({ ...formData, billingWard: typedValue ? typedValue.value : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      ...formData,
      cart: products,
      subtotalPrice,
      shippingFee,
      totalPrice,
    };

    try {
      console.log('Order submitted:', orderData);
      alert('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .field__input-wrapper--connected .field__input {
          width: calc(100% - 6em - 15px);
        }
        .phone-region-wrapper {
          position: relative;
          width: 11em;
          height: 44px;
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
        }
        .phone-region-select {
          width: 100%;
          height: 100%;
          padding-left: 35px;
          padding-right: 24px;
          border: none;
          background: transparent;
          appearance: none;
          cursor: pointer;
          font-size: 1em;
          color: #333;
        }
        .phone-region-flag {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
        .phone-region-arrow {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* Tùy chỉnh react-select */
        .custom-select__control {
          height: 44px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 1em;
          color: #333;
          cursor: pointer;
        }
        .custom-select__control--is-focused {
          border-color: #40c4ff !important;
          box-shadow: 0 0 5px rgba(64, 196, 255, 0.3) !important;
        }
        .custom-select__control:hover {
          border-color: #b3b3b3;
        }
        .custom-select__menu {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 1000 !important;
        }
        .custom-select__option {
          font-size: 1em;
          color: #333;
        }
        .custom-select__option--is-focused {
          background-color: #f0faff;
        }
        .custom-select__option--is-selected {
          background-color: #40c4ff;
          color: #fff;
        }
        .custom-select__indicator-separator {
          display: none;
        }
        .custom-select__dropdown-indicator {
          color: #666;
        }
      `}</style>
      <div data-no-turbolink="">
        <header className="banner">
          <div className="wrap">
            <div className="logo logo--left">
              <h1 className="shop__name">
                <Link href="/">ND Mall</Link>
              </h1>
            </div>
          </div>
        </header>
        <aside>
          <button
            className="order-summary-toggle"
            data-toggle="#order-summary"
            data-toggle-class="order-summary--is-collapsed"
          >
            <span className="wrap">
              <span className="order-summary-toggle__inner">
                <span className="order-summary-toggle__text expandable">
                  Đơn hàng ({products.length} sản phẩm)
                </span>
                <span className="order-summary-toggle__total-recap" data-bind="getTextTotalPrice()">
                  {totalPrice.toLocaleString()}₫
                </span>
              </span>
            </span>
          </button>
        </aside>

        <div
          data-tg-refresh="checkout"
          id="checkout"
          className="content"
          data-select2-id="select2-data-checkout"
        >
          <form
            id="checkoutForm"
            method="post"
            data-define={`{
              loadingShippingErrorMessage: 'Không thể load phí vận chuyển. Vui lòng thử lại',
              loadingReductionCodeErrorMessage: 'Có lỗi xảy ra khi áp dụng khuyến mãi. Vui lòng thử lại',
              submitingCheckoutErrorMessage: 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại',
              requireShipping: true,
              requireDistrict: false,
              requireWard: false,
              shouldSaveCheckoutAbandon: false
            }`}
            action="/checkout/4dc899f3ab9248ad9b7bb30258a73e9a"
            onSubmit={handleSubmit}
            data-bind-event-submit="handleCheckoutSubmit(event)"
            data-bind-event-keypress="handleCheckoutKeyPress(event)"
            data-bind-event-change="handleCheckoutChange(event)"
            data-select2-id="select2-data-checkoutForm"
          >
            <input type="hidden" name="_method" value="patch" />
            <div className="wrap" data-select2-id="select2-data-220-fbdu">
              <main className="main">
                <header className="main__header">
                  <div className="logo logo--left">
                    <h1 className="shop__name">
                      <Link href="/">ND Mall</Link>
                    </h1>
                  </div>
                </header>
                <div className="main__content" data-select2-id="select2-data-219-y6f8">
                  <article className="animate-floating-labels floating-labels row">
                    <div className="col col--two">
                      <section className="section" data-select2-id="select2-data-218-c9ui">
                        <div className="section__header">
                          <div className="layout-flex">
                            <h2 className="section__title layout-flex__item layout-flex__item--stretch">
                              <FontAwesomeIcon
                                icon={faIdCard}
                                className="fa-lg section__title--icon hide-on-desktop"
                              />
                              Thông tin nhận hàng
                            </h2>
                            <a href="/account/logout?returnUrl=/checkout/4dc899f3ab9248ad9b7bb30258a73e9a">
                              <FontAwesomeIcon icon={faSignOutAlt} className="fa-lg" />
                              <span>Đăng xuất</span>
                            </a>
                          </div>
                        </div>
                        <div className="section__content" data-select2-id="select2-data-217-oae6">
                          <div className="fieldset">
                            <div className="field field--show-floating-label">
                              <div className="field__input-wrapper">
                                <label htmlFor="customer-address" className="field__label">
                                  Sổ địa chỉ
                                </label>
                                <select
                                  size={1}
                                  className="field__input field__input--select"
                                  id="customer-address"
                                  name="customerAddress"
                                  value={formData.customerAddress}
                                  onChange={handleInputChange}
                                  data-bind="customerAddress"
                                >
                                  <option value="0">Địa chỉ khác...</option>
                                  <option
                                    value="1"
                                    data-name="a"
                                    data-address="350 le duc tho"
                                    data-phone="+84375623446"
                                    data-province="2"
                                    data-district="31"
                                    data-ward="9340"
                                  >
                                    a, 350 le duc tho, Phường Thảo Điền, Quận 2, TP Hồ Chí Minh
                                  </option>
                                </select>
                                <div className="field__caret">
                                  <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                              </div>
                            </div>

                            <div className="field field--show-floating-label field--disabled">
                              <input name="email" type="hidden" value={formData.email} />
                              <div className="field__input-wrapper">
                                <label htmlFor="email" className="field__label">
                                  Email
                                </label>
                                <input
                                  name="email"
                                  id="email"
                                  type="email"
                                  className="field__input"
                                  value={formData.email}
                                  disabled
                                  data-bind="email"
                                />
                              </div>
                            </div>

                            <div className={`field ${formData.billingName ? 'field--show-floating-label' : ''}`}>
                              <div className="field__input-wrapper">
                                <label htmlFor="billingName" className="field__label">
                                  Họ và tên
                                </label>
                                <input
                                  name="billingName"
                                  id="billingName"
                                  type="text"
                                  className="field__input"
                                  value={formData.billingName}
                                  onChange={handleInputChange}
                                  data-bind="billing.name"
                                />
                              </div>
                            </div>

                            <div className={`field ${formData.billingPhone ? 'field--show-floating-label' : ''}`}>
                              <div className="field__input-wrapper field__input-wrapper--connected">
                                <label htmlFor="billingPhone" className="field__label">
                                  Số điện thoại (tùy chọn)
                                </label>
                                <input
                                  name="billingPhone"
                                  id="billingPhone"
                                  type="tel"
                                  className="field__input"
                                  value={formData.billingPhone}
                                  onChange={handleInputChange}
                                  data-bind="billing.phone"
                                />
                                <div className="field__input-phone-region-wrapper">
                                  <div className="phone-region-wrapper">
                                    <span className={`phone-region-flag fi fi-${formData.billingPhoneRegion.toLowerCase()}`}></span>
                                    <select
                                      className="phone-region-select"
                                      name="billingPhoneRegion"
                                      value={formData.billingPhoneRegion}
                                      onChange={handleInputChange}
                                    >
                                      <option value="VN">Vietnam (+84)</option>
                                      <option value="US">United States (+1)</option>
                                      <option value="JP">Japan (+81)</option>
                                    </select>
                                    <span className="phone-region-arrow">
                                      <FontAwesomeIcon icon={faCaretDown} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className={`field ${formData.billingAddress ? 'field--show-floating-label' : ''}`}>
                              <div className="field__input-wrapper">
                                <label htmlFor="billingAddress" className="field__label">
                                  Địa chỉ (tùy chọn)
                                </label>
                                <input
                                  name="billingAddress"
                                  id="billingAddress"
                                  type="text"
                                  className="field__input"
                                  value={formData.billingAddress}
                                  onChange={handleInputChange}
                                  data-bind="billing.address"
                                />
                              </div>
                            </div>

                            <div className="field field--show-floating-label">
                              <div className="field__input-wrapper">
                                <label htmlFor="billingProvince" style={{ marginBottom: '-0.5rem' }}>
                                  Tỉnh thành
                                </label>
                                <Select
                                  classNamePrefix="custom-select"
                                  options={provinceOptions}
                                  value={provinceOptions.find((option) => option.value === formData.billingProvince)}
                                  onChange={handleProvinceChange}
                                  placeholder="Chọn tỉnh thành..."
                                  isClearable
                                />
                              </div>
                            </div>

                            <div className="field field--show-floating-label">
                              <div className="field__input-wrapper">
                                <label htmlFor="billingDistrict" style={{ marginBottom: '-0.5rem' }}>
                                  Quận huyện (tùy chọn)
                                </label>
                                <Select
                                  classNamePrefix="custom-select"
                                  options={districtOptions}
                                  value={districtOptions.find((option) => option.value === formData.billingDistrict)}
                                  onChange={handleDistrictChange}
                                  placeholder="Chọn quận huyện..."
                                  isClearable
                                />
                              </div>
                            </div>

                            <div className="field field--show-floating-label">
                              <div className="field__input-wrapper">
                                <label htmlFor="billingWard" style={{ marginBottom: '-0.5rem' }}>
                                  Phường xã (tùy chọn)
                                </label>
                                <Select
                                  classNamePrefix="custom-select"
                                  options={wardOptions}
                                  value={wardOptions.find((option) => option.value === formData.billingWard)}
                                  onChange={handleWardChange}
                                  placeholder="Chọn phường xã..."
                                  isClearable
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="fieldset">
                        <h3 className="visually-hidden">Ghi chú</h3>
                        <div className={`field ${formData.note ? 'field--show-floating-label' : ''}`}>
                          <div className="field__input-wrapper">
                            <label htmlFor="note" className="field__label">
                              Ghi chú (tùy chọn)
                            </label>
                            <textarea
                              name="note"
                              id="note"
                              className="field__input"
                              value={formData.note}
                              onChange={handleInputChange}
                              data-bind="note"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col col--two">
                      <section className="section" data-define="{shippingMethod: '773109_0,40.000 VND'}">
                        <div className="section__header">
                          <div className="layout-flex">
                            <h2 className="section__title layout-flex__item layout-flex__item--stretch">
                              <FontAwesomeIcon
                                icon={faTruck}
                                className="fa-lg section__title--icon hide-on-desktop"
                              />
                              Vận chuyển
                            </h2>
                          </div>
                        </div>
                        <div
                          className="section__content"
                          data-tg-refresh="refreshShipping"
                          id="shippingMethodList"
                          data-define="{isAddressSelecting: false, shippingMethods: []}"
                        >
                          <div
                            className="content-box"
                            data-bind-show="!isLoadingShippingMethod && !isAddressSelecting && !isLoadingShippingError"
                          >
                            <div
                              className="content-box__row"
                              data-define-array="{shippingMethods: {name: '773109_0,40.000 VND', textPriceFinal: '40.000₫', textPriceOriginal: '', subtotalPriceWithShippingFee: '1.439.000₫'}}"
                            >
                              <div className="radio-wrapper">
                                <div className="radio__input">
                                  <input
                                    type="radio"
                                    className="input-radio"
                                    name="shippingMethod"
                                    id="shippingMethod-773109_0"
                                    value="773109_0,40.000 VND"
                                    checked={formData.shippingMethod === '773109_0,40.000 VND'}
                                    onChange={handleInputChange}
                                    data-bind="shippingMethod"
                                  />
                                </div>
                                <label htmlFor="shippingMethod-773109_0" className="radio__label">
                                  <span className="radio__label__primary">
                                    <span>Giao hàng tận nơi</span>
                                  </span>
                                  <span className="radio__label__accessory">
                                    <span className="content-box__emphasis price">40.000₫</span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="section">
                        <div className="section__header">
                          <div className="layout-flex">
                            <h2 className="section__title layout-flex__item layout-flex__item--stretch">
                              <FontAwesomeIcon
                                icon={faCreditCard}
                                className="fa-lg section__title--icon hide-on-desktop"
                              />
                              Thanh toán
                            </h2>
                          </div>
                        </div>
                        <div className="section__content">
                          <div className="content-box" data-define="{paymentMethod: undefined}">
                            <div className="content-box__row">
                              <div className="radio-wrapper">
                                <div className="radio__input">
                                  <input
                                    name="paymentMethod"
                                    id="paymentMethod-663330"
                                    type="radio"
                                    className="input-radio"
                                    value="663330"
                                    data-provider-id="3"
                                    checked={formData.paymentMethod === '663330'}
                                    onChange={handleInputChange}
                                    data-bind="paymentMethod"
                                  />
                                </div>
                                <label htmlFor="paymentMethod-663330" className="radio__label">
                                  <span className="radio__label__primary">Chuyển khoản</span>
                                  <span className="radio__label__accessory">
                                    <span className="radio__label__icon">
                                      <i className="payment-icon payment-icon--3"></i>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>

                            <div className="content-box__row">
                              <div className="radio-wrapper">
                                <div className="radio__input">
                                  <input
                                    name="paymentMethod"
                                    id="paymentMethod-663332"
                                    type="radio"
                                    className="input-radio"
                                    value="663332"
                                    data-provider-id="4"
                                    checked={formData.paymentMethod === '663332'}
                                    onChange={handleInputChange}
                                    data-bind="paymentMethod"
                                  />
                                </div>
                                <label htmlFor="paymentMethod-663332" className="radio__label">
                                  <span className="radio__label__primary">Thu hộ (COD)</span>
                                  <span className="radio__label__accessory">
                                    <span className="radio__label__icon">
                                      <i className="payment-icon payment-icon--4"></i>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </article>
                  <div className="field__input-btnnn-wrapper field__input-btnnn-wrapper--vertical hide-on-desktop">
                    <button
                      type="submit"
                      className={`btnnn btnnn-checkout spinner ${isSubmitting ? 'spinner--active' : ''}`}
                      data-bind-class="{'spinner--active': isSubmitingCheckout}"
                      data-bind-disabled="isSubmitingCheckout || isLoadingReductionCode"
                      disabled={isSubmitting}
                    >
                      <span className="spinner-label">ĐẶT HÀNG</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="spinner-loader">
                        <use href="#spinner"></use>
                      </svg>
                    </button>
                    <Link href="/cart" className="previous-link" onClick={() => { window.location.href = '/cart'; return false; }}>
                      <i className="previous-link__arrow">❮</i>
                      <span className="previous-link__content">Quay về giỏ hàng</span>
                    </Link>
                  </div>

                  <div id="common-alert" data-tg-refresh="refreshError">
                    <div
                      className="alert alert--danger hide-on-desktop hide"
                      data-bind-show="!isSubmitingCheckout && isSubmitingCheckoutError"
                      data-bind="submitingCheckoutErrorMessage"
                      style={{ display: isSubmitting ? 'none' : 'block' }}
                    >
                      Có lỗi xảy ra khi xử lý. Vui lòng thử lại
                    </div>
                  </div>
                </div>
              </main>
              <aside className="sidebar">
                <div className="sidebar__header">
                  <h2 className="sidebar__title">Đơn hàng ({products.length} sản phẩm)</h2>
                </div>
                <div className="sidebar__content">
                  <div id="order-summary" className="order-summary order-summary--is-collapsed">
                    <div className="order-summary__sections">
                      <div className="order-summary__section order-summary__section--product-list order-summary__section--is-scrollable order-summary--collapse-element">
                        <table
                          className="product-table"
                          id="product-table"
                          data-tg-refresh="refreshDiscount"
                        >
                          <caption className="visually-hidden">Chi tiết đơn hàng</caption>
                          <thead className="product-table__header">
                            <tr>
                              <th>
                                <span className="visually-hidden">Ảnh sản phẩm</span>
                              </th>
                              <th>
                                <span className="visually-hidden">Mô tả</span>
                              </th>
                              <th>
                                <span className="visually-hidden">Số lượng</span>
                              </th>
                              <th>
                                <span className="visually-hidden">Đơn giá</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((item) => (
                              <tr className="product" key={`${item.productId}-${item.productItemId ?? 'no-variation'}`}>
                                <td className="product__image">
                                  <div className="product-thumbnail">
                                    <div className="product-thumbnail__wrapper" data-tg-static="">
                                      <Image
                                        src={item.imageUrl || '/default-image.jpg'}
                                        alt=""
                                        width={50}
                                        height={50}
                                        className="product-thumbnail__image"
                                      />
                                    </div>
                                    <span className="product-thumbnail__quantity">{item.quantity}</span>
                                  </div>
                                </td>
                                <th className="product__description">
                                  <span className="product__description__name">{item.productName}</span>
                                </th>
                                <td className="product__quantity visually-hidden">
                                  <em>Số lượng:</em> {item.quantity}
                                </td>
                                <td className="product__price">
                                  {(item.price * item.quantity).toLocaleString()}₫
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="order-summary__section order-summary__section--discount-code"
                        data-tg-refresh="refreshDiscount"
                        id="discountCode"
                      >
                        <h3 className="visually-hidden">Mã khuyến mại</h3>
                        <div className="edit_checkout animate-floating-labels floating-labels">
                          <div className="fieldset">
                            <div className={`field ${formData.reductionCode ? 'field--show-floating-label' : ''}`}>
                              <div className="field__input-btnnn-wrapper">
                                <div className="field__input-wrapper">
                                  <label htmlFor="reductionCode" className="field__label">
                                    Nhập mã giảm giá
                                  </label>
                                  <input
                                    name="reductionCode"
                                    id="reductionCode"
                                    type="text"
                                    className="field__input"
                                    autoComplete="off"
                                    value={formData.reductionCode}
                                    onChange={handleInputChange}
                                    data-bind-disabled="isLoadingReductionCode"
                                    data-bind-event-keypress="handleReductionCodeKeyPress(event)"
                                    data-define="{reductionCode: null}"
                                    data-bind="reductionCode"
                                  />
                                </div>
                                <button
                                  className={`field__input-btnnn btnnn spinner ${
                                    !formData.reductionCode ? 'btnnn--disabled' : ''
                                  }`}
                                  type="button"
                                  disabled={!formData.reductionCode}
                                  data-bind-disabled="isLoadingReductionCode || !reductionCode"
                                  data-bind-class="{'spinner--active': isLoadingReductionCode, 'btnnn--disabled': !reductionCode}"
                                  data-bind-event-click="applyReductionCode()"
                                >
                                  <span className="spinner-label">Áp dụng</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="spinner-loader">
                                    <use href="#spinner"></use>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="order-summary__section order-summary__section--total-lines order-summary--collapse-element"
                        data-define="{subTotalPriceText: `${subtotalPrice.toLocaleString()}₫`}"
                        data-tg-refresh="refreshOrderTotalPrice"
                        id="orderSummary"
                      >
                        <table className="total-line-table">
                          <caption className="visually-hidden">Tổng giá trị</caption>
                          <thead>
                            <tr>
                              <th>
                                <span className="visually-hidden">Mô tả</span>
                              </th>
                              <th>
                                <span className="visually-hidden">Giá tiền</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="total-line-table__tbody">
                            <tr className="total-line total-line--subtotal">
                              <th className="total-line__name">Tạm tính</th>
                              <td className="total-line__price">{subtotalPrice.toLocaleString()}₫</td>
                            </tr>
                            <tr className="total-line total-line--shipping-fee">
                              <th className="total-line__name">Phí vận chuyển</th>
                              <td className="total-line__price">
                                <span className="origin-price" data-bind="getTextShippingPriceOriginal()"></span>
                                <span data-bind="getTextShippingPriceFinal()">{shippingFee.toLocaleString()}₫</span>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot className="total-line-table__footer">
                            <tr className="total-line payment-due">
                              <th className="total-line__name">
                                <span className="payment-due__label-total">Tổng cộng</span>
                              </th>
                              <td className="total-line__price">
                                <span className="payment-due__price" data-bind="getTextTotalPrice()">
                                  {totalPrice.toLocaleString()}₫
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="order-summary__nav field__input-btnnn-wrapper hide-on-mobile layout-flex--row-reverse">
                        <button
                          type="submit"
                          className={`btnnn btnnn-checkout spinner ${isSubmitting ? 'spinner--active' : ''}`}
                          data-bind-class="{'spinner--active': isSubmitingCheckout}"
                          data-bind-disabled="isSubmitingCheckout || isLoadingReductionCode"
                          disabled={isSubmitting}
                        >
                          <span className="spinner-label">ĐẶT HÀNG</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="spinner-loader">
                            <use href="#spinner"></use>
                          </svg>
                        </button>
                        <Link href="/cart" className="previous-link">
                          <i className="previous-link__arrow">❮</i>
                          <span className="previous-link__content">Quay về giỏ hàng</span>
                        </Link>
                      </div>
                      <div id="common-alert-sidebar" data-tg-refresh="refreshError">
                        <div
                          className="alert alert--danger hide-on-mobile hide"
                          data-bind-show="!isSubmitingCheckout && isSubmitingCheckoutError"
                          data-bind="submitingCheckoutErrorMessage"
                          style={{ display: isSubmitting ? 'none' : 'block' }}
                        >
                          Có lỗi xảy ra khi xử lý. Vui lòng thử lại
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>

          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
            <symbol id="spinner">
              <svg viewBox="0 0 30 30">
                <circle
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="85%"
                  cx="50%"
                  cy="50%"
                  r="40%"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 15 15"
                    to="360 15 15"
                    dur="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </symbol>
          </svg>
        </div>
      </div>
    </>
  );
}