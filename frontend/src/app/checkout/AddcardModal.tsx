// AddCardModal.tsx
import styles from './Checkout.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`${styles.modalOverlay} ${isVisible ? styles.open : ''}`}>
      <div className={`${styles.modalContent} ${isVisible ? styles.open : ''}`}>
        <div className={styles.modalInner}>
          <div className={styles.modalTitle}>Thêm Thẻ Tín Dụng/ Ghi Nợ Quốc Tế</div>
          <div className={styles.cardTypeList}>
            <Image
              width={32}
              height={32}
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-credit-type-tiki-card.svg"
              alt="tikicard"
            />
            <Image
              width={32}
              height={32}
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-visa.png"
              alt="visa"
            />
            <Image
              width={32}
              height={32}
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-credit-type-mastercard.svg?v=1"
              alt="mastercard"
            />
            <Image
              width={32}
              height={32}
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-credit-type-jcb.svg"
              alt="jcb"
            />
          </div>
          <div className={styles.addCardForm}>
            <div className={styles.formLeft}>
              <div className={styles.formField}>
                <div className={styles.label}>Số thẻ:</div>
                <input
                  type="text"
                  className={styles.inputLong}
                  name="number"
                  placeholder="VD: 4123 4567 8901 2345"
                  value={formData.number}
                  onChange={handleChange}
                  onFocus={() => handleFocus('number')}
                  onBlur={handleBlur}
                />
                <div className={styles.error}></div>
              </div>
              <div className={styles.formField}>
                <div className={styles.label}>Tên in trên thẻ:</div>
                <input
                  type="text"
                  className={styles.inputLong}
                  name="name"
                  placeholder="VD: NGUYEN VAN A"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                />
                <div className={styles.error}></div>
              </div>
              <div className={styles.formField}>
                <div className={styles.label}>Ngày hết hạn:</div>
                <input
                  type="text"
                  className={styles.inputShort}
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  onFocus={() => handleFocus('expiry')}
                  onBlur={handleBlur}
                />
                <div className={styles.error}></div>
              </div>
              <div className={styles.formField}>
                <div className={styles.label}>Mã bảo mật:</div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.inputShort}
                    name="cvc"
                    placeholder="VD: 123"
                    value={formData.cvc}
                    onChange={handleChange}
                    onFocus={() => handleFocus('cvc')}
                    onBlur={handleBlur}
                  />
                  <Image
                    className={styles.cardBack}
                    width={61}
                    height={30}
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/checkout-img-cvv-hint.jpg"
                    alt="cvv hint"
                  />
                </div>
                <div className={styles.error}></div>
              </div>
            </div>
            <div className={styles.formRight}>
              <div className={styles.cardPreview}>
                <div className={`${styles.card} ${focusedField === 'cvc' ? styles.flipped : ''}`}>
                  <div className={styles.cardFront}>
                    <div className={styles.cardBackground}></div>
                    <div className={styles.cardIssuer}></div>
                    <div className={styles.cardCvcFront}></div>
                    <div
                      className={styles.cardNumber}
                      style={{
                        opacity: focusedField === 'number' ? 1 : 0.2,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {formData.number || '•••• •••• •••• ••••'}
                    </div>
                    <div className={styles.cardInfo}>
                      <div
                        className={styles.cardName}
                        style={{
                          opacity: focusedField === 'name' ? 1 : 0.5,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        {formData.name || 'TÊN CHỦ THẺ'}
                      </div>
                      <div
                        className={styles.cardExpiry}
                        style={{
                          opacity: focusedField === 'expiry' ? 1 : 0.5,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <div className={styles.cardExpiryValid}>Hiệu lực đến</div>
                        <div className={styles.cardExpiryValue}>
                          {formData.expiry || '••/••'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardChip}></div>
                  </div>
                  <div className={styles.cardBack}>
                    <div className={styles.cardBackground}></div>
                    <div className={styles.cardStripe}></div>
                    <div className={styles.cardSignature}></div>
                    <div
                      className={`${styles.cardCvc} ${focusedField === 'cvc' ? styles.focused : ''}`}
                    >
                      {formData.cvc || ''}
                    </div>
                    <div className={styles.cardIssuer}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.addCardNote} style={{
              padding: '10px',
              background: 'rgb(226 236 246)',
              color: 'rgb(29 99 185)',
              borderRadius: '10px'
            }}>
            Smile-Mart không trực tiếp lưu thẻ của bạn. Để đảm bảo an toàn, thông tin thẻ của bạn chỉ được lưu bởi CyberSource, công ty quản lý thanh toán lớn nhất thế giới (thuộc tổ chức VISA)
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.backButton} onClick={handleClose}>
              Trở Lại
            </button>
            <button className={styles.confirmButton}>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  );
}