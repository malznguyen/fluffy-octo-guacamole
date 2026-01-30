'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  PackageX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductForm } from '@/components/admin/products/product-form';
import { DeleteDialog } from '@/components/admin/products/delete-dialog';
import {
  useAdminProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/use-products';
import {
  ProductDTO,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product';
import { formatPrice } from '@/lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const ITEMS_PER_PAGE = 10;

type SortField = 'name' | 'basePrice' | 'soldCount' | 'createdAt' | 'categoryName' | 'isVisible';
type SortOrder = 'asc' | 'desc';

export default function AdminProductsPage() {
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductDTO | null>(null);

  // Queries
  const { data: products = [], isLoading, error } = useAdminProducts();
  const { data: categories = [] } = useCategories();

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Filter và sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId.toString() === categoryFilter);
    }

    // Visibility filter
    if (visibilityFilter !== 'all') {
      result = result.filter(
        (p) => p.isVisible === (visibilityFilter === 'visible')
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Xử lý boolean cho isVisible
      if (sortField === 'isVisible') {
        const aNum = aValue ? 1 : 0;
        const bNum = bValue ? 1 : 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return (aValue as any) < (bValue as any) ? -1 : (aValue as any) > (bValue as any) ? 1 : 0;
      } else {
        return (aValue as any) > (bValue as any) ? -1 : (aValue as any) < (bValue as any) ? 1 : 0;
      }
    });

    return result;
  }, [products, searchQuery, categoryFilter, visibilityFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: ProductDTO) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: ProductDTO) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingProduct(null);
        },
      });
    }
  };

  const handleFormSubmit = (data: CreateProductRequest | UpdateProductRequest) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, data: data as UpdateProductRequest },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingProduct(null);
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateProductRequest, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  // Helpers
  const getPrimaryImage = (product: ProductDTO) => {
    const images = product.images || [];
    // Tìm ảnh có isPrimary = true, nếu không có thì lấy ảnh đầu tiên
    const primary = images.find((img) => img.isPrimary === true);
    return primary || images[0] || null;
  };

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // API trả về /backend/uploads/... nên cần nối với base URL
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    return `${baseUrl}${url}`;
  };

  const getTotalStock = (product: ProductDTO) => {
    return (product.variants || []).reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  };

  const getFirstSku = (product: ProductDTO) => {
    const firstVariant = (product.variants || [])[0];
    const sku = firstVariant?.sku;
    // Đảm bảo SKU là string, không phải số hay undefined
    if (!sku || typeof sku !== 'string') return 'N/A';
    return sku;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-500" />
    );
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Không thể tải danh sách sản phẩm
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Đã có lỗi xảy ra'}
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-slate-800">
            Quản lý sản phẩm
          </h1>
          <p className="text-slate-500 mt-1">
            {isLoading
              ? 'Đang tải...'
              : `${filteredProducts.length} sản phẩm`}
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên, slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {(categories || []).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visibility Filter */}
          <div className="w-full lg:w-40">
            <Select
              value={visibilityFilter}
              onValueChange={(value) => {
                setVisibilityFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="visible">Hiển thị</SelectItem>
                <SelectItem value="hidden">Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Sản phẩm
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-100 text-right"
                  onClick={() => handleSort('basePrice')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Giá
                    <SortIcon field="basePrice" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('categoryName')}
                >
                  <div className="flex items-center gap-1">
                    Danh mục
                    <SortIcon field="categoryName" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('isVisible')}
                >
                  <div className="flex items-center gap-1">
                    Trạng thái
                    <SortIcon field="isVisible" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-100 text-center"
                  onClick={() => handleSort('soldCount')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Đã bán
                    <SortIcon field="soldCount" />
                  </div>
                </TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-16 text-center">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Không tìm thấy sản phẩm nào
                    </h3>
                    <p className="text-slate-500 mb-4">
                      {searchQuery || categoryFilter !== 'all' || visibilityFilter !== 'all'
                        ? 'Thử thay đổi bộ lọc tìm kiếm'
                        : 'Bắt đầu bằng cách thêm sản phẩm mới'}
                    </p>
                    {!searchQuery && categoryFilter === 'all' && visibilityFilter === 'all' && (
                      <Button onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => {
                  const primaryImage = getPrimaryImage(product);
                  const totalStock = getTotalStock(product);

                  return (
                    <TableRow
                      key={product.id}
                      className="group hover:bg-slate-50"
                    >
                      {/* Image */}
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                          {primaryImage?.imageUrl ? (
                            <img
                              src={getImageUrl(primaryImage.imageUrl)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="font-medium text-slate-900 hover:text-blue-600"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-slate-500">{product.slug}</p>
                        </div>
                      </TableCell>

                      {/* SKU */}
                      <TableCell>
                        {(() => {
                          const variants = product.variants || [];
                          const firstVariant = variants[0];
                          const firstSku = firstVariant?.sku;
                          const hasMultiple = variants.length > 1;

                          // Kiểm tra SKU hợp lệ (phải là string không rỗng)
                          if (!firstSku || typeof firstSku !== 'string' || firstSku.trim() === '') {
                            return <span className="text-slate-400 text-sm">Chưa có SKU</span>;
                          }

                          return (
                            <div className="font-mono text-xs">
                              <span className="bg-slate-100 px-2 py-1 rounded">
                                {firstSku}
                              </span>
                              {hasMultiple && (
                                <span className="text-slate-400 ml-1">(+{variants.length - 1})</span>
                              )}
                            </div>
                          );
                        })()}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-right">
                        <span className="font-medium">
                          {formatPrice(product.basePrice)}
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {product.categoryName}
                        </span>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="text-center">
                        {(() => {
                          const variants = product.variants || [];
                          if (variants.length === 0) {
                            return (
                              <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                                <Package className="w-4 h-4" />
                                Chưa có biến thể
                              </span>
                            );
                          }
                          if (totalStock === 0) {
                            return (
                              <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                                <PackageX className="w-4 h-4" />
                                Hết hàng
                              </span>
                            );
                          }
                          return (
                            <span
                              className={`inline-flex items-center gap-1 text-sm font-medium ${totalStock < 10 ? 'text-amber-600' : 'text-green-600'
                                }`}
                            >
                              <Package className="w-4 h-4" />
                              {totalStock}
                            </span>
                          );
                        })()}
                      </TableCell>

                      {/* Visibility */}
                      <TableCell>
                        {product.isVisible ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Hiển thị
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-100"
                          >
                            <EyeOff className="w-3 h-3 mr-1" />
                            Ẩn
                          </Badge>
                        )}
                      </TableCell>

                      {/* Sold Count */}
                      <TableCell className="text-center">
                        <span className="text-sm font-medium">
                          {product.soldCount.toLocaleString('vi-VN')}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 w-40"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="flex items-center w-full"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Xem trên shop
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} trong{' '}
              {filteredProducts.length} sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[36px]"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Dialog */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={confirmDelete}
        productName={deletingProduct?.name || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
