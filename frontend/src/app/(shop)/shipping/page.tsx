import Link from 'next/link';
import { Truck, Clock, MapPin, Package, Phone, AlertCircle } from 'lucide-react';

const shippingZones = [
  {
    zone: 'Nội thành Hà Nội',
    time: '1-2 ngày làm việc',
    fee: '20,000đ',
    freeThreshold: 'Miễn phí cho đơn từ 500,000đ',
  },
  {
    zone: 'Các tỉnh miền Bắc',
    time: '2-3 ngày làm việc',
    fee: '30,000đ',
    freeThreshold: 'Miễn phí cho đơn từ 700,000đ',
  },
  {
    zone: 'Các tỉnh miền Trung',
    time: '3-4 ngày làm việc',
    fee: '35,000đ',
    freeThreshold: 'Miễn phí cho đơn từ 700,000đ',
  },
  {
    zone: 'Các tỉnh miền Nam',
    time: '4-5 ngày làm việc',
    fee: '40,000đ',
    freeThreshold: 'Miễn phí cho đơn từ 700,000đ',
  },
];

const notes = [
  'ThờI gian giao hàng được tính từ ngày đơn hàng được xác nhận (không tính chủ nhật và ngày lễ)',
  'Đơn hàng đặt sau 17:00 sẽ được xử lý vào ngày làm việc tiếp theo',
  'Khách hàng sẽ nhận được SMS/email thông báo khi đơn hàng được giao',
  'Vui lòng kiểm tra kỹ sản phẩm trước khi nhận và thanh toán',
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-medium">Chính sách vận chuyển</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <Truck className="w-8 h-8" />
            Chính sách vận chuyển
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview */}
        <div className="bg-blue-50 border border-blue-200 p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <Package className="w-8 h-8 text-blue-700 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">Giao hàng toàn quốc</h2>
              <p className="text-blue-800 leading-relaxed">
                Fash.On hợp tác với các đơn vị vận chuyển uy tín để đảm bảo đơn hàng 
                của bạn được giao nhanh chóng và an toàn đến mọi tỉnh thành trên cả nước.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Zones Table */}
        <div className="border border-neutral-200 overflow-hidden mb-12">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Khu vực và phí vận chuyển
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-neutral-700">
                    Khu vực
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-neutral-700">
                    ThờI gian
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-neutral-700">
                    Phí ship
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-neutral-700">
                    Freeship
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {shippingZones.map((zone, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">{zone.zone}</td>
                    <td className="px-6 py-4 text-neutral-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        {zone.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">{zone.fee}</td>
                    <td className="px-6 py-4 text-green-600 text-sm">{zone.freeThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Process */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-bold text-neutral-900 mb-2">Xác nhận đơn</h4>
            <p className="text-sm text-neutral-600">Đơn hàng được xử lý trong 24h làm việc</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-bold text-neutral-900 mb-2">Giao hàng</h4>
            <p className="text-sm text-neutral-600">Đơn vị vận chuyển nhận và giao hàng</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-bold text-neutral-900 mb-2">Nhận hàng</h4>
            <p className="text-sm text-neutral-600">Kiểm tra và xác nhận đơn hàng</p>
          </div>
        </div>

        {/* Notes */}
        <div className="border border-neutral-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Lưu ý khi nhận hàng
          </h3>
          <ul className="space-y-3">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3 text-neutral-700">
                <span className="text-neutral-400 mt-1">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-neutral-50 border border-neutral-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-neutral-700" />
            <div>
              <p className="text-sm text-neutral-600">Hotline hỗ trợ</p>
              <p className="font-bold text-neutral-900">1900 3636</p>
            </div>
          </div>
          <p className="text-sm text-neutral-600">
            ThờI gian làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 7)
          </p>
        </div>
      </main>
    </div>
  );
}
