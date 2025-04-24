// components/FilterItem.tsx
"use client";
import { useState } from 'react';

interface FilterItemProps {
  id: string;
  label: string;
  value: string;
  dataGroup: string;
  dataField: string;
  dataText: string;
  dataOperator: string;
  iconClass?: string;
  iconStyle?: React.CSSProperties;
  isColor?: boolean; // Thêm prop để xác định là ô màu
  onFilterChange: (value: string, checked: boolean) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  id,
  label,
  value,
  dataGroup,
  dataField,
  dataText,
  dataOperator,
  iconClass,
  iconStyle,
  isColor = false,
  onFilterChange,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onFilterChange(value, e.target.checked);
  };

  return (
    <li className={`filter-item ${isColor ? 'color' : ''} filter-item--check-box filter-item--green`}>
      <span>
        <label htmlFor={id}>
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={handleChange}
            data-group={dataGroup}
            data-field={dataField}
            data-text={dataText}
            value={value}
            data-operator={dataOperator}
          />
          {isColor ? (
            <>
              <i className={`fa ${iconClass || ''}`} style={iconStyle}></i>
              <span className="d-none">{label}</span>
            </>
          ) : (
            <>
              <i className={`fa ${iconClass || ''}`} style={iconStyle}></i>
              {label}
            </>
          )}
        </label>
      </span>
    </li>
  );
};

export default FilterItem;