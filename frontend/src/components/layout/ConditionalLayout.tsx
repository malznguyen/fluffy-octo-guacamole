'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Routes that should not show Header and Footer
const authRoutes = ['/dang-nhap', '/dang-ky'];

// Routes that have full-screen hero sections (no padding needed)
const fullScreenRoutes = ['/', '/trang-chu'];

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // Check if current route has full-screen content (no padding needed)
  const isFullScreenRoute = fullScreenRoutes.some(route => pathname === route);

  // Only add padding if NOT auth route AND NOT full-screen route
  const needsPadding = !isAuthRoute && !isFullScreenRoute;

  return (
    <>
      {!isAuthRoute && <Header />}
      <main className={needsPadding ? "pt-20" : ""}>
        {children}
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
