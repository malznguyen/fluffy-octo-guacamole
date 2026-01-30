import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ClientProvider } from '@/components/providers';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ClientProvider>
  );
}
