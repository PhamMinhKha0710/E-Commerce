// src/app/components/CategoryMenuItem.tsx
import React from 'react';
import Link from 'next/link';

interface CategoryMenuItemProps {
  href: string;
  title: string;
  subcategories?: { href: string; title: string }[]; // Optional subcategories
}

const CategoryMenuItem = ({ href, title, subcategories }: CategoryMenuItemProps) => {
  const hasSubcategories = subcategories && subcategories.length > 0;

  console.log(href);
  return (
    <li className={`dropdown menu-item-count ${hasSubcategories ? 'has-submenu' : ''}`}>
      <Link className="nd-categories-a" href={href} title={title}>
        {title}
        {hasSubcategories && (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fal"
            data-icon="chevron-right"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            className="svg-inline--fa fa-chevron-right fa-w-8"
          >
            <path
              fill="currentColor"
              d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
              className=""
            />
          </svg>
        )}
      </Link>
      {hasSubcategories && (
        <div className="subcate gd-menu" style={{zIndex: 1000}}>
          <div className="nd-cate-list ">
            {subcategories.map((sub) => (
              <aside key={sub.href}>
                <Link className="nd-categories-main-sub" href={sub.href} title={sub.title}>
                  {sub.title}
                </Link>
              </aside>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default CategoryMenuItem;