import Link from "next/link";
import React from "react";

// Định nghĩa interface cho mỗi cấp trong breadcrumb
interface BreadcrumbItem {
  label: string; 
  href?: string; 
  isActive?: boolean; 
}

// Props cho component Breadcrumb
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <section className="bread-crumb">
      <div className="container">
        <ul className="breadcrumb">
          {items.map((item, index) => (
            <li key={index} className={item.isActive ? "" : "home"}>
              {item.href && !item.isActive ? (
                <Link href={item.href} title={item.label}>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <strong>
                  <span>{item.label}</span>
                </strong>
              )}
              {index < items.length - 1 && (
                <span className="mr_lr">
                  &nbsp;
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="chevron-right"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    className="svg-inline--fa fa-chevron-right fa-w-10"
                  >
                    <path
                      fill="currentColor"
                      d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                    />
                  </svg>
                  &nbsp;
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Breadcrumb;