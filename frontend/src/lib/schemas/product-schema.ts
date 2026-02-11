import { z } from "zod";
import { id } from "zod/locales";

export const productFormSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, "Product name is required"),
  product_line: z.string().min(1, "Product line is required"),
  series: z.string().optional(),
  
  files: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      name: z.string().min(1, "File name is required"),
      link: z.string().url("Please enter a valid URL"),
      disabled_countries: z.array(z.string()).default([]),
      order: z.number().optional()
    })
  ).min(1, "At least one file is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;