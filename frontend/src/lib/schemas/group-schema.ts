import { z } from "zod";
import { fileItemSchema } from './file-schema';
import { id } from "zod/v4/locales";

// 2. 定義 Group 表單的整體驗證規則
export const groupSchema = z.object({
    id: z.number().optional(), // 編輯時會有 id，新增時沒有
    name: z.string().min(1, "群組名稱為必填項目"), 
    modified_date: z.string().min(1, "請輸入修改日期"),
    modified_by: z.string().min(1, "請輸入修改者名稱"),
   
    selectedProducts: z.array(z.number()).default([]), // 這裡先不設定 min(1)，因為我們還沒做產品選擇器，等做完再來加驗證

    // 檔案列表 (選填，如果沒加檔案就是空陣列)
    files: z.array(fileItemSchema).default([]),
});

// 3. 匯出 TypeScript 型別，讓 React Hook Form 可以使用
export type GroupFormValues = z.infer<typeof groupSchema>;