'use client';

import { useState } from 'react';
import {
  useAdminOrders,
  useUpdateOrderStatus,
  useCancelOrder
} from '@/hooks/use-admin-orders';
import { OrderTable } from '@/components/admin/orders/order-table';
import { OrderDetailDialog } from '@/components/admin/orders/order-detail-dialog';
import { StatusUpdateDialog } from '@/components/admin/orders/status-update-dialog';
import { CancelDialog } from '@/components/admin/orders/cancel-dialog';
import { OrderDTO } from '@/types/order';
import { OrderStatus } from '@/types/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  RotateCcw
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
  // Filters State
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  // Queries
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useAdminOrders({
    page,
    size: ITEMS_PER_PAGE,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined
  });

  // Mutations
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelMutation = useCancelOrder();

  // Handlers
  const handleView = (order: OrderDTO) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleStatusClick = (order: OrderDTO) => {
    setSelectedOrder(order);
    setStatusOpen(true);
  };

  const handleCancelClick = (order: OrderDTO) => {
    setSelectedOrder(order);
    setCancelOpen(true);
  };

  const handleStatusConfirm = (status: OrderStatus) => {
    if (selectedOrder) {
      updateStatusMutation.mutate(
        { orderCode: selectedOrder.orderCode, status },
        {
          onSuccess: () => {
            setStatusOpen(false);
            setSelectedOrder(null);
          },
        }
      );
    }
  };

  const handleCancelConfirm = () => {
    if (selectedOrder) {
      cancelMutation.mutate(selectedOrder.orderCode, {
        onSuccess: () => {
          setCancelOpen(false);
          setSelectedOrder(null);
        },
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page on search
    // Query already bound to searchQuery state
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data?.totalPages || 0;

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Không thể tải danh sách đơn hàng
          </h3>
          <p className="text-red-600 mb-4">
            Đã có lỗi xảy ra khi kết nối với máy chủ.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
            <RotateCcw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
            Quản lý đơn hàng
          </h1>
          <p className="text-neutral-500 mt-1">
            {isLoading ? 'Đang tải...' : `${data?.totalElements || 0} đơn hàng`}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Tìm kiếm mã đơn, tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2 text-neutral-400" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>Chờ xác nhận</SelectItem>
                <SelectItem value={OrderStatus.CONFIRMED}>Đã xác nhận</SelectItem>
                <SelectItem value={OrderStatus.SHIPPED}>Đang giao hàng</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Đã giao hàng</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Hoàn thành</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      {/* Table */}
      <OrderTable
        orders={data?.content || []}
        isLoading={isLoading}
        onView={handleView}
        onUpdateStatus={handleStatusClick}
        onCancel={handleCancelClick}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 border border-neutral-200 rounded-lg shadow-sm">
          <div className="text-sm text-neutral-500">
            Trang {page + 1} / {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {/* Simple Pagination Numbers - Limit to 5 max for UI cleanliness */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show generic page window could be complex, simple version here:
              // If totalPages large, just showing first 5 is misleading. 
              // Better to show simplified sliding window or just arrows + current page if strict logic not provided.
              // Admin/products used full array map.

              // Let's do a simple slice centered around current page
              let startPage = Math.max(0, page - 2);
              const endPage = Math.min(totalPages, startPage + 5);
              if (endPage - startPage < 5) {
                startPage = Math.max(0, endPage - 5);
              }

              // Actually, simply mapping simpler range
              const p = startPage + i;
              if (p >= totalPages) return null;

              return (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(p)}
                  className="w-9"
                >
                  {p + 1}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selectedOrder}
      />

      <StatusUpdateDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onConfirm={handleStatusConfirm}
        order={selectedOrder}
        isPending={updateStatusMutation.isPending}
      />

      <CancelDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleCancelConfirm}
        orderCode={selectedOrder?.orderCode || ''}
        isPending={cancelMutation.isPending}
      />
    </div>
  );
}
