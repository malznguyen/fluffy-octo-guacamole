"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Tất Cả Sản Phẩm", href: "/cua-hang" },
    { name: "Sản Phẩm Mới", href: "/cua-hang?sort=newest" },
    { name: "Bán Chạy Nhất", href: "/cua-hang?sort=best-selling" },
    { name: "Giảm Giá", href: "/cua-hang?sort=discount" },
  ],
  support: [
    { name: "Liên Hệ", href: "/lien-he" },
    { name: "FAQ", href: "/faq" },
    { name: "Chính Sách Vận Chuyển", href: "/chinh-sach-van-chuyen" },
    { name: "Chính Sách Đổi Trả", href: "/chinh-sach-doi-tra" },
    { name: "Điều Khoản Sử Dụng", href: "/dieu-khoan" },
  ],
  company: [
    { name: "Về Chúng Tôi", href: "/ve-chung-toi" },
    { name: "Tuyển Dụng", href: "/tuyen-dung" },
    { name: "Blog", href: "/blog" },
    { name: "Đối Tác", href: "/doi-tac" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Đăng ký thành công!", {
        description: "Cảm ơn bạn đã đăng ký nhận tin từ FASH.ON",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">ĐĂNG KÝ NHẬN TIN</h3>
              <p className="text-neutral-400">
                Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full lg:w-auto max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="flex-1 lg:w-80 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-medium hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng Ký</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <h2 className="text-3xl font-black tracking-tighter font-display">
                FASH.ON
              </h2>
            </Link>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              FASH.ON là thương hiệu thờI trang hiện đại, mang đến những sản phẩm
              chất lượng cao với phong cách độc đáo và cá tính.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@fashon.vn"
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                support@fashon.vn
              </a>
              <a
                href="tel:19001234"
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                1900 1234
              </a>
              <p className="flex items-center gap-3 text-neutral-400">
                <MapPin className="w-5 h-5" />
                123 Nguyễn Văn A, Quận 1, TP.HCM
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              Cửa Hàng
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              Hỗ Trợ
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              Công Ty
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 text-center sm:text-left">
              © 2024 FASH.ON. Tất cả quyền được bảo lưu.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
