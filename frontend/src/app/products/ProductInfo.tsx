'use client';

import { useState, useEffect } from 'react';
import { Product, VariantCombination } from '@/app/products/ProductType';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

interface ProductInfoProps {
  product: Product;
  variantCombinations: VariantCombination[];
  onAddToCart: (quantity: number, selectedVariant?: VariantCombination) => void;
}

export default function ProductInfo({ product, variantCombinations, onAddToCart }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}₫`;
  };

  useEffect(() => {
    if (product.hasVariations && product.defaultCombinationId) {
      const defaultVariant = variantCombinations.find((v) => v.id === product.defaultCombinationId);
      if (defaultVariant) {
        setSelectedAttributes(defaultVariant.attributes);
      }
    }
  }, [product, variantCombinations]);

  const selectedVariant = variantCombinations.find((variant) =>
    Object.keys(selectedAttributes).every((key) => variant.attributes[key] === selectedAttributes[key])
  );

  const coupons = [
    { code: 'ND50', discount: '50%', minValue: '500K' },
    { code: 'ND15', discount: '15%', minValue: '500K' },
    { code: 'ND10K', discount: '10K', minValue: '' },
    { code: 'NDBuy', discount: 'Tặng 500K', minValue: '500K' },
  ];

  useEffect(() => {
    const targetDate = new Date('2025-06-30T00:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleAttributeChange = (groupName: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [groupName]: value }));
  };

  const handleAddToCartClick = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(quantity, selectedVariant);
  };

  return (
    <div className="col-12 col-md-12 col-lg-7 col-center">
      <Toaster />
      <div className="product-sticky">
        <div className="details-pro">
          <div className="block-flashsale" style={{ display: isExpired ? 'none' : 'flex' }}>
            <div className="heading-flash">Flash Sale</div>
            <div className="count-down">
              Kết thúc trong
              <div className="timer-view" data-countdown="countdown" data-date="2025-06-30-00-00-00">
                {isExpired ? (
                  <div className="lof-labelexpired">
                    Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
                  </div>
                ) : (
                  <>
                    <div className="block-timer">
                      <p style={{ color: 'red' }}>{String(timeLeft.days).padStart(2, '0')}</p>
                    </div>
                    <span>:</span>
                    <div className="block-timer">
                      <p style={{ color: 'red' }}>{String(timeLeft.hours).padStart(2, '0')}</p>
                    </div>
                    <span className="mobile">:</span>
                    <div className="block-timer">
                      <p style={{ color: 'red' }}>{String(timeLeft.minutes).padStart(2, '0')}</p>
                    </div>
                    <span>:</span>
                    <div className="block-timer">
                      <p style={{ color: 'red' }}>{String(timeLeft.seconds).padStart(2, '0')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <h1 className="title-product">{product.name}</h1>

          <div className="sku-product clearfix">
            <span className="variant-sku" itemProp="sku" content={selectedVariant?.id || 'Đang cập nhật'}>
              Mã sản phẩm: <span className="a-sku">{selectedVariant?.id || 'Đang cập nhật'}</span>
            </span>
          </div>

          <div className="inventory_quantity">
            <span className="mb-break">
              <span className="stock-brand-title">Thương hiệu:</span>
              <span className="a-vendor">{product.brand}</span>
            </span>
            <span className="line"> | </span>
            <span className="mb-break">
              <span className="stock-brand-title">Tình trạng:</span>
              <span className="a-stock">
                {selectedVariant ? (selectedVariant.available ? 'Còn hàng' : 'Hết hàng') : product.availability === 'InStock' ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </span>
          </div>

          <form
            encType="multipart/form-data"
            data-cart-form
            id="add-to-cart-form"
            action="https://nd-mall.mysapo.net/cart/add"
            method="post"
            className="form-inline"
            onSubmit={handleAddToCartClick}
          >
            <input type="hidden" name="productId" value={product.productId} /> {/* Thêm productId vào form */}
            <div className="price-box clearfix">
              <span className="special-price">
                <span className="price product-price">
                  {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.price)}
                </span>
                <meta itemProp="price" content={(selectedVariant?.price || product.price).toString()} />
                <meta itemProp="priceCurrency" content={product.currency} />
              </span>
              <span className="old-price" itemProp="priceSpecification">
                <del className="price product-price-old">
                  {formatPrice(selectedVariant?.oldPrice || product.oldPrice)}
                </del>
                <meta itemProp="price" content={(selectedVariant?.oldPrice || product.oldPrice).toString()} />
                <meta itemProp="priceCurrency" content={product.currency} />
              </span>
            </div>

            <div className="counpon">
              <b className="title d-block margin-bottom-15">Mã giảm giá</b>
              <div className="list-coupon">
                {coupons.map((coupon) => (
                  <span key={coupon.code}>{coupon.discount}</span>
                ))}
              </div>
              <div className="detail-coupon">
                {coupons.map((coupon) => (
                  <p key={coupon.code}>
                    {coupon.minValue ? (
                      <>
                        Giảm <b>{coupon.discount}</b> cho đơn hàng giá trị tối thiểu <b>{coupon.minValue}</b>
                      </>
                    ) : (
                      <>
                        Nhập mã <b>{coupon.code}</b> giảm ngay <b>{coupon.discount}</b>
                      </>
                    )}
                    <span
                      className="copy"
                      data-code={coupon.code}
                      onClick={() => handleCopyCoupon(coupon.code)}
                    >
                      Sao chép mã
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {product.hasVariations && product.variantGroups && (
              <div className="form-product">
                {product.variantGroups.map((group, index) => (
                  <div key={group.name} className="select-swatch">
                    <div className="swatch" data-option-index={index}>
                      <div className="header bold mb-2" style={{ marginRight: '10px' }}>
                        {group.name.charAt(0).toUpperCase() + group.name.slice(1)}:{' '}
                        <span className="var">{selectedAttributes[group.name]}</span>
                      </div>
                      <div className="list-variant">
                        {group.options.map((option) => {
                          const isDisabled = !variantCombinations.some(
                            (v) =>
                              v.attributes[group.name] === option.value &&
                              Object.keys(selectedAttributes)
                                .filter((key) => key !== group.name)
                                .every((key) => v.attributes[key] === selectedAttributes[key]) &&
                              v.available
                          );
                          return (
                            <div
                              key={option.value}
                              data-value={option.label}
                              className={`swatch-element ${!isDisabled ? 'available' : 'soldout'} has-img`}
                              title={option.label}
                            >
                              <input
                                id={`swatch-${index}-${option.value}`}
                                type="radio"
                                name={`option-${index}`}
                                value={option.value}
                                checked={selectedAttributes[group.name] === option.value}
                                disabled={isDisabled}
                                onChange={() => handleAttributeChange(group.name, option.value)}
                              />
                              <label htmlFor={`swatch-${index}-${option.value}`}>
                                {option.label}
                                {isDisabled && (
                                  <Image
                                    className="crossed-out"
                                    src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/soldout.png?1736305669595"
                                    alt={`${option.label} sold out`}
                                    width={50}
                                    height={50}
                                    loading="lazy"
                                  />
                                )}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="box-variant clearfix">
                  <input type="hidden" id="one_variant" name="variantId" value={selectedVariant?.id || ''} />
                </div>
              </div>
            )}

            <div className="clearfix form-group">
              <div className="flex-quantity">
                <div className="qty-nd custom custom-btn-number show">
                  <label className="sl section">Số lượng:</label>
                  <div className="input_number_product form-control">
                    <button
                      className="btn_num num_1 button button_qty"
                      type="button"
                      onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      id="qty"
                      name="quantity"
                      value={quantity}
                      maxLength={3}
                      className="form-control prd_quantity"
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setQuantity(value > 0 ? value : 1);
                      }}
                    />
                    <button
                      className="btn_num num_2 button button_qty"
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="btn-mua button_actions clearfix">
                  <button
                    type="submit"
                    className="btn btn_base normal_button btn_add_cart add_to_cart btn-cart"
                    disabled={product.hasVariations ? !selectedVariant?.available : product.availability !== 'InStock'}
                  >
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </div>
                <div className="btn-muangay button_actions">
                  <button
                    type="button"
                    className="btn btn-buy-now"
                    data-id={selectedVariant?.id || ''}
                    data-qty={quantity}
                    disabled={product.hasVariations ? !selectedVariant?.available : product.availability !== 'InStock'}
                  >
                    <span>Mua ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="benefit-product">
            <div className="title">Quyền lợi & chính sách:</div>
            <div className="row">
              <div className="item col-lg-4 col-md-4 col-12">
                <Image
                  src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_benefit_pro_1.png?1736305669595"
                  alt="7 ngày hoàn trả miễn phí"
                  width={20}
                  height={20}
                  loading="lazy"
                />
                <p>7 ngày hoàn trả miễn phí</p>
              </div>
              <div className="item col-lg-4 col-md-4 col-12">
                <Image
                  src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_benefit_pro_2.png?1736305669595"
                  alt="Hàng chính hãng"
                  width={20}
                  height={20}
                  loading="lazy"
                />
                <p>Hàng chính hãng</p>
              </div>
              <div className="item col-lg-4 col-md-4 col-12">
                <Image
                  src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_benefit_pro_3.png?1736305669595"
                  alt="Miễn phí vận chuyển"
                  width={20}
                  height={20}
                  loading="lazy"
                />
                <p>Miễn phí vận chuyển</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}