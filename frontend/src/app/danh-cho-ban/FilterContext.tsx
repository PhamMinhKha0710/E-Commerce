'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  category: string[];
  subCategory: string[];
  priceRange: { min: number; max: number };
  brand: string[];
  variations: string[];
  sort: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilters: (key: keyof FilterState, value: any) => void;
  clearAllFilters: () => void;
  selectedFilters: Array<{ key: string; value: string; label: string }>;
}

const defaultFilters: FilterState = {
  category: [],
  subCategory: [],
  priceRange: { min: 0, max: 100000000 },
  brand: [],
  variations: [],
  sort: 'default',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedFilters, setSelectedFilters] = useState<Array<{ key: string; value: string; label: string }>>([]);

  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update selected filters list
    if (key === 'priceRange' && value.min !== 0 || value.max !== 100000000) {
      setSelectedFilters((prev) => [
        ...prev.filter((f) => f.key !== 'priceRange'),
        { key: 'priceRange', value: JSON.stringify(value), label: `${value.min.toLocaleString('vi-VN')}đ - ${value.max.toLocaleString('vi-VN')}đ` }
      ]);
    } else if (key === 'brand' || key === 'category' || key === 'variations') {
      // Handle array filters
      if (Array.isArray(value) && value.length > 0) {
        const labels = value.map((v: string) => ({ key, value: v, label: v }));
        setSelectedFilters((prev) => [
          ...prev.filter((f) => f.key !== key),
          ...labels
        ]);
      } else {
        setSelectedFilters((prev) => prev.filter((f) => f.key !== key));
      }
    } else if (key === 'sort') {
      // Don't show sort in selected filters
    }
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setSelectedFilters([]);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, clearAllFilters, selectedFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

