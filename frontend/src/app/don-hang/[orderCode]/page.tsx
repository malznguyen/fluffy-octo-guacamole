"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, X, AlertCircle } from "lucide-react";
import { orderApi } from "@/lib/api/services";
import { OrderDTO, OrderItemDTO } from "@/lib/api/types";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Format price in VND with data sanitization
function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "0 ₫";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format date to dd/MM/yyyy HH:mm with data sanitization
function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "--/--/---- --:--";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--/--/---- --:--";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Status configuration mapping - Brutalist style
const STATUS_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
  PENDING: {
    label: "ĐANG XỬ LÝ",
    bgColor: "bg-yellow-400",
    textColor: "text-black",
  },
  CONFIRMED: {
    label: "ĐÃ XÁC NHẬN",
    bgColor: "bg-neutral-900",
    textColor: "text-white",
  },
  SHIPPED: {
    label: "ĐANG GIAO",
    bgColor: "bg-neutral-700",
    textColor: "text-white",
  },
  DELIVERED: {
    label: "HOÀN THÀNH",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  COMPLETED: {
    label: "HOÀN THÀNH",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  CANCELLED: {
    label: "ĐÃ HỦY",
    bgColor: "bg-white",
    textColor: "text-black",
  },
};

// Status Badge Component - Brutalist style
function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || {
    label: status?.toUpperCase() || "KHÔNG XÁC ĐỊNH",
    bgColor: "bg-neutral-200",
    textColor: "text-neutral-700",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 text-xs font-bold tracking-[0.1em] border border-black ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}

// Payment method display mapping
const PAYMENT_METHOD_MAP: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

// Payment status display mapping
const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", color: "text-red-600" },
  PENDING: { label: "Đang chờ", color: "text-yellow-600" },
  PAID: { label: "Đã thanh toán", color: "text-green-600" },
  FAILED: { label: "Thanh toán thất bại", color: "text-red-600" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-neutral-500" },
};

// Loading Skeleton
function OrderDetailSkeleton() {
  return (
    <AccountLayout>
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b border-black pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="h-10 w-64 bg-neutral-200" />
            <div className="h-8 w-32 bg-neutral-200" />
          </div>
          <div className="h-4 w-48 bg-neutral-200 mt-4" />
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-black p-6">
            <div className="h-5 w-48 bg-neutral-200 mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-neutral-200" />
              <div className="h-4 w-3/4 bg-neutral-200" />
              <div className="h-4 w-1/2 bg-neutral-200" />
            </div>
          </div>
          <div className="border border-black p-6">
            <div className="h-5 w-32 bg-neutral-200 mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-neutral-200" />
              <div className="h-4 w-2/3 bg-neutral-200" />
            </div>
          </div>
        </div>

        {/* Items Skeleton */}
        <div className="border border-black mb-8">
          <div className="h-12 bg-neutral-100 border-b border-black" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-black flex gap-4">
              <div className="w-20 h-20 bg-neutral-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-neutral-200" />
                <div className="h-3 w-24 bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

// Not Found State
function OrderNotFound() {
  return (
    <AccountLayout>
      <div className="flex flex-col items-center justify-center border border-black py-20">
        <AlertCircle className="w-16 h-16 text-neutral-400 mb-6" strokeWidth={1} />
        <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-2">
          Không tìm thấy đơn hàng
        </h2>
        <p className="text-xs text-neutral-500 mb-8 uppercase tracking-wide">
          Đơn hàng này không tồn tại hoặc đã bị xóa
        </p>
        <Link href="/don-hang">
          <Button className="bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.15em] uppercase px-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    </AccountLayout>
  );
}

// Main Page Component
export default function OrderDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const orderCode = params.orderCode as string;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderCode],
    queryFn: () => orderApi.getOrderDetail(orderCode),
    enabled: !!orderCode,
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderApi.cancelOrder(orderCode),
    onSuccess: () => {
      toast.success("Đơn hàng đã được hủy thành công");
      queryClient.invalidateQueries({ queryKey: ["order", orderCode] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    },
  });

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return <OrderNotFound />;
  }

  const isPending = order.status === "PENDING";
  const paymentMethod = PAYMENT_METHOD_MAP[order.paymentMethod] || order.paymentMethod || "Không xác định";
  const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus || "UNPAID"] || { label: order.paymentStatus || "Không xác định", color: "text-neutral-600" };
  const recipientName = order.recipientName || order.customerName || "Không có tên";
  const orderItems = order.items || order.orderItems || [];

  return (
    <AccountLayout>
      {/* Top Bar */}
      <div className="border-b border-black pb-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.1em]">
                ĐƠN HÀNG #{order.orderCode}
              </h1>
              <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">
                Ngày đặt: {formatDateTime(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Info Box */}
          <div className="border border-black">
            <div className="bg-neutral-50 border-b border-black px-6 py-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]">
                Thông tin giao hàng
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">NgườI nhận</span>
                <p className="font-medium text-sm mt-1">{recipientName}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">Số điện thoạI</span>
                <code className="block font-mono text-sm mt-1">{order.phone || "--"}</code>
              </div>
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">Địa chỉ</span>
                <code className="block font-mono text-sm mt-1 leading-relaxed">
                  {order.shippingAddress || "Không có địa chỉ"}
                </code>
              </div>
              {order.note && (
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">Ghi chú</span>
                  <p className="text-sm mt-1 text-neutral-600">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="border border-black">
            <div className="bg-neutral-50 border-b border-black px-6 py-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]">
                Thanh toán
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">Phương thức</span>
                <p className="font-medium text-sm mt-1">{paymentMethod}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wide">Trạng thái thanh toán</span>
                <p className={`text-sm mt-1 font-medium ${paymentStatus.color}`}>
                  {paymentStatus.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border border-black mb-8">
          <div className="bg-neutral-50 border-b border-black px-6 py-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em]">
              Sản phẩm trong đơn
            </h2>
          </div>
          <div>
            {orderItems.map((item: OrderItemDTO, index: number) => (
              <div
                key={index}
                className="p-4 border-b border-black last:border-b-0 flex gap-4 items-center"
              >
                {/* Product Image */}
                <div className="w-20 h-20 border border-neutral-200 flex-shrink-0 overflow-hidden bg-neutral-50">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productNameSnapshot || item.productName || "Sản phẩm"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm uppercase tracking-wide truncate">
                    {item.productNameSnapshot || item.productName || "Sản phẩm không tên"}
                  </p>
                  {(item.variantInfoSnapshot || item.variantInfo || item.size || item.color) && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.variantInfoSnapshot || item.variantInfo || `${item.size || ""} ${item.color || ""}`.trim()}
                    </p>
                  )}
                </div>

                {/* Quantity x Price */}
                <div className="text-right">
                  <p className="text-xs text-neutral-500">
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                  <code className="block font-mono text-sm font-bold mt-1">
                    {formatPrice(item.subtotal)}
                  </code>
                </div>
              </div>
            ))}

            {orderItems.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-neutral-500">Không có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Action Bar */}
        <div className="border-t border-black pt-6">
          {/* Total Summary */}
          <div className="flex justify-end items-center mb-8">
            <div className="text-right">
              <span className="text-xs text-neutral-500 uppercase tracking-[0.1em] mr-4">
                Tổng cộng
              </span>
              <code className="text-2xl font-mono font-bold">
                {formatPrice(order.totalAmount || order.total)}
              </code>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/don-hang">
              <Button
                variant="outline"
                className="border-black text-xs font-bold tracking-[0.1em] uppercase bg-white hover:bg-black hover:text-white transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            </Link>

            {isPending ? (
              <Button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white text-xs font-bold tracking-[0.1em] uppercase px-8"
              >
                <X className="mr-2 h-4 w-4" />
                {cancelMutation.isPending ? "Đang hủy..." : "Hủy đơn hàng"}
              </Button>
            ) : null}
          </div>
        </div>
    </AccountLayout>
  );
}
