import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: 'Trường Đại Học Thành Đô, Kim Chung, Hoài Đức, Hà Nội',
  },
  {
    icon: Phone,
    label: 'Hotline',
    value: '1900 3636',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@fashon.vn',
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    value: '8:00 - 18:00 (Thứ 2 - Thứ 7)',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-medium">Liên hệ</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <MapPin className="w-8 h-8" />
            Liên hệ
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info & Form */}
          <div>
            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="bg-neutral-50 border border-neutral-200 p-4 flex items-start gap-3"
                >
                  <item.icon className="w-5 h-5 text-neutral-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-neutral-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-neutral-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    placeholder="Bạn cần hỗ trợ về vấn đề gì?"
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    className="w-full border border-neutral-300 py-3 px-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Map */}
          <div>
            <div className="bg-white border border-neutral-200 overflow-hidden h-full">
              <div className="bg-neutral-900 text-white px-6 py-4">
                <h3 className="font-bold uppercase tracking-wider">Bản đồ</h3>
              </div>
              <div className="h-[400px] lg:h-[calc(100%-56px)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.206476864573!2d105.719991675842!3d21.064413986551976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134544d67192907%3A0xaebb53aa417a4231!2sThanh%20Do%20University!5e0!3m2!1sen!2s!4v1769851915518!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fash.On Location"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 p-6 text-center">
            <Phone className="w-8 h-8 text-blue-700 mx-auto mb-3" />
            <h3 className="font-bold text-blue-900 mb-2">Hỗ trợ khách hàng</h3>
            <p className="text-sm text-blue-800">
              Gọi ngay 1900 3636 để được hỗ trợ nhanh nhất về đơn hàng và sản phẩm.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-6 text-center">
            <Mail className="w-8 h-8 text-green-700 mx-auto mb-3" />
            <h3 className="font-bold text-green-900 mb-2">Email hỗ trợ</h3>
            <p className="text-sm text-green-800">
              Gửi email đến support@fashon.vn, chúng tôi sẽ phản hồi trong 24h làm việc.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-6 text-center">
            <Clock className="w-8 h-8 text-purple-700 mx-auto mb-3" />
            <h3 className="font-bold text-purple-900 mb-2">ThờI gian phản hồi</h3>
            <p className="text-sm text-purple-800">
              Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 24 giờ làm việc.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
