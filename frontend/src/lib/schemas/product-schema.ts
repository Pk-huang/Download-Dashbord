import { z } from "zod";
import { fileItemSchema } from './file-schema';

export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Product name is required"),
  product_line: z.string().min(1, "Product line is required"),
  series: z.string().optional(),
  files: z.array(fileItemSchema).default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;