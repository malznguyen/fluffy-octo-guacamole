'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Routes that should not show Header and Footer
const authRoutes = ['/dang-nhap', '/dang-ky'];

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route);

  return (
    <>
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
