"use client";

import React from 'react';
import Link from 'next/link'; // 1. 修正這裡：這是路由用的 Link
import { LucideIcon, ChevronLeft, Link as LinkIcon, Badge } from 'lucide-react'; // 如果真的要用鎖鏈圖示，要改名為 LinkIcon
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { FileText } from 'lucide-react';
import { ModeToggle } from '@/components/shared/mode-toggle'; // 2. 
import { deleteProduct } from '@/lib/api';
import { string } from 'zod';


interface PageHeaderProps {
  id?: number | string; // 這個 id 是給後端用的，前端不會直接用到它，但傳了之後可以讓 Header 顯示在 URL 上 (例如 Edit Product: VP1655 (ID: 123))
  title: string;
  icon?: string;
  subtitle?: string;     // 建議改用 subtitle 比較符合 React 命名習慣 (原本是 secondary_title)
  backUrl?: string;      // 建議改用 backUrl (原本是 previousPage)
  // 2. 是否自動偵測上一頁 (如果 backUrl 沒填，且這項為 true，就會自動算)
  autoBack?: boolean;
  className?: string;
  usePathname?: boolean;
}

export function PageHeader({
  id,
  title,
  icon,
  subtitle,
  backUrl,
  autoBack = false, // 預設不自動偵測，避免首頁出現返回按鈕
  
  className,
}: PageHeaderProps) {

  const pathname = usePathname();

  // --- 自動計算上一層路徑的邏輯 ---
  // 範例: "/products/new" -> split變成 ["", "products", "new"] -> slice去掉最後一個 -> join -> "/products"
  const parentUrl = pathname.split('/').slice(0, -1).join('/') || '/';

  // 決定最終的返回連結：有指定用指定的，沒指定看有沒有開 autoBack
  const finalBackUrl = backUrl || (autoBack ? parentUrl : null);

  const handleDelete = async (id: string) => {
    if (!id) return; // 沒有 ID 就不執行刪除

    const confirmed = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteProduct(string().parse(id));
      // 刪除成功後可以選擇導回列表頁或顯示成功訊息
      alert("Product deleted successfully.");
      // 如果有返回連結，則導回去
      if (finalBackUrl) {
        window.location.href = finalBackUrl;
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  }


  return (
    <div className={cn("flex flex-col gap-4 mb-6 pb-4 w-full", className)}>

      {/* 上半部：標題 + 右側按鈕區 */}
      <div className="flex items-center justify-between ">

        {/* 左側：Icon + 標題 */}
        <div className="flex items-center gap-2">
          {icon === "file" && <FileText className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
          {icon === "link" && <LinkIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100"> { id &&`Edit product` } {title}</h1>
          {id && <Button variant="delete" className="ml-2" onClick={() => handleDelete(String(id))}>Delete {title}</Button>}
        </div>

        {/* 右側：動作區 (返回按鈕 或 其他按鈕) */}
        <div className="flex items-center gap-2">
          <ModeToggle />
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