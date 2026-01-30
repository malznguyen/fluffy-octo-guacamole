import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Logo Header */}
      <header className="py-6 text-center">
        <Link 
          href="/" 
          className="text-2xl font-black tracking-[0.2em] uppercase text-neutral-900"
        >
          FASH.ON
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-neutral-500">
        <p>&copy; 2026 FASH.ON. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
