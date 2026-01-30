'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryDTO } from '@/types/product';
import { fetchCategoryTree } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  search: string;
  categoryId: number | number[] | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortDir: string;
}

// Helper function to get all category IDs including children
function getAllCategoryIds(category: CategoryDTO): number[] {
  const ids = [category.id];
  if (category.children && category.children.length > 0) {
    category.children.forEach(child => {
      ids.push(...getAllCategoryIds(child));
    });
  }
  return ids;
}

export default function ProductFilters({ onFilterChange, initialFilters }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [searchDebounce, setSearchDebounce] = useState<string>(filters.search);
  const prevFiltersRef = useRef<FilterState>(filters);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategoryTree().then(setCategories);
  }, []);

  // Sync filters with initialFilters when it changes
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchDebounce }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchDebounce]);

  // Notify parent when filters change (only when values actually change)
  useEffect(() => {
    const hasChanged = 
      prevFiltersRef.current.search !== filters.search ||
      JSON.stringify(prevFiltersRef.current.categoryId) !== JSON.stringify(filters.categoryId) ||
      prevFiltersRef.current.minPrice !== filters.minPrice ||
      prevFiltersRef.current.maxPrice !== filters.maxPrice ||
      prevFiltersRef.current.sortBy !== filters.sortBy ||
      prevFiltersRef.current.sortDir !== filters.sortDir;

    if (hasChanged) {
      prevFiltersRef.current = filters;
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const toggleCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (filters.categoryId === categoryId) {
      // Deselect
      setFilters(prev => ({ ...prev, categoryId: null }));
    } else {
      // Select - include all children
      const allIds = getAllCategoryIds(category);
      setFilters(prev => ({ ...prev, categoryId: allIds }));
    }
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

  const clearSearch = () => {
    setSearchDebounce('');
  };

  const applyPriceRange = () => {
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
    setSearchDebounce('');
  };

  const renderCategory = (category: CategoryDTO, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = filters.categoryId === category.id;

    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id={`category-${category.id}`}
            checked={isSelected}
            onChange={() => toggleCategory(category.id)}
            className="w-5 h-5 accent-neutral-900 cursor-pointer"
          />
          <label
            htmlFor={`category-${category.id}`}
            className="flex-1 flex items-center justify-between cursor-pointer"
          >
            <span className="text-sm text-neutral-700">{category.name}</span>
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleExpanded(category.id);
                }}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </label>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchDebounce}
            onChange={(e) => setSearchDebounce(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
          />
          {searchDebounce && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block">Sắp xếp theo</label>
        <select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split('-');
            setFilters(prev => ({ ...prev, sortBy, sortDir }));
          }}
          className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors bg-white"
        >
          <option value="createdAt-desc">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="soldCount-desc">Bán chạy</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block">Danh mục</label>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {categories.map((category) => renderCategory(category))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-bold uppercase tracking-wider mb-4 block">Khoảng giá</label>
        <div className="space-y-4">
          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Từ</span>
              <span className="font-bold text-neutral-900">
                {filters.minPrice ? formatPrice(filters.minPrice) : '0đ'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.minPrice || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFilters(prev => ({ ...prev, minPrice: value }));
              }}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#171717',
              }}
            />
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Đến</span>
              <span className="font-bold text-neutral-900">
                {filters.maxPrice ? formatPrice(filters.maxPrice) : '10.000.000đ'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.maxPrice || 10000000}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFilters(prev => ({ ...prev, maxPrice: value }));
              }}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: '#171717',
              }}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearAllFilters}
        className="w-full border-2 border-neutral-900 text-neutral-900 py-3 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
