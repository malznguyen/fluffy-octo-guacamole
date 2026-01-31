'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, PackageX } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import { fetchAllProducts, fetchCategories } from '@/lib/api';
import { ProductDTO, CategoryDTO } from '@/types/product';

const ITEMS_PER_PAGE = 12;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Data states
  const [allProducts, setAllProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoryId: null,
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get('page');
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const sortDir = searchParams.get('sortDir');

    setFilters({
      search: search || '',
      categoryId: categoryId ? parseInt(categoryId) : null,
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      sortBy: sortBy || 'createdAt',
      sortDir: sortDir || 'desc',
    });

    setCurrentPage(page ? parseInt(page) : 0);
  }, [searchParams]);

  // Fetch all products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchAllProducts(),
        fetchCategories(),
      ]);
      setAllProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by category
    if (filters.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }

    // Filter by price range
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : null;
    
    if (minPrice !== null) {
      result = result.filter(p => p.basePrice >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter(p => p.basePrice <= maxPrice);
    }

    // Filter by search text (name or description)
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter(p => 
        (p.name?.toLowerCase() || '').includes(searchLower) || 
        (p.description?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return filters.sortDir === 'asc' 
            ? a.basePrice - b.basePrice 
            : b.basePrice - a.basePrice;
        case 'createdAt':
          return filters.sortDir === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'soldCount':
          return filters.sortDir === 'asc'
            ? a.soldCount - b.soldCount
            : b.soldCount - a.soldCount;
        default:
          return 0;
      }
    });

    return result;
  }, [allProducts, filters]);

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems = filteredProducts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const startItem = totalItems === 0 ? 0 : currentPage * ITEMS_PER_PAGE + 1;
  const endItem = Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalItems);

  // Update URL when filters change
  const updateURL = (newFilters: Partial<FilterState>, newPage?: number) => {
    const params = new URLSearchParams();
    
    const pageToUse = newPage !== undefined ? newPage : currentPage;
    if (pageToUse > 0) {
      params.set('page', pageToUse.toString());
    }

    const mergedFilters = { ...filters, ...newFilters };

    if (mergedFilters.search) params.set('search', mergedFilters.search);
    if (mergedFilters.categoryId) params.set('categoryId', mergedFilters.categoryId.toString());
    if (mergedFilters.minPrice) params.set('minPrice', mergedFilters.minPrice.toString());
    if (mergedFilters.maxPrice) params.set('maxPrice', mergedFilters.maxPrice.toString());
    if (mergedFilters.sortBy !== 'createdAt') params.set('sortBy', mergedFilters.sortBy);
    if (mergedFilters.sortDir !== 'desc') params.set('sortDir', mergedFilters.sortDir);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
    updateURL(newFilters, 0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      updateURL({}, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      categoryId: null,
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
    };
    setFilters(clearedFilters);
    setCurrentPage(0);
    updateURL(clearedFilters, 0);
  };

  const hasActiveFilters = filters.search || filters.categoryId || filters.minPrice || filters.maxPrice;

  // Get category name by ID
  const getCategoryName = (id: number | null) => {
    if (!id) return '';
    const cat = categories.find(c => c.id === id);
    return cat?.name || '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-medium">Sản phẩm</span>
          </nav>

          {/* Heading */}
          <h1 className="text-4xl font-black uppercase tracking-tight text-neutral-900 mb-2">
            Tất cả sản phẩm
          </h1>

          {/* Product Counter */}
          <p className="text-sm text-neutral-600">
            Hiển thị {startItem} - {endItem} / {totalItems} sản phẩm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                allProducts={allProducts}
                loading={loading}
              />
            </div>
          </aside>

          {/* Right Content - Product Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
                    <div className="h-4 bg-neutral-200 animate-pulse rounded" />
                    <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Product Grid */}
                {currentItems.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {currentItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-12">
                        <div className="flex items-center justify-center gap-2">
                          {/* Previous */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="p-2 border border-neutral-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
                            aria-label="Trang trước"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
                              const isCurrentPage = pageNum === currentPage;
                              
                              // Show first page, last page, current page, and pages adjacent to current
                              const shouldShow = 
                                pageNum === 0 || 
                                pageNum === totalPages - 1 || 
                                Math.abs(pageNum - currentPage) <= 1;

                              // Show ellipsis if there's a gap
                              if (!shouldShow) {
                                // Only show one ellipsis between gaps
                                if (pageNum === 1 || pageNum === totalPages - 2) {
                                  return <span key={pageNum} className="px-2 text-neutral-400">...</span>;
                                }
                                return null;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-10 h-10 font-medium transition-colors ${
                                    isCurrentPage
                                      ? 'bg-neutral-900 text-white'
                                      : 'border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-100'
                                  }`}
                                >
                                  {pageNum + 1}
                                </button>
                              );
                            })}
                          </div>

                          {/* Next */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 border border-neutral-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
                            aria-label="Trang sau"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Page Info */}
                        <div className="text-center mt-4 text-sm text-neutral-600">
                          Trang {currentPage + 1} / {totalPages}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 border border-neutral-200">
                    <PackageX className="w-16 h-16 text-neutral-300 mb-4" strokeWidth={1} />
                    <p className="text-lg text-neutral-900 font-medium mb-2">
                      Không tìm thấy sản phẩm nào phù hợp
                    </p>
                    <p className="text-sm text-neutral-600 mb-6">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-8 py-3 border-2 border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-4 w-32 bg-neutral-200 animate-pulse mb-4" />
            <div className="h-10 w-64 bg-neutral-200 animate-pulse mb-2" />
            <div className="h-4 w-48 bg-neutral-200 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
                <div className="h-4 bg-neutral-200 animate-pulse rounded" />
                <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
