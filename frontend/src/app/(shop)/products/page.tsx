'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, PackageX, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters, { FilterState } from '@/components/product/ProductFilters';
import { fetchProducts } from '@/lib/api';
import { ProductDTO } from '@/types/product';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  const isLoadingRef = useRef(false);
  const isUpdatingURLRef = useRef(false);

  // Parse URL params on mount
  useEffect(() => {
    const page = searchParams.get('page');
    const size = searchParams.get('size');
    const sortBy = searchParams.get('sortBy');
    const sortDir = searchParams.get('sortDir');
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    setFilters({
      search: search || '',
      categoryId: categoryId ? parseInt(categoryId) : null,
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      sortBy: sortBy || 'createdAt',
      sortDir: sortDir || 'desc',
    });

    setCurrentPage(page ? parseInt(page) : 0);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      if (isLoadingRef.current) return;
      
      isLoadingRef.current = true;
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        size: 12,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const result = await fetchProducts(params);
      setProducts(result.content || []);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setLoading(false);
      
      isLoadingRef.current = false;
    };

    loadProducts();
  }, [currentPage, filters]);

  // Update URL when filters change
  const updateURL = (newFilters: Partial<FilterState>, newPage?: number) => {
    if (isUpdatingURLRef.current) return;
    isUpdatingURLRef.current = true;

    const params = new URLSearchParams();
    
    if (newPage !== undefined) {
      params.set('page', newPage.toString());
    } else {
      params.set('page', currentPage.toString());
    }

    if (newFilters.search !== undefined) {
      if (newFilters.search) params.set('search', newFilters.search);
      else params.delete('search');
    } else if (filters.search) {
      params.set('search', filters.search);
    }

    if (newFilters.categoryId !== undefined) {
      if (newFilters.categoryId) {
        if (Array.isArray(newFilters.categoryId)) {
          newFilters.categoryId.forEach(id => params.append('categoryId', id.toString()));
        } else {
          params.set('categoryId', newFilters.categoryId.toString());
        }
      } else {
        params.delete('categoryId');
      }
    } else if (filters.categoryId) {
      if (Array.isArray(filters.categoryId)) {
        filters.categoryId.forEach(id => params.append('categoryId', id.toString()));
      } else {
        params.set('categoryId', filters.categoryId.toString());
      }
    }

    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
      else params.delete('minPrice');
    } else if (filters.minPrice) {
      params.set('minPrice', filters.minPrice.toString());
    }

    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
      else params.delete('maxPrice');
    } else if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice.toString());
    }

    params.set('sortBy', filters.sortBy);
    params.set('sortDir', filters.sortDir);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    setTimeout(() => {
      isUpdatingURLRef.current = false;
    }, 100);
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
      minPrice: null,
      maxPrice: null,
      sortBy: 'createdAt',
      sortDir: 'desc',
    };
    setFilters(clearedFilters);
    setCurrentPage(0);
    updateURL(clearedFilters, 0);
  };

  const hasActiveFilters = filters.search || filters.categoryId || filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm uppercase tracking-wider text-neutral-600 mb-4">
            <a href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">Sản phẩm</span>
          </nav>

          {/* Heading */}
          <h1 className="text-4xl font-black uppercase tracking-tight text-neutral-900 mb-2">
            Tất cả sản phẩm
          </h1>

          {/* Product Count */}
          <p className="text-neutral-600">
            {totalElements} sản phẩm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>
          </aside>

          {/* Right Content - Product Grid */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm">
                    Tìm kiếm: {filters.search}
                    <button
                      onClick={() => handleFilterChange({ ...filters, search: '' })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.categoryId && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm">
                    Danh mục
                    <button
                      onClick={() => handleFilterChange({ ...filters, categoryId: null })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-sm">
                    Giá
                    <button
                      onClick={() => handleFilterChange({ ...filters, minPrice: null, maxPrice: null })}
                      className="hover:text-neutral-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

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
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-12">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="p-2 border border-neutral-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalPages }, (_, i) => {
                            const pageNum = i;
                            const isCurrentPage = pageNum === currentPage;
                            const isNearCurrent = Math.abs(pageNum - currentPage) <= 1 || pageNum === 0 || pageNum === totalPages - 1;
                            
                            if (!isNearCurrent && i > 0 && !Array.from({ length: totalPages }, (_, j) => Math.abs(j - currentPage) <= 1 || j === 0 || j === totalPages - 1).slice(i - 1, i).length) {
                              return <span key={i} className="px-2">...</span>;
                            }
                            
                            return (
                              <button
                                key={i}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 font-medium transition-colors ${
                                  isCurrentPage
                                    ? 'bg-neutral-900 text-white'
                                    : 'border border-neutral-300 hover:border-black'
                                }`}
                              >
                                {pageNum + 1}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                          className="p-2 border border-neutral-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* Page Info */}
                    {totalPages > 1 && (
                      <div className="text-center mt-4 text-sm text-neutral-600">
                        Trang {currentPage + 1} / {totalPages}
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20">
                    <PackageX className="w-16 h-16 text-neutral-300 mb-4" strokeWidth={1} />
                    <p className="text-lg text-neutral-600 mb-6">
                      Không tìm thấy sản phẩm nào
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-neutral-900 text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
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
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
