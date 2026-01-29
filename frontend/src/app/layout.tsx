import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FASH.ON - Thời Trang Đỉnh Cao",
  description: "Khám phá bộ sưu tập thời trang mới nhất với phong cách độc đáo và chất lượng hàng đầu tại FASH.ON",
  keywords: ["thời trang", "quần áo", "fashion", "FASH.ON", "mua sắm online"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-montserrat)',
            },
          }}
        />
      </body>
    </html>
  );
}
