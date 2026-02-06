'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';


interface PageNavProps {
    totalCount: number; // 總筆數
    pageSize?: number;  // 一頁幾筆 (預設 10)
}

export function PageNav({ totalCount, }: PageNavProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // 1. 計算總頁數
    const totalPages = Math.ceil(totalCount / 10);
    
    // 2. 取得當前頁碼 (從網址抓，沒抓到預設為 1)
    const currentPage = Number(searchParams.get('page')) || 1;


    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }

    if (totalPages <= 1) return null;


    const maxVisiblePages = 5;
    const halfWindow = Math.floor(maxVisiblePages / 2);

    let startPage = currentPage - halfWindow;
    let endPage = currentPage + halfWindow;

    if (startPage < 1) {
        endPage += (1 - startPage);
        startPage = 1;
    }

    if (endPage > totalPages) {
        startPage -= (endPage - totalPages);
        endPage = totalPages;
    }

    startPage = Math.max(startPage, 1);

    const pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

    return (
      <Pagination className="mt-6 justify-end">
      <PaginationContent>
        
        {/* 上一頁按鈕 */}
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* 簡單版邏輯：顯示所有頁碼 (如果頁數太多，建議之後加上 Ellipsis 邏輯) */}
        {/* 這裡先用 Array.from 產生 [1, 2, 3...] 的陣列 */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={createPageURL(page)} 
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 下一頁按鈕 */}
        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
    )
}