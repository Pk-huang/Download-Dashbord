"use client";

import React from 'react';
import Link from 'next/link'; // 1. 修正這裡：這是路由用的 Link
import { LucideIcon, ChevronLeft, Link as LinkIcon } from 'lucide-react'; // 如果真的要用鎖鏈圖示，要改名為 LinkIcon
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { FileText  } from 'lucide-react';
import { ModeToggle } from '@/components/shared/mode-toggle'; // 2. 如果你想在頁面標題右側放一個切換主題的按鈕，可以用這個元件


interface PageHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;     // 建議改用 subtitle 比較符合 React 命名習慣 (原本是 secondary_title)
  backUrl?: string;      // 建議改用 backUrl (原本是 previousPage)
  // 2. 是否自動偵測上一頁 (如果 backUrl 沒填，且這項為 true，就會自動算)
  autoBack?: boolean;
  action?: React.ReactNode; // 2. 新增這個：讓你可以傳入任意按鈕 (例如 Save 或 Create)
  className?: string;
  usePathname?: boolean;
}

export function PageHeader({
  title,
  icon ,
  subtitle,
  backUrl,
  autoBack = false, // 預設不自動偵測，避免首頁出現返回按鈕
  action,
  className,
}: PageHeaderProps) {

  const pathname = usePathname();

  // --- 自動計算上一層路徑的邏輯 ---
  // 範例: "/products/new" -> split變成 ["", "products", "new"] -> slice去掉最後一個 -> join -> "/products"
  const parentUrl = pathname.split('/').slice(0, -1).join('/') || '/';

  // 決定最終的返回連結：有指定用指定的，沒指定看有沒有開 autoBack
  const finalBackUrl = backUrl || (autoBack ? parentUrl : null);


  return (
    <div className={cn("flex flex-col gap-4 mb-6 pb-4", className)}>

      {/* 上半部：標題 + 右側按鈕區 */}
      <div className="flex items-center justify-between">

        {/* 左側：Icon + 標題 */}
        <div className="flex items-center gap-2">
          {icon === "file" && <FileText className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
          {icon === "link" && <LinkIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
              <ModeToggle />
        </div>

        {/* 右側：動作區 (返回按鈕 或 其他按鈕) */}
        <div className="flex items-center gap-2">

          {/* 如果有 action (例如 Save 按鈕)，優先顯示 action */}
          {action && <div>{action}</div>}

          {/* 如果有 backUrl，顯示返回按鈕 */}
          {finalBackUrl && (
            <Link href={finalBackUrl}>
              <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-muted/50 dark:text-slate-300 dark:hover:text-slate-100">
                <ChevronLeft className="h-4 w-4" />
                Back to List
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 下半部：副標題 (如果有) */}
      {subtitle && (
        <p className="text-base font-medium text-slate-700 dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}