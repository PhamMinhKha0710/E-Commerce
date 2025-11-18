// components/SortItem.tsx
interface SortItemProps {
    label: string;
    value: string;
    isActive: boolean;
    onSortChange: (value: string) => void;
  }
  
  const SortItem: React.FC<SortItemProps> = ({
    label,
    value,
    isActive,
    onSortChange,
  }) => {
    return (
      <li className={`btn-quick-sort ${value} ${isActive ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onSortChange(value); }}>
          <i></i>
          {label}
        </a>
      </li>
    );
  };
  
  export default SortItem;