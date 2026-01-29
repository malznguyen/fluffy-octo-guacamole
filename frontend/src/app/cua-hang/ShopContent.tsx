'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';
import { useShopProducts, useFlatCategories } from '@/hooks/useShopProducts';
import {
  SortOption,
  SortOptionType,
  sortLabels,
  shopParamsSchema,
} from '@/lib/schema/shop-params';
import { CategoryDTO } from '@/lib/api/types';
import { Button } from '@/components/ui/button';

const MAX_PRICE = 5000000;

function SortDropdown({
  currentSort,
  onSortChange,
}: {
  currentSort: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group">
          <span className="tracking-wider">
            SẮP XẾP: <span className="text-neutral-900 font-medium">{sortLabels[currentSort].toUpperCase()}</span>
          </span>
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white border border-neutral-200 shadow-lg p-1 z-50"
          sideOffset={5}
          align="end"
        >
          {(Object.keys(SortOption) as Array<keyof typeof SortOption>).map((key) => {
            const value = SortOption[key];
            return (
              <DropdownMenu.Item
                key={value}
                onSelect={() => onSortChange(value)}
                className={`text-sm px-3 py-2 cursor-pointer outline-none transition-colors ${
                  currentSort === value
                    ? 'text-neutral-900 font-medium bg-neutral-100'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {sortLabels[value]}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-500">
      <Link href="/" className="hover:text-neutral-900 transition-colors">
        Trang chủ
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-neutral-900 font-medium">Cửa Hàng</span>
    </nav>
  );
}

// Mobile Filter Drawer Component
function MobileFilterDrawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-[85%] max-w-[360px] bg-white z-50 overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium tracking-wide">Bộ Lọc</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // Parse URL params
  const parseParams = React.useCallback(() => {
    const rawParams = {
      page: searchParams.get('page') ?? undefined,
      size: searchParams.get('size') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };
    return shopParamsSchema.parse(rawParams);
  }, [searchParams]);

  const params = parseParams();

  // Fetch data
  const { data: productsData, isLoading } = useShopProducts({
    page: params.page,
    size: params.size,
    sort: params.sort,
    categoryId: params.categoryId,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    search: params.search || undefined,
  });

  const { data: categories = [] } = useFlatCategories();

  // Flatten categories for the filter sidebar
  const flatCategories = React.useMemo(() => {
    const flatten = (cats: CategoryDTO[]): CategoryDTO[] => {
      return cats.reduce<CategoryDTO[]>((acc, cat) => {
        acc.push(cat);
        if (cat.children && cat.children.length > 0) {
          acc.push(...flatten(cat.children));
        }
        return acc;
      }, []);
    };
    return flatten(categories);
  }, [categories]);

  // Update URL params
  const updateParams = React.useCallback(
    (newParams: Partial<typeof params>) => {
      const updated = { ...params, ...newParams };
      const urlParams = new URLSearchParams();

      if (updated.page !== 1) urlParams.set('page', updated.page.toString());
      if (updated.size !== 12) urlParams.set('size', updated.size.toString());
      if (updated.sort !== SortOption.NEWEST) urlParams.set('sort', updated.sort);
      if (updated.categoryId !== undefined) urlParams.set('categoryId', updated.categoryId.toString());
      if (updated.minPrice !== undefined && updated.minPrice > 0) urlParams.set('minPrice', updated.minPrice.toString());
      if (updated.maxPrice !== undefined && updated.maxPrice < MAX_PRICE) urlParams.set('maxPrice', updated.maxPrice.toString());
      if (updated.search) urlParams.set('search', updated.search);

      const queryString = urlParams.toString();
      router.push(`/cua-hang${queryString ? `?${queryString}` : ''}`);
    },
    [params, router]
  );

  // Handlers
  const handleSortChange = (sort: SortOptionType) => {
    updateParams({ sort, page: 1 });
  };

  const handleCategoryChange = (categoryId?: number) => {
    updateParams({ categoryId, page: 1 });
  };

  const handlePriceChange = (range: [number, number]) => {
    updateParams({ minPrice: range[0], maxPrice: range[1], page: 1 });
  };

  const handleSearchChange = (search: string) => {
    updateParams({ search, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const handleReset = () => {
    router.push('/cua-hang');
  };

  const priceRange: [number, number] = [
    params.minPrice ?? 0,
    params.maxPrice ?? MAX_PRICE,
  ];

  const currentPage = params.page;
  const totalPages = productsData?.totalPages ?? 1;
  const hasMore = currentPage < totalPages;
  const products = productsData?.content ?? [];

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <Breadcrumb />
          </motion.div>
        </div>
      </section>

      {/* Title Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-center"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-neutral-900">
              Bộ Sưu Tập
            </h1>
            <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
              Khám phá những thiết kế mới nhất từ FASH.ON - nơi phong cách gặp gỡ sự tinh tế.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="pb-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Sort Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-100"
          >
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Bộ Lọc
            </Button>

            <SortDropdown currentSort={params.sort} onSortChange={handleSortChange} />
          </motion.div>

          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          >
            <FilterSidebar
              categories={flatCategories}
              selectedCategoryId={params.categoryId}
              minPrice={0}
              maxPrice={MAX_PRICE}
              priceRange={priceRange}
              searchQuery={params.search || ''}
              onCategoryChange={(id) => {
                handleCategoryChange(id);
                setIsMobileFilterOpen(false);
              }}
              onPriceChange={(range) => {
                handlePriceChange(range);
                setIsMobileFilterOpen(false);
              }}
              onSearchChange={(query) => {
                handleSearchChange(query);
                setIsMobileFilterOpen(false);
              }}
              onReset={() => {
                handleReset();
                setIsMobileFilterOpen(false);
              }}
            />
          </MobileFilterDrawer>

          {/* 2-Column Layout */}
          <div className="flex gap-12 lg:gap-16">
            {/* Sidebar - 25% */}
            <div className="hidden lg:block w-[25%]">
              <FilterSidebar
                categories={flatCategories}
                selectedCategoryId={params.categoryId}
                minPrice={0}
                maxPrice={MAX_PRICE}
                priceRange={priceRange}
                searchQuery={params.search || ''}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSearchChange={handleSearchChange}
                onReset={handleReset}
              />
            </div>

            {/* Product Grid - 75% */}
            <div className="flex-1 lg:w-[75%]">
              <ProductGrid products={products} isLoading={isLoading} />

              {/* Pagination */}
              {!isLoading && products.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasMore={hasMore}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
