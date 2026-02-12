// 檔案位置: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider" // 👈 1. 引入

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen  `}>
        {/* 使用 Flex 佈局：左邊是 Sidebar，右邊是主要內容 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex">
            
            {/* 左側 Sidebar (固定寬度) */}
            <Sidebar  />

          {/* 右側內容區 (自動填滿剩餘空間) */}
          <main className="flex-1 min-h-screen overflow-y-auto bg-white dark:bg-background">
            {children}
          </main>
          
        </div>
      </ThemeProvider>
      </body>
    </html>
  );
}