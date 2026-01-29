import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Newsletter Section */}
            <div className="bg-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                Đăng Ký Nhận Tin Khuyến Mãi
                            </h3>
                            <p className="text-white/80 mt-1">
                                Nhận ngay voucher giảm 10% cho đơn hàng đầu tiên
                            </p>
                        </div>
                        <form className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            <Button
                                type="submit"
                                className="bg-white text-purple-600 hover:bg-gray-100 px-6"
                            >
                                Đăng Ký
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-black text-white">
                                FASH.ON
                            </span>
                        </Link>
                        <p className="mt-4 text-gray-400 leading-relaxed">
                            Thời trang đỉnh cao cho người Việt. Chúng tôi mang đến những xu hướng mới nhất với chất lượng tốt nhất.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
                                aria-label="Youtube"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Về Chúng Tôi</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/gioi-thieu"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Giới Thiệu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tuyen-dung"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Tuyển Dụng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/bao-chi"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Báo Chí
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/lien-he"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/huong-dan-mua-hang"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Hướng Dẫn Mua Hàng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/chinh-sach-doi-tra"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Chính Sách Đổi Trả
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/chinh-sach-van-chuyen"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Chính Sách Vận Chuyển
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Câu Hỏi Thường Gặp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Liên Hệ</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                <span className="text-gray-400">
                                    123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-purple-400 shrink-0" />
                                <a
                                    href="tel:1900123456"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    1900 123 456
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                                <a
                                    href="mailto:support@fashon.vn"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    support@fashon.vn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2026 FASH.ON. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                href="/dieu-khoan"
                                className="text-gray-500 hover:text-white text-sm transition-colors"
                            >
                                Điều Khoản Dịch Vụ
                            </Link>
                            <Link
                                href="/bao-mat"
                                className="text-gray-500 hover:text-white text-sm transition-colors"
                            >
                                Chính Sách Bảo Mật
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
