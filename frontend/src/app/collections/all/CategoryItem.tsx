// components/CategoryItem.tsx
"use client";
import { useState } from 'react';

interface CategoryItemProps {
  title: string;
  href: string;
  subItems?: { title: string; href: string; subItems?: { title: string; href: string }[] }[];
}

const CategoryItem: React.FC<CategoryItemProps> = ({ title, href, subItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <li className="nav-item relative">
        <a title={title} href={href} className="nav-link pr-5">
          {title}
        </a>
        {subItems && subItems.length > 0 && (
          <i className="open_mnu down_icon" onClick={toggleMenu}></i>
        )}
      </li>
      {subItems && subItems.length > 0 && (
        <ul className="menu_down" style={{ display: isOpen ? 'block' : 'none' }}>
          {subItems.map((subItem, index) => (
            <CategoryItem
              key={index}
              title={subItem.title}
              href={subItem.href}
              subItems={subItem.subItems}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoryItem;