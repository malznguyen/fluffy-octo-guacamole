'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const footerLinks = {
  explore: [
    { label: 'Áo Nam', href: '/danh-muc/ao-nam' },
    { label: 'Áo Nữ', href: '/danh-muc/ao-nu' },
    { label: 'Phụ Kiện', href: '/danh-muc/phu-kien' },
    { label: 'Giảm Giá', href: '/giam-gia' },
  ],
  support: [
    { label: 'Chính Sách Đổi Trả', href: '/chinh-sach-doi-tra' },
    { label: 'Bảo Mật', href: '/bao-mat' },
    { label: 'Vận Chuyển', href: '/van-chuyen' },
    { label: 'Liên Hệ', href: '/lien-he' },
  ],
  company: [
    { label: 'Về FASH.ON', href: '/ve-chung-toi' },
    { label: 'Tuyển Dụng', href: '/tuyen-dung' },
    { label: 'Hệ Thống Cửa Hàng', href: '/cua-hang' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
                ĐĂNG KÝ NHẬN TIN
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-md">
                Nhận thông tin về bộ sưu tập mới, ưu đãi đặc biệt và sự kiện độc quyền.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/30 focus:border-white focus:outline-none text-white placeholder:text-neutral-500 transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-neutral-900 text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                {isSubscribed ? 'ĐÃ ĐĂNG KÝ' : 'ĐĂNG KÝ'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-2xl font-medium tracking-[0.2em]">
                F A S H . O N
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-sm">
              Thờitrang hiện đại, đẳng cấp cho ngườiviệt. Chúng tôi mang đến những sản phẩm chất lượng cao với phong cách độc đáo.
            </p>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>123 Nguyễn Văn A, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-500" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-500" />
                <span>contact@fashon.vn</span>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-300">
              Khám Phá
            </h3>
            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-300">
              Hỗ Trợ
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6 text-neutral-300">
              Công Ty
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 text-center sm:text-left">
              © 2026 FASH.ON - Đồ án tốt nghiệp - Lê Trọng Duy
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
