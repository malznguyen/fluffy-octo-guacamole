'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ShoppingCart, DollarSign, Package, Clock,
  TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import apiClient from '@/lib/axios';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  soldCount: number;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  ordersByDay: { date: string; amount: number }[];
  statusCounts: Record<string, number>;
  recentOrders: Order[];
  topProducts: Product[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',    // amber-500
  CONFIRMED: '#3b82f6',  // blue-500
  SHIPPED: '#8b5cf6',    // purple-500
  DELIVERED: '#6366f1',  // indigo-500
  COMPLETED: '#10b981',  // green-500
  CANCELLED: '#ef4444',  // red-500
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const STATUS_BADGES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    ordersByDay: [],
    statusCounts: {},
    recentOrders: [],
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch orders
        let orders: Order[] = [];
        const ordersRes = await apiClient.get('/admin/orders?page=0&size=1000');
        orders = ordersRes.data?.data?.content || ordersRes.data?.content || [];

        // Fetch products
        let products: Product[] = [];
        try {
          const productsRes = await apiClient.get('/admin/products');
          products = productsRes.data?.data || productsRes.data || [];
        } catch (e) {
          const publicProductsRes = await apiClient.get('/public/products');
          products = publicProductsRes.data?.data?.content || publicProductsRes.data?.content || [];
        }

        // Calculate stats
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

        // Group by date for chart (last 7 days)
        const last7Days: Record<string, number> = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          last7Days[key] = 0;
        }

        orders.forEach(order => {
          if (order.createdAt) {
            const dateKey = order.createdAt.split('T')[0];
            if (last7Days[dateKey] !== undefined) {
              last7Days[dateKey] += order.total || 0;
            }
          }
        });

        // Status counts
        const statusCounts = orders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Recent orders (8 mới nhất)
        const sortedOrders = [...orders].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Top products by soldCount
        const topProducts = [...products]
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
          .slice(0, 5);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          pendingOrders,
          ordersByDay: Object.entries(last7Days).map(([date, amount]) => ({
            date: date.split('-')[2] + '/' + date.split('-')[1],
            amount: Math.round(amount / 1000000 * 10) / 10, // Chuyển sang triệu
          })),
          statusCounts,
          recentOrders: sortedOrders.slice(0, 8),
          topProducts,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = Object.entries(stats.statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#94a3b8',
  }));

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 h-80 bg-slate-200 rounded-xl" />
            <div className="h-80 bg-slate-200 rounded-xl" />
          </div>
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
            Bảng điều khiển
          </h1>
          <p className="text-slate-500 mt-1">Xin chào, đây là tổng quan hệ thống hôm nay</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeRange === range
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {range === 'today' ? 'Hôm nay' : range === 'week' ? 'Tuần này' : 'Tháng này'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders - Blue */}
        <StatCard
          icon={ShoppingCart}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          borderColor="border-blue-500"
          label="Tổng đơn hàng"
          value={`${stats.totalOrders.toLocaleString('vi-VN')} đơn`}
          trend={{ value: 12, isUp: true }}
        />

        {/* Total Revenue - Green */}
        <StatCard
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          borderColor="border-green-500"
          label="Tổng doanh thu"
          value={formatPrice(stats.totalRevenue) + 'đ'}
          trend={{ value: 8, isUp: true }}
        />

        {/* Total Products - Purple */}
        <StatCard
          icon={Package}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          borderColor="border-purple-500"
          label="Tổng sản phẩm"
          value={`${stats.totalProducts.toLocaleString('vi-VN')} sản phẩm`}
        />

        {/* Pending Orders - Amber */}
        <StatCard
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          borderColor="border-amber-500"
          label="Chờ xác nhận"
          value={`${stats.pendingOrders} đơn`}
          alert={stats.pendingOrders > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800">
              Biểu đồ doanh thu 7 ngày qua
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Triệu đồng</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.ordersByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                  formatter={(value: any) => [`${value} triệu đồng`, 'Doanh thu']}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-6">
            Trạng thái đơn hàng
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any, name: any) => [`${value} đơn`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800">
            Đơn hàng gần đây
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Xem tất cả
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ngày đặt
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.orderCode}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        #{order.orderCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-800">
                        {order.customerName || 'Khách vãng lai'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-slate-800">
                        {formatPrice(order.total)}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_BADGES[order.status] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-6">
            Sản phẩm bán chạy
          </h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-slate-200 text-slate-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                  }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                </div>
                <div className="text-sm text-slate-500">
                  Đã bán: <span className="font-semibold text-slate-800">{product.soldCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  label: string;
  value: string;
  trend?: { value: number; isUp: boolean };
  alert?: boolean;
}

function StatCard({ icon: Icon, iconBg, iconColor, borderColor, label, value, trend, alert }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 ${borderColor} relative overflow-hidden`}>
      {alert && (
        <div className="absolute top-4 right-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{trend.value}% so với hôm qua</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
