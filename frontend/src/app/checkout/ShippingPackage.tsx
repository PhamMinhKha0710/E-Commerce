import styles from './ShippingPackage.module.css';
import Image from 'next/image';

interface PackageItem {
  image: string;
  name: string;
  quantity: number;
  price: string;
}

interface ShippingPackageProps {
  deliveryDate: string;
  method: string;
  originalFee: string;
  currentFee: string;
  items: PackageItem[];
  fulfillmentText: string;
}

export default function ShippingPackage({
  deliveryDate,
  method,
  originalFee,
  currentFee,
  items,
  fulfillmentText,
}: ShippingPackageProps) {
  return (
    <div className={styles.packageInfo} style={{ position: 'relative', paddingTop: '25px' }}>
      <div
        className={styles.packageTitle}
        style={{
          position: 'absolute',
          background: '#fff',
          padding: '0px 10px',
          top: '-10px',
        }}
      >
        <Image
          width={24}
          height={24}
          alt="icon"
          src="https://salt.tikicdn.com/ts/upload/ad/b7/93/7094a85d0b6d299f30ed89b03511deb9.png"
        />
        {deliveryDate}
      </div>
      <div className={styles.packageDetails}>
        <div className={styles.leftColumn}>
          <div className={styles.packageSummary}>
            <span className={styles.methodText}>{method}</span>
            <div className={styles.fee}>
              <span className={styles.originalFee}>{originalFee}</span>
              <span className={styles.currentFee}>{currentFee}</span>
            </div>
          </div>
          {items.map((item, index) => (
            <div key={index} className={styles.packageItem}>
              <Image
                src={item.image}
                alt={item.name}
                width={48}
                height={48}
                className={styles.itemIcon}
              />
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemDetails}>
                  <span>SL: x{item.quantity}</span>
                  <span className={styles.itemPrice}>{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.fulfillment}>
            <svg className={styles.fulfillmentIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3 4.5C3 4.08579 3.33579 3.75 3.75 3.75H10.5C10.9142 3.75 11.25 4.08579 11.25 4.5V6.75H16.5C16.8442 6.75 17.1441 6.98422 17.2276 7.3181L17.8939 9.98345L20.5854 11.3292C20.8395 11.4562 21 11.7159 21 12V16.5C21 16.9142 20.6642 17.25 20.25 17.25H17.25C17.25 18.9069 15.9069 20.25 14.25 20.25C12.5931 20.25 11.25 18.9069 11.25 17.25H10.5C10.0858 17.25 9.75 16.9142 9.75 16.5V5.25H3.75C3.33579 5.25 3 4.91421 3 4.5ZM12.8306 16.7635C12.834 16.7546 12.8372 16.7455 12.8402 16.7364C13.0499 16.1609 13.602 15.75 14.25 15.75C14.898 15.75 15.4501 16.1609 15.6598 16.7364C15.6628 16.7455 15.666 16.7546 15.6694 16.7635C15.7216 16.9161 15.75 17.0797 15.75 17.25C15.75 18.0784 15.0784 18.75 14.25 18.75C13.4216 18.75 12.75 18.0784 12.75 17.25C12.75 17.0797 12.7784 16.9161 12.8306 16.7635ZM16.8487 15.75C16.3299 14.8533 15.3604 14.25 14.25 14.25C13.1396 14.25 12.1701 14.8533 11.6513 15.75H11.25V8.25H15.9144L16.5224 10.6819C16.5755 10.8943 16.7188 11.0729 16.9146 11.1708L19.5 12.4635V15.75H16.8487ZM3 8.25C3 7.83579 3.33579 7.5 3.75 7.5H7.5C7.91421 7.5 8.25 7.83579 8.25 8.25C8.25 8.66421 7.91421 9 7.5 9H3.75C3.33579 9 3 8.66421 3 8.25ZM13.5 9C13.9142 9 14.25 9.33579 14.25 9.75V10.5H15C15.4142 10.5 15.75 10.8358 15.75 11.25C15.75 11.6642 15.4142 12 15 12H13.5C13.0858 12 12.75 11.6642 12.75 11.25V9.75C12.75 9.33579 13.0858 9 13.5 9ZM4.5 12C4.5 11.5858 4.83579 11.25 5.25 11.25H7.5C7.91421 11.25 8.25 11.5858 8.25 12C8.25 12.4142 7.91421 12.75 7.5 12.75H5.25C4.83579 12.75 4.5 12.4142 4.5 12ZM6 15.75C6 15.3358 6.33579 15 6.75 15H7.5C7.91421 15 8.25 15.3358 8.25 15.75C8.25 16.1642 7.91421 16.5 7.5 16.5H6.75C6.33579 16.5 6 16.1642 6 15.75Z" fill="#38383D" />
            </svg>
            <p>{fulfillmentText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}