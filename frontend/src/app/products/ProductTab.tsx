//ProductTabs.tsx
interface ProductTabsProps {
    description: {
      [key: string]: string | number;
    };
  }
  
  const ProductTabs = ({ description }: ProductTabsProps) => {
    return (
      <div className="product-tab e-tabs not-dqtab">
        <ul className="tabs tabs-title clearfix">
          <li className="tab-link active" data-tab="#tab-1">
            <h3>Thông tin sản phẩm</h3>
          </li>
        </ul>
        <div className="tab-float">
          <div id="tab-1" className="tab-content active content_extab">
            <div className="rte product_getcontent">
              <div id="content">
                <p>
                  {Object.entries(description).map(([key, value]) => (
                    <span key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}<br />
                      {value}<br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductTabs;