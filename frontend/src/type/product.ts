// 檔案位置: src/types/product.ts

export type ProductLine = 'Monitor' | 'CDE' | 'IFP' | 'All';

export interface Product {
  id: string;
  name: string;        // 產品名稱 (如 VP1655)
  product_line: string; // Product Line (如 Monitor)
  series: string;      // 產品系列 (如 VP series)
  modified_by: string; // 修改者 (如 Mark)
  modified_date: string; // 修改日期
  // 之後會用到的詳細資料，列表頁暫時用不到
  category?: string;
  files?: any[]; 
}