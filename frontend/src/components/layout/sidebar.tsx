// 檔案位置: src/components/layout/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Shadcn 的 CSS 合併工具
import { Monitor, Layers, RefreshCw } from 'lucide-react'; // 使用類似設計稿的 Icon
import logo from  '@/images/viewsonic-black.png'; // ViewSonic Logo 圖片

// 定義選單項目
const menuItems = [
    {
        title: "Product List",
        href: "/products",
        icon: Monitor, // 類似圖中的螢幕 Icon
    },
    {
        title: "Group List",
        href: "/groups",
        icon: Layers, // 類似圖中的堆疊 Icon
    },
    {
        title: "從ftp 拉取",
        href: "/ftp-pull",
        icon: RefreshCw, // 類似圖中的同步/拉取 Icon
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-auto border-r border-slate-200  sticky top-0">

            {/* 1. Logo 區域 */}
            <div className="p-6 border-b ">
              <Image src={logo} alt="ViewSonic Logo" className='w-[60%]' />
            </div>

            {/* 2. 選單區域 */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    // 判斷是否為當前頁面 (如果是 /products/new 也算在 /products 內)
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "text-vsbds-sky" // 啟動狀態：淺藍背景 + 藍字
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900" // 一般狀態
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-vsbds-sky" : "text-slate-500")} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* 3. 底部區域 (預留) */}
            <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
                v1.0.0
            </div>
        </div>
    );
}