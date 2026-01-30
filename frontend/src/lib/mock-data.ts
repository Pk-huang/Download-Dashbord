// 檔案位置: src/lib/mock-data.ts
// src/lib/mock-data.ts
import { Product } from "@/types/product";

// ... (原本的 MOCK_PRODUCTS 陣列保持不變) ...



export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "VP1655",
    product_line: "Monitor",
    series: "VP series",
    modified_by: "Mark",
    modified_date: "2024/11/11 15:01",
  },
  {
    id: "2",
    name: "VA1655",
    product_line: "Monitor",
    series: "VA series",
    modified_by: "Mark",
    modified_date: "2024/11/11 15:01",
  },
  {
    id: "3",
    name: "CDE5523",
    product_line: "CDE",
    series: "23 series",
    modified_by: "Mark",
    modified_date: "2024/11/11 15:01",
  },
  {
    id: "4",
    name: "IFP6521",
    product_line: "IFP",
    series: "21 series",
    modified_by: "Mark",
    modified_date: "2024/11/11 15:01",
  },
  {
    id: "5",
    name: "XG2733",
    product_line: "Monitor",
    series: "XG series",
    modified_by: "Mark",
    modified_date: "2024/11/11 15:01",
  },
];


// 新增這個 helper function
export function getProductById(id: string) {
  // 這裡之後會變成真實的 API 呼叫
  return MOCK_PRODUCTS.find(p => p.id === id);
}