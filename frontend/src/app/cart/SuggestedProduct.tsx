// components/SuggestedProduct.tsx
import Image from 'next/image';

interface SuggestedProductProps {
  product: {
    id: string;
    spid: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    rating: number;
    deliveryDate: string;
  };
}

export default function SuggestedProduct({ product }: SuggestedProductProps) {
  return (
    <div className="sc-714f5c73-0 dutDwQ" style={{ display: '-webkit-box', width: '163.333px' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <a className="sc-8b415d9d-1 iRifC product-item" href={`/mieng-lot-dem-lot-khuy-tay-goi-tap-yoga-dem-pad-cao-su-ho-tro-giam-dau-dau-goi-va-cac-tu-the-yoga-p${product.id}.html?spid=${product.spid}`} data-view-id="product_list_item">
          <span className="sc-8b415d9d-0 esCPZO">
            <div style={{ position: 'relative' }}>
              <div className="sc-accfdecb-0 oeQAA thumbnail">
                <div className="image-wrapper">
                  <Image src={product.image} alt={product.name} width={280} height={280} className="sc-900210d0-0 hFEtiz" style={{ width: '100%', aspectRatio: '1 / 1', height: '100%', opacity: 1 }} />
                </div>
              </div>
              <div className="sc-8cb63b91-0 iftnV info-badges" style={{ position: 'absolute', inset: '0', zIndex: 2 }}>
                <Image src="https://salt.tikicdn.com/ts/upload/f7/9e/83/ab28365ea395893fe5abac88b5103444.png" alt="product_image_badge" width={280} height={280} className="sc-900210d0-0 hFEtiz" style={{ width: '100%', height: '100%', opacity: 1 }} />
              </div>
            </div>
            <div className="sc-8b415d9d-6 ePleYc product-card-content">
              <div className="info">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div className="name-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '58px' }}>
                    <h3 className="sc-8b415d9d-5 izNpeL">{product.name}</h3>
                    <div className="sc-8b415d9d-4 MtbnO">
                      <div className="sc-980e9960-0 eTeHeN" style={{ fontSize: '12px', display: 'inline-block' }}>
                        {/* Rating stars */}
                        <div style={{ zIndex: 2, position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', overflow: 'hidden' }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px' }}>
                              <g clipPath="url(#a)">
                                <path
                                  d="M6.448 2.029a.5.5 0 0 0-.896 0L4.287 4.59l-2.828.41a.5.5 0 0 0-.277.854l2.046 1.994-.483 2.816a.5.5 0 0 0 .726.528L6 9.863l2.53 1.33a.5.5 0 0 0 .725-.527l-.483-2.817 2.046-1.994a.5.5 0 0 0-.277-.853L7.713 4.59 6.448 2.029Z"
                                  fill={i < product.rating ? '#FFC400' : '#DDDDE3'}
                                />
                              </g>
                              <defs>
                                <clipPath id="a">
                                  <path fill="#fff" transform="translate(1 1.5)" d="M0 0h10v10H0z" />
                                </clipPath>
                              </defs>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sc-7615e682-0 jVbBhv">
                    <div className="price-discount">
                      <div className="price-discount__price" style={{ color: product.discount ? 'rgb(255, 66, 78)' : 'rgb(39, 39, 42)' }}>
                        {product.price.toLocaleString()}<sup>₫</sup>
                      </div>
                    </div>
                    {product.discount && (
                      <div style={{ display: 'flex', gap: '4px', height: '18px' }}>
                        <div className="price-discount__discount">{product.discount}</div>
                        <div className="price-discount__original-price">{product.originalPrice?.toLocaleString()}<sup>₫</sup></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="sc-ef96b96-1 gheWdB delivery-info">
                    {product.deliveryDate.includes('chiều mai') && (
                      <Image src="https://salt.tikicdn.com/cache/w96/ts/tka/26/a2/90/0663718b1c04d15a46bf0f23874a7e01.png" alt="delivery_info_badge" width={32} height={16} />
                    )}
                    <span>{product.deliveryDate}</span>
                  </div>
                </div>
                <div className="sc-7dc0951c-0 dtdCMI">
                  <span>Thêm vào giỏ</span>
                </div>
              </div>
            </div>
          </span>
        </a>
      </div>
    </div>
  );
}