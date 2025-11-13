// components/FilterContainer.tsx
"use client"
import { useState, useMemo } from 'react';
import FilterGroup from '@/app/collections/all/FilterGroup';
import SortItem from '@/app/collections/all/SortItem';
import { useFilters } from '@/app/collections/all/FilterContext';
import './FilterContainer.css';

const sortData = [
  { label: 'Mặc định', value: 'default' },
  { label: 'Tên A-Z', value: 'alpha-asc' },
  { label: 'Tên Z-A', value: 'alpha-desc' },
  { label: 'Giá thấp đến cao', value: 'price-asc' },
  { label: 'Giá cao xuống thấp', value: 'price-desc' },
];

const priceData = [
  { id: 'filter-duoi-100-000d', label: 'Giá dưới 100.000đ', value: '(<100000)', dataGroup: 'Khoảng giá', dataField: 'price_min', dataText: 'Dưới 100.000đ', dataOperator: 'OR' },
  { id: 'filter-100-000d-200-000d', label: '100.000đ - 200.000đ', value: '(>100000 AND <200000)', dataGroup: 'Khoảng giá', dataField: 'price_min', dataText: '100.000đ - 200.000đ', dataOperator: 'OR' },
  { id: 'filter-200-000d-400-000d', label: '200.000đ - 400.000đ', value: '(>200000 AND <400000)', dataGroup: 'Khoảng giá', dataField: 'price_min', dataText: '200.000đ - 400.000đ', dataOperator: 'OR' },
  { id: 'filter-400-000d-700-000d', label: '400.000đ - 700.000đ', value: '(>400000 AND <700000)', dataGroup: 'Khoảng giá', dataField: 'price_min', dataText: '400.000đ - 700.000đ', dataOperator: 'OR' },
  { id: 'filter-tren700-000d', label: 'Giá trên 700.000đ', value: '(>700000)', dataGroup: 'Khoảng giá', dataField: 'price_min', dataText: 'Trên 700.000đ', dataOperator: 'OR' },
];

const colorData = [
  { id: 'filter-trang', label: 'Trắng', value: '("Trắng")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Trắng', dataOperator: 'OR', iconClass: 'trang', iconStyle: { backgroundColor: '#ffffff', border: '1px solid #ebebeb' } },
  { id: 'filter-vang', label: 'Vàng', value: '("Vàng")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Vàng', dataOperator: 'OR', iconClass: 'vang', iconStyle: { backgroundColor: '#f1c40f' } },
  { id: 'filter-tim', label: 'Tím', value: '("Tím")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Tím', dataOperator: 'OR', iconClass: 'tim', iconStyle: { backgroundColor: '#9b59b6' } },
  { id: 'filter-do', label: 'Đỏ', value: '("Đỏ")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Đỏ', dataOperator: 'OR', iconClass: 'do', iconStyle: { backgroundColor: '#e74c3c' } },
  { id: 'filter-xanh', label: 'Xanh', value: '("Xanh")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Xanh', dataOperator: 'OR', iconClass: 'xanh', iconStyle: { backgroundColor: '#2ecc71' } },
  { id: 'filter-hong', label: 'Hồng', value: '("Hồng")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Hồng', dataOperator: 'OR', iconClass: 'hong', iconStyle: { backgroundColor: '#ff00cc' } },
  { id: 'filter-cam', label: 'Cam', value: '("Cam")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Cam', dataOperator: 'OR', iconClass: 'cam', iconStyle: { backgroundColor: '#e67e22' } },
  { id: 'filter-den', label: 'Đen', value: '("Đen")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Đen', dataOperator: 'OR', iconClass: 'den', iconStyle: { backgroundColor: '#333333' } },
  { id: 'filter-ghi', label: 'Ghi', value: '("Ghi")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Ghi', dataOperator: 'OR', iconClass: 'ghi', iconStyle: { backgroundColor: '#bcbbc0' } },
  { id: 'filter-xanh-bien', label: 'Xanh biển', value: '("Xanh biển")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Xanh biển', dataOperator: 'OR', iconClass: 'xanh-bien', iconStyle: { backgroundColor: '#0082be' } },
  { id: 'filter-tim-than', label: 'Tím than', value: '("Tím than")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Tím than', dataOperator: 'OR', iconClass: 'tim-than', iconStyle: { backgroundColor: '#2c3552' } },
  { id: 'filter-xanh-reu', label: 'Xanh rêu', value: '("Xanh rêu")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Xanh rêu', dataOperator: 'OR', iconClass: 'xanh-reu', iconStyle: { backgroundColor: '#8b9d5f' } },
  { id: 'filter-xanh-da-troi', label: 'Xanh da trời', value: '("Xanh da trời")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Xanh da trời', dataOperator: 'OR', iconClass: 'xanh-da-troi', iconStyle: { backgroundColor: '#88c9dd' } },
  { id: 'filter-hong-sen', label: 'Hồng sen', value: '("Hồng sen")', dataGroup: 'tag1', dataField: 'tags', dataText: 'Hồng sen', dataOperator: 'OR', iconClass: 'hong-sen', iconStyle: { backgroundColor: '#e67d9e' } },
];

const FilterContainer: React.FC = () => {
  const { filters, metadata, updateFilters, clearAllFilters: clearFilters, selectedFilters, removeFilter } = useFilters();
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Generate dynamic filter data from API
  const categoryData = useMemo(() => {
    return metadata.categories.map((cat, index) => ({
      id: `filter-cat-${index}`,
      label: cat,
      value: `"${cat}"`,
      dataGroup: 'Danh mục',
      dataField: 'category',
      dataText: cat,
      dataOperator: 'OR'
    }));
  }, [metadata.categories]);

  const brandData = useMemo(() => {
    return metadata.brands.map((brand, index) => ({
      id: `filter-brand-${index}`,
      label: brand,
      value: `"${brand}"`,
      dataGroup: 'Thương hiệu',
      dataField: 'brand',
      dataText: brand,
      dataOperator: 'OR'
    }));
  }, [metadata.brands]);

  const handleSortChange = (value: string) => {
    updateFilters('sort', value);
  };

  const handlePriceChange = (priceLabel: string, checked: boolean) => {
    let newPriceRanges = checked
      ? [...selectedPriceRanges, priceLabel]
      : selectedPriceRanges.filter((item) => item !== priceLabel);
    
    setSelectedPriceRanges(newPriceRanges);

    // Parse price range and update filters
    if (checked) {
      const priceItem = priceData.find(p => p.label === priceLabel);
      if (priceItem) {
        // Extract min and max from value like "(<100000)" or "(>100000 AND <200000)"
        const match = priceItem.value.match(/[<>]\d+/g);
        if (match) {
          let min = 0, max = 100000000;
          match.forEach(m => {
            const num = parseInt(m.slice(1));
            if (m.startsWith('<')) max = num;
            if (m.startsWith('>')) min = num;
          });
          updateFilters('priceRange', { min, max });
        }
      }
    } else if (newPriceRanges.length === 0) {
      updateFilters('priceRange', { min: 0, max: 100000000 });
    }
  };

  const handleTypeChange = (typeLabel: string, checked: boolean) => {
    let newTypes = checked
      ? [...selectedTypes, typeLabel]
      : selectedTypes.filter((item) => item !== typeLabel);
    
    setSelectedTypes(newTypes);
    updateFilters('category', newTypes);
  };

  const handleBrandChange = (brandLabel: string, checked: boolean) => {
    let newBrands = checked
      ? [...selectedBrands, brandLabel]
      : selectedBrands.filter((item) => item !== brandLabel);
    
    setSelectedBrands(newBrands);
    updateFilters('brand', newBrands);
  };

  const handleColorChange = (colorLabel: string, checked: boolean) => {
    let newColors = checked
      ? [...selectedColors, colorLabel]
      : selectedColors.filter((item) => item !== colorLabel);
    
    setSelectedColors(newColors);
    updateFilters('variations', newColors);
  };

  const handleFilterChange = (value: string, checked: boolean) => {
    // General handler - will be mapped to specific handlers
    const priceItem = priceData.find(p => p.label === value);
    const categoryItem = categoryData.find(t => t.label === value);
    const brandItem = brandData.find(v => v.label === value);
    const colorItem = colorData.find(c => c.label === value);

    if (priceItem) handlePriceChange(value, checked);
    else if (categoryItem) handleTypeChange(value, checked);
    else if (brandItem) handleBrandChange(value, checked);
    else if (colorItem) handleColorChange(value, checked);
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    clearFilters();
  };

  return (
    <div className="aside-filter clearfix">
      <div className="aside-hidden-mobile">
        <div className="filter-container">
          <div className="filter-containers">
            <div
              className="filter-container__selected-filter"
              style={{ display: selectedFilters.length > 0 ? 'block' : 'none' }}
            >
              <div className="filter-container__selected-filter-header clearfix">
                <span className="filter-container__selected-filter-header-title">
                  Bạn chọn
                </span>
                <a
                  href="javascript:void(0)"
                  onClick={clearFilters}
                  className="filter-container__clear-all"
                  title="Bỏ hết"
                >
                  Bỏ hết
                </a>
              </div>
              <div className="filter-container__selected-filter-list clearfix">
                <ul>
                  {selectedFilters.map((filter, index) => (
                    <li key={`${filter.key}-${filter.value}-${index}`}>
                      <a
                        href="javascript:void(0)"
                        onClick={() => removeFilter(filter.key, filter.value)}
                        className="filter-tag-remove"
                      >
                        <span className="filter-tag-close">×</span>
                        {filter.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>

          <div className="block-aside-filter">
            {/* Sắp xếp */}
            <aside className="aside-item filter-sort sort-filtster">
              <div className="aside-title">
                Sắp xếp
                <span className="nd-svg collapsible-plus"></span>
              </div>
              <div className="sort-cate-left aside-content filter-group">
                <ul>
                  {sortData.map((item) => (
                    <SortItem
                      key={item.value}
                      label={item.label}
                      value={item.value}
                      isActive={filters.sort === item.value}
                      onSortChange={handleSortChange}
                    />
                  ))}
                </ul>
              </div>
            </aside>

            {/* Mức giá */}
            <FilterGroup
              title="Chọn mức giá"
              items={priceData}
              className="filter-price"
              onFilterChange={handleFilterChange}
            />

            {/* Danh mục sản phẩm */}
            {categoryData.length > 0 && (
              <FilterGroup
                title="Danh mục sản phẩm"
                items={categoryData}
                className="filter-category"
                onFilterChange={handleFilterChange}
              />
            )}

            {/* Thương hiệu */}
            {brandData.length > 0 && (
              <FilterGroup
                title="Thương hiệu"
                items={brandData}
                className="filter-brand"
                onFilterChange={handleFilterChange}
              />
            )}

            {/* Màu sắc */}
            <FilterGroup
              title="Màu sắc"
              items={colorData}
              className="filter-tag-style-1 tag-color"
              isColorGroup={true} // Truyền prop isColorGroup
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterContainer;