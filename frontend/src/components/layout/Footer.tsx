import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-[0.2em] uppercase">FASH.ON</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Thời trang cao cấp cho phong cách của bạn
            </p>
          </div>

          {/* Column 2: Customer Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/guide" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Vận chuyển
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Về chúng tôi</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Câu chuyện FASH.ON
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Kết nối</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
          <p className="text-neutral-400 text-sm">
            2026 FASH.ON. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
