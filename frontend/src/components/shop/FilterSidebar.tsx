'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CategoryDTO } from '@/lib/api/types';

interface FilterSidebarProps {
  categories: CategoryDTO[];
  selectedCategoryId?: number;
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  searchQuery: string;
  onCategoryChange: (categoryId?: number) => void;
  onPriceChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

const MAX_PRICE = 5000000;

export function FilterSidebar({
  categories,
  selectedCategoryId,
  minPrice,
  maxPrice,
  priceRange,
  searchQuery,
  onCategoryChange,
  onPriceChange,
  onSearchChange,
  onReset,
}: FilterSidebarProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const hasActiveFilters = selectedCategoryId !== undefined || 
    priceRange[0] > 0 || 
    priceRange[1] < MAX_PRICE || 
    searchQuery.length > 0;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-24 h-fit space-y-10"
    >
      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Tìm Kiếm
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-neutral-200 focus:border-neutral-900 transition-colors rounded-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Danh Mục
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange(undefined)}
              className={`text-sm transition-all duration-200 ${
                selectedCategoryId === undefined
                  ? 'font-semibold text-neutral-900 underline underline-offset-4'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tất Cả
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`text-sm transition-all duration-200 ${
                  selectedCategoryId === category.id
                    ? 'font-semibold text-neutral-900 underline underline-offset-4'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Khoảng Giá
        </h3>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          value={priceRange}
          max={MAX_PRICE}
          step={100000}
          minStepsBetweenThumbs={1}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between items-center text-sm text-neutral-600">
          <span>{formatPrice(priceRange[0])}đ</span>
          <span className="text-neutral-300">—</span>
          <span>{formatPrice(priceRange[1])}đ</span>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs tracking-wider text-neutral-500 hover:text-neutral-900 px-0"
          >
            <X className="h-3 w-3 mr-1" />
            XÓA BỘ LỌC
          </Button>
        </motion.div>
      )}
    </motion.aside>
  );
}
