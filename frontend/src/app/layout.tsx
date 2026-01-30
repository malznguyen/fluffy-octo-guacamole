import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ClientProvider from "@/components/providers/ClientProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FASH.ON - Thờitrang cao cấp",
  description: "Thờitrang cao cấp cho phong cách của bạn. Khám phá những thiết kế mới nhất với chất liệu cao cấp và phong cách hiện đại.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvider>
          {children}
        </ClientProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#171717',
              color: '#fff',
              border: 'none',
            },
          }}
        />
      </body>
    </html>
  );
}
