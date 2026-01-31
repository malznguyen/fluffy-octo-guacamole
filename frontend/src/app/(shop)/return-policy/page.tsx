import Link from 'next/link';
import { ShieldCheck, AlertCircle, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const conditions = [
  {
    icon: CheckCircle,
    text: 'Sản phẩm còn nguyên tem, mác và chưa qua sử dụng',
  },
  {
    icon: CheckCircle,
    text: 'Có hóa đơn mua hàng hoặc mã đơn hàng',
  },
  {
    icon: CheckCircle,
    text: 'ThờI gian đổi trả trong vòng 7 ngày kể từ ngày nhận hàng',
  },
  {
    icon: CheckCircle,
    text: 'Sản phẩm không bị hư hỏng do tác động bên ngoài',
  },
];

const exclusions = [
  {
    icon: XCircle,
    text: 'Đồ lót, đồ bơi và phụ kiện cá nhân (vì lý do vệ sinh)',
  },
  {
    icon: XCircle,
    text: 'Sản phẩm đã qua sử dụng, giặt tẩy hoặc có mùi',
  },
  {
    icon: XCircle,
    text: 'Sản phẩm trong chương trình khuyến mãi giảm giá trên 50%',
  },
  {
    icon: XCircle,
    text: 'Sản phẩm quà tặng hoặc free gift',
  },
];

export default function ReturnPolicyPage() {
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
            <span className="text-neutral-900 font-medium">Chính sách đổi trả</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <ShieldCheck className="w-8 h-8" />
            Chính sách đổi trả
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Policy Overview */}
        <div className="bg-green-50 border border-green-200 p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <Package className="w-8 h-8 text-green-700 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-green-900 mb-2">Cam kết của chúng tôi</h2>
              <p className="text-green-800 leading-relaxed">
                Tại Fash.On, chúng tôi muốn bạn hoàn toàn hài lòng với mỗi đơn hàng. 
                Nếu sản phẩm không phù hợp, bạn có thể đổi hoặc trả trong vòng 7 ngày 
                theo các điều kiện dưới đây.
              </p>
            </div>
          </div>
        </div>

        {/* Time Limit */}
        <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200 p-6 mb-12">
          <Clock className="w-10 h-10 text-neutral-700" />
          <div>
            <h3 className="font-bold text-neutral-900">ThờI hạn đổi trả</h3>
            <p className="text-neutral-600">7 ngày kể từ ngày nhận được hàng</p>
          </div>
        </div>

        {/* Conditions Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Accepted Conditions */}
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Điều kiện được đổi trả
            </h3>
            <ul className="space-y-4">
              {conditions.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Không áp dụng đổi trả
            </h3>
            <ul className="space-y-4">
              {exclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="border border-neutral-200 p-6 md:p-8 mb-12">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Quy trình đổi trả</h3>
          <ol className="space-y-4 text-neutral-700">
            <li className="flex gap-4">
              <span className="font-bold text-neutral-900">1.</span>
              <span>Liên hệ hotline 1900 3636 hoặc email support@fashon.vn trong vòng 7 ngày kể từ ngày nhận hàng</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-neutral-900">2.</span>
              <span>Cung cấp mã đơn hàng và lý do đổi/trả</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-neutral-900">3.</span>
              <span>Đóng gói sản phẩm kèm hóa đơn gốc (nếu có)</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-neutral-900">4.</span>
              <span>Gửi hàng về địa chỉ được cung cấp bởi bộ phận CSKH</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-neutral-900">5.</span>
              <span>Nhận sản phẩm mới hoặc hoàn tiền trong vòng 3-5 ngày làm việc</span>
            </li>
          </ol>
        </div>

        {/* Note */}
        <div className="bg-amber-50 border border-amber-200 p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Lưu ý quan trọng</h4>
            <p className="text-amber-800 text-sm">
              Phí vận chuyển cho việc đổi trả sẽ được chịu bởi khách hàng, trừ trường hợp 
              sản phẩm bị lỗi do nhà sản xuất hoặc giao sai sản phẩm. Vui lòng kiểm tra 
              kỹ sản phẩm trước khi gửi đổi trả.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 mb-4">Cần hỗ trợ thêm?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Liên hệ với chúng tôi
          </Link>
        </div>
      </main>
    </div>
  );
}
