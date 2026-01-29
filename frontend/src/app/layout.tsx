import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FASH.ON - Thỏa Sức Phong Cách Củah Bạn",
  description: "FASH.ON - Cửa hàng thờI trang hiện đại với những bộ sưu tập mới nhất. Khám phá xu hướng thờI trang đỉnh cao, chất lượng hàng đầu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-be-vietnam), sans-serif',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
