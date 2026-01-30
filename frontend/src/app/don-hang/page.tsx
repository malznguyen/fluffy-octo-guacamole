"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { orderApi } from "@/lib/api/services";
import { OrderDTO } from "@/lib/api/types";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Button } from "@/components/ui/button";

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

// Format date to dd/mm/yyyy with data sanitization
function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "--/--/----";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--/--/----";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Filter tabs configuration
type FilterStatus = "ALL" | "PENDING" | "SHIPPING" | "DONE" | "CANCEL";

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "PENDING", label: "PENDING" },
  { key: "SHIPPING", label: "SHIPPING" },
  { key: "DONE", label: "DONE" },
  { key: "CANCEL", label: "CANCEL" },
];

// Status configuration - Text only with colored dot
const STATUS_CONFIG: Record<string, { label: string; dotColor: string }> = {
  PENDING: {
    label: "PENDING",
    dotColor: "bg-yellow-400",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    dotColor: "bg-blue-400",
  },
  SHIPPED: {
    label: "SHIPPING",
    dotColor: "bg-purple-400",
  },
  DELIVERED: {
    label: "DONE",
    dotColor: "bg-green-500",
  },
  COMPLETED: {
    label: "DONE",
    dotColor: "bg-green-500",
  },
  CANCELLED: {
    label: "CANCEL",
    dotColor: "bg-red-400",
  },
};

// Status Badge Component - Text only with dot
function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || {
    label: status?.toUpperCase() || "UNKNOWN",
    dotColor: "bg-gray-400",
  };

  return (
    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-600">
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}

// Filter Tabs Component
function FilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}) {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-8">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`pb-3 text-xs uppercase tracking-wider transition-colors duration-200 border-b-2 -mb-[1px] ${
            activeFilter === tab.key
              ? "text-black border-black font-medium"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Order Row Component
function OrderRow({ order }: { order: OrderDTO }) {
  const formattedDate = formatDate(order.createdAt);

  return (
    <Link href={`/don-hang/${order.orderCode}`}>
      <div className="group flex items-center justify-between py-5 border-b border-gray-100 hover:bg-neutral-50 transition-colors duration-200 cursor-pointer">
        {/* Left: Order Code & Date */}
        <div className="flex-1 min-w-0">
          <code className="font-mono text-lg font-bold text-black block">
            #{order.orderCode || "ORD-XXXX"}
          </code>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {formattedDate}
          </span>
        </div>

        {/* Middle: Status */}
        <div className="flex-shrink-0 px-4">
          <StatusBadge status={order.status} />
        </div>

        {/* Right: Price & Action */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <code className="font-mono text-lg text-black">
            {formatPrice(order.totalAmount)}
          </code>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors duration-200" />
        </div>
      </div>
    </Link>
  );
}

// Order Row Skeleton
function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 animate-pulse">
      <div className="flex-1">
        <div className="h-6 w-32 bg-neutral-200 mb-2" />
        <div className="h-3 w-24 bg-neutral-200" />
      </div>
      <div className="px-4">
        <div className="h-4 w-20 bg-neutral-200" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-6 w-24 bg-neutral-200" />
        <div className="w-4 h-4 bg-neutral-200" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ filter }: { filter: FilterStatus }) {
  const message =
    filter === "ALL"
      ? "Bạn chưa có đơn hàng nào"
      : `Không có đơn hàng ${filter.toLowerCase()}`;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mb-6">
        <Package className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium uppercase tracking-wider mb-2 text-gray-600">
        {message}
      </h3>
      <p className="text-xs text-gray-400 mb-8 uppercase tracking-wide text-center">
        Hãy khám phá các sản phẩm và đặt hàng ngay
      </p>
      <Link href="/cua-hang">
        <Button
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-wider uppercase px-6 py-2 transition-all duration-200"
        >
          <ShoppingBag className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Mua sắm ngay
        </Button>
      </Link>
    </div>
  );
}

// Main Page Component
export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getMyOrders(0, 100),
  });

  const allOrders = data?.content || [];

  // Filter orders based on active filter
  const filteredOrders = allOrders.filter((order: OrderDTO) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PENDING")
      return order.status === "PENDING" || order.status === "CONFIRMED";
    if (activeFilter === "SHIPPING") return order.status === "SHIPPED";
    if (activeFilter === "DONE")
      return order.status === "DELIVERED" || order.status === "COMPLETED";
    if (activeFilter === "CANCEL") return order.status === "CANCELLED";
    return true;
  });

  const hasOrders = filteredOrders.length > 0;

  return (
    <AccountLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-black">
          LỊCH SỬ ĐƠN HÀNG
        </h1>
      </div>

      {/* Filter Tabs */}
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Order List */}
      {isLoading ? (
        <div>
          <OrderRowSkeleton />
          <OrderRowSkeleton />
          <OrderRowSkeleton />
        </div>
      ) : hasOrders ? (
        <div>
          {filteredOrders.map((order: OrderDTO) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState filter={activeFilter} />
      )}
    </AccountLayout>
  );
}
