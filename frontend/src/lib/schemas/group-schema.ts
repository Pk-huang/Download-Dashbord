import { z } from "zod";

// 1. 定義單一檔案的驗證規則 (這跟 Product 的幾乎一樣，如果有共用可以直接 import)
export const fileItemSchema = z.object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(1, "File name is required"),
    link: z.string().url("Please enter a valid URL"),
    disabled_countries: z.array(z.string()).default([]),
});

// 2. 定義 Group 表單的整體驗證規則
export const groupSchema = z.object({
    name: z.string().min(1, "群組名稱為必填項目"), // 群組名稱必填
    modified_by: z.string().min(1, "請輸入修改者名稱"),
    // 核心：前端選取的產品 ID 陣列。這裡我們設定「至少要選一個產品」才能存檔
    product_ids: z.array(z.number()).min(1, "請至少選擇一個關聯的產品"),

    // 檔案列表 (選填，如果沒加檔案就是空陣列)
    files: z.array(fileItemSchema).default([]),
});

// 3. 匯出 TypeScript 型別，讓 React Hook Form 可以使用
export type GroupFormValues = z.infer<typeof groupSchema>;