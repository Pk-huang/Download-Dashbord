// 檔案位置: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Download Dashboard",
  description: "ViewSonic Download Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        {/* 使用 Flex 佈局：左邊是 Sidebar，右邊是主要內容 */}
        <div className="flex">
          
          {/* 左側 Sidebar (固定寬度) */}
          <Sidebar />

          {/* 右側內容區 (自動填滿剩餘空間) */}
          <main className="flex-1 min-h-screen overflow-y-auto">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}