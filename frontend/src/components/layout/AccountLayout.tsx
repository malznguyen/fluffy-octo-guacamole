'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/use-auth-store';

interface AccountLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/tai-khoan', label: 'THÔNG TIN' },
  { href: '/don-hang', label: 'ĐƠN HÀNG' },
];

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/dang-nhap');
  };

  const isActive = (href: string) => {
    // Exact match for /tai-khoan, startsWith for /don-hang to handle /don-hang/[orderCode]
    if (href === '/tai-khoan') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Mobile: Horizontal scrollable menu on top */}
      <div className="lg:hidden mb-8">
        <p className="text-xs tracking-widest text-gray-400 mb-4">MY ACCOUNT</p>
        <nav className="flex gap-6 overflow-x-auto pb-4 border-b border-gray-100">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-lg uppercase whitespace-nowrap transition-colors duration-200
                  ${active 
                    ? 'text-black font-medium' 
                    : 'text-gray-300 hover:text-black'
                  }
                `}
              >
                {active && <span className="mr-2">→</span>}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop & Mobile Layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-[25%]">
          <p className="text-xs tracking-widest text-gray-400 mb-8">MY ACCOUNT</p>
          
          <nav className="flex flex-col gap-4 mb-16">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    text-2xl uppercase transition-all duration-200 flex items-center
                    ${active 
                      ? 'text-black font-medium translate-x-2' 
                      : 'text-gray-300 hover:text-black'
                    }
                  `}
                >
                  {active && (
                    <ArrowRight className="w-5 h-5 mr-3 stroke-[1.5]" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-black underline underline-offset-4 transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </aside>

        {/* Content Area */}
        <div className="w-full lg:w-[75%]">
          {children}
        </div>
      </div>

      {/* Mobile Logout */}
      <div className="lg:hidden mt-12 pt-8 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-black underline underline-offset-4 transition-colors duration-200"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
