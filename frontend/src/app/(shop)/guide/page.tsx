import Link from 'next/link';
import { BookOpen, ShoppingBag, CreditCard, Truck, PackageCheck, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: ShoppingBag,
    step: '01',
    title: 'Chọn sản phẩm',
    description: 'Duyệt qua bộ sưu tập đa dạng của chúng tôi. Sử dụng bộ lọc để tìm đúng size, màu sắc và phong cách phù hợp với bạn.',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'Thêm vào giỏ hàng',
    description: 'Chọn size và màu sắc phù hợp, sau đó thêm sản phẩm vào giỏ hàng. Bạn có thể tiếp tục mua sắm hoặc đi đến thanh toán ngay.',
  },
  {
    icon: Truck,
    step: '03',
    title: 'Thanh toán',
    description: 'Điền thông tin giao hàng và chọn phương thức thanh toán phù hợp (COD hoặc chuyển khoản). Xác nhận đơn hàng của bạn.',
  },
  {
    icon: PackageCheck,
    step: '04',
    title: 'Nhận hàng',
    description: 'Đơn hàng sẽ được giao đến địa chỉ của bạn trong 1-5 ngày làm việc. Kiểm tra và tận hưởng sản phẩm!',
  },
];

export default function GuidePage() {
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
            <span className="text-neutral-900 font-medium">Hướng dẫn mua hàng</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <BookOpen className="w-8 h-8" />
            Hướng dẫn mua hàng
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8 mb-12">
          <p className="text-neutral-700 leading-relaxed">
            Mua sắm tại Fash.On thật đơn giản và thuận tiện. Chỉ với 4 bước dễ dàng, 
            bạn có thể sở hữu những sản phẩm thờI trang chất lượng cao. Dưới đây là 
            hướng dẫn chi tiết để bạn có trải nghiệm mua sắm tốt nhất.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white border border-neutral-200 p-6 md:p-8 flex gap-6 items-start hover:border-neutral-400 transition-colors"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <item.icon className="w-6 h-6 text-neutral-700" />
                  <h2 className="text-xl font-bold text-neutral-900">{item.title}</h2>
                </div>
                <p className="text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-amber-50 border border-amber-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Mẹo hữu ích</h3>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              Đăng ký tài khoản để theo dõi đơn hàng và nhận ưu đãi đặc biệt
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              Kiểm tra bảng size trước khi đặt hàng để chọn size phù hợp nhất
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              Liên hệ hotline 1900 3636 nếu cần hỗ trợ trong quá trình mua hàng
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Bắt đầu mua sắm
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
