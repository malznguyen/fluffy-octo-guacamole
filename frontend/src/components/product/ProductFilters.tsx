'use client';

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryDTO, ProductDTO } from '@/types/product';
import { formatPrice } from '@/lib/utils';

export interface FilterState {
  search: string;
  categoryId: number | null;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortDir: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: CategoryDTO[];
  allProducts: ProductDTO[];
  loading: boolean;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  categories,
  allProducts,
  loading,
}: ProductFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [priceError, setPriceError] = useState('');

  // Count products per category
  const getCategoryCount = (categoryId: number) => {
    return allProducts.filter(p => p.categoryId === categoryId).length;
  };

  // Count products in category tree (including children)
  const getCategoryTreeCount = (category: CategoryDTO): number => {
    let count = getCategoryCount(category.id);
    if (category.children) {
      category.children.forEach(child => {
        count += getCategoryTreeCount(child);
      });
    }
    return count;
  };

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryChange = (categoryId: number) => {
    const newCategoryId = filters.categoryId === categoryId ? null : categoryId;
    onFilterChange({ ...filters, categoryId: newCategoryId });
  };

  const handleMinPriceChange = (value: string) => {
    const newFilters = { ...filters, minPrice: value };
    validatePrice(newFilters.minPrice, newFilters.maxPrice);
    onFilterChange(newFilters);
  };

  const handleMaxPriceChange = (value: string) => {
    const newFilters = { ...filters, maxPrice: value };
    validatePrice(newFilters.minPrice, newFilters.maxPrice);
    onFilterChange(newFilters);
  };

  const validatePrice = (min: string, max: string) => {
    const minVal = min ? parseInt(min) : null;
    const maxVal = max ? parseInt(max) : null;
    
    if (minVal !== null && maxVal !== null && maxVal <= minVal) {
      setPriceError('Giá đến phải lớn hơn giá từ');
    } else {
      setPriceError('');
    }
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split('-');
    onFilterChange({ ...filters, sortBy, sortDir });
  };

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      categoryId: null,
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
    setPriceError('');
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  const clearCategory = () => {
    onFilterChange({ ...filters, categoryId: null });
  };

  const clearPrice = () => {
    onFilterChange({ ...filters, minPrice: '', maxPrice: '' });
    setPriceError('');
  };

  const hasActiveFilters = filters.search || filters.categoryId || filters.minPrice || filters.maxPrice;

  const getCategoryName = (id: number | null) => {
    if (!id) return '';
    const findCategory = (cats: CategoryDTO[]): CategoryDTO | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findCategory(categories)?.name || '';
  };

  const renderCategory = (category: CategoryDTO, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = filters.categoryId === category.id;
    const count = getCategoryCount(category.id);

    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center gap-2 py-2">
          <input
            type="radio"
            name="category"
            id={`category-${category.id}`}
            checked={isSelected}
            onChange={() => handleCategoryChange(category.id)}
            className="w-4 h-4 accent-neutral-900 cursor-pointer"
          />
          <label
            htmlFor={`category-${category.id}`}
            className="flex-1 flex items-center justify-between cursor-pointer text-sm"
          >
            <span className={`${isSelected ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
              {category.name}
            </span>
            <span className="text-neutral-400 text-xs">({count})</span>
          </label>
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(category.id);
              }}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-4 w-24 bg-neutral-200 animate-pulse mb-4" />
          <div className="h-10 bg-neutral-200 animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-32 bg-neutral-200 animate-pulse mb-4" />
          <div className="h-10 bg-neutral-200 animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-20 bg-neutral-200 animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-6 bg-neutral-200 animate-pulse" />
            <div className="h-6 bg-neutral-200 animate-pulse" />
            <div className="h-6 bg-neutral-200 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="h-4 w-24 bg-neutral-200 animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="h-10 bg-neutral-200 animate-pulse" />
            <div className="h-10 bg-neutral-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block text-neutral-900">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block text-neutral-900">
          Sắp xếp
        </label>
        <select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors bg-white text-sm cursor-pointer"
        >
          <option value="createdAt-desc">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="soldCount-desc">Bán chạy</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block text-neutral-900">
          Danh mục
        </label>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {categories.length === 0 ? (
            <p className="text-sm text-neutral-500">Không có danh mục</p>
          ) : (
            categories.map((category) => renderCategory(category))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block text-neutral-900">
          Khoảng giá
        </label>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Từ</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">đ</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Đến</label>
            <div className="relative">
              <input
                type="number"
                placeholder="10000000"
                value={filters.maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">đ</span>
            </div>
          </div>
          {priceError && (
            <p className="text-xs text-red-500">{priceError}</p>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div>
          <label className="text-sm font-bold uppercase tracking-wider mb-4 block text-neutral-900">
            Bộ lọc đang áp dụng
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.search && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm text-neutral-700">
                Tìm: {filters.search.length > 15 ? filters.search.slice(0, 15) + '...' : filters.search}
                <button
                  onClick={clearSearch}
                  className="hover:text-neutral-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.categoryId && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm text-neutral-700">
                {getCategoryName(filters.categoryId)}
                <button
                  onClick={clearCategory}
                  className="hover:text-neutral-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm text-neutral-700">
                {filters.minPrice ? formatPrice(parseInt(filters.minPrice)) : '0đ'} - {filters.maxPrice ? formatPrice(parseInt(filters.maxPrice)) : '∞'}
                <button
                  onClick={clearPrice}
                  className="hover:text-neutral-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-3 text-sm font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors border border-red-600 hover:bg-red-50"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}
