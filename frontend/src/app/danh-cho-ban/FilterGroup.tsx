// components/FilterGroup.tsx
"use client";
import { useState } from 'react';
import FilterItem from './FilterItem';

interface FilterGroupProps {
  title: string;
  items: {
    id: string;
    label: string;
    value: string;
    dataGroup: string;
    dataField: string;
    dataText: string;
    dataOperator: string;
    iconClass?: string;
    iconStyle?: React.CSSProperties;
  }[];
  className: string;
  isColorGroup?: boolean; // Thêm prop để xác định nhóm màu sắc
  onFilterChange: (value: string, checked: boolean) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  items,
  className,
  isColorGroup = false,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const displayLimit = 5;

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const visibleItems = isExpanded ? items : items.slice(0, displayLimit);
  const hasMoreItems = items.length > displayLimit;

  return (
    <aside className={`aside-item ${className}`}>
      <div className="aside-title" onClick={toggleOpen}>
        {title}
        <span className="nd-svg collapsible-plus"></span>
      </div>
      <div
        className="aside-content filter-group"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <ul className={className.includes('filter-type') ? 'filter-type' : ''}>
          {visibleItems.map((item) => (
            <FilterItem
              key={item.id}
              id={item.id}
              label={item.label}
              value={item.value}
              dataGroup={item.dataGroup}
              dataField={item.dataField}
              dataText={item.dataText}
              dataOperator={item.dataOperator}
              iconClass={item.iconClass}
              iconStyle={item.iconStyle}
              isColor={isColorGroup} // Truyền prop isColor
              onFilterChange={onFilterChange}
            />
          ))}
          {hasMoreItems && (
            <li className="filter-item-toggle text-center cursor-pointer btn" onClick={toggleExpand}>
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              <svg
                strokeWidth="0"
                viewBox="0 0 512 512"
                color="#0B74E5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: 'rgb(11, 116, 229)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
              </svg>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default FilterGroup;