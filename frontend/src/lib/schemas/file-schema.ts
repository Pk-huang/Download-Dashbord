import { z } from 'zod';

// 1. 定義單一檔案的驗證規則 (這跟 Product 的幾乎一樣，如果有共用可以直接 import)
export const fileItemSchema = z.object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(1, "File name is required"),
    link: z.string().url("Please enter a valid URL"),
    disabled_countries: z.array(z.string()).default([]),
});