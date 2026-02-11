// src/components/features/product/product-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Folders } from 'lucide-react';
import { ProductFormValues, productFormSchema } from '@/lib/schemas/product-schema';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl, FormField, FormItem, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, ProductPayload } from '@/lib/api';


import { ProductFiles } from '@/components/shared/file-table'; // 這是我們剛剛做好的檔案列表元件
import { FormProvider } from "react-hook-form"; // 這個是 react-hook-form 提供的 Context Provider，用來讓子元件（例如 ProductFiles）能夠存取表單狀態和方法


interface ProductFormProps {
  initialData?: ProductFormValues;
}

// 設定預設值
const defaultValues: Partial<ProductFormValues> = {
  id: undefined, // 這裡不給預設 ID，因為新增時沒有 ID，編輯時會從 initialData 傳入
  name: "",
  product_line: "",
  series: "",
  files: [
    { category: "", name: "", link: "", disabled_countries: [] }
  ],
};



export function ProductForm({ initialData }: ProductFormProps) {
  console.log("Initial Data in Form:", initialData); // 調試用，看看傳進來的資料長什麼樣子
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: initialData || defaultValues,
    mode: "onChange",
  });
  console.log(initialData?.id)

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)



  async function onSubmit(data: ProductFormValues) {
    console.log("Form Data to Submit:", data); // 調試用，看看要送出的資料長什麼樣子
    try {
      setIsSubmitting(true); // 開啟 Loading，避免使用者重複點擊

      // 整理要傳給後端的資料格式
      const payload: ProductPayload = {
        name: data.name,
        product_line: data.product_line,
        series: data.series || "", // 後端如果是 Optional，這裡可以給空字串或 undefined
        files: (data.files || []).map((file, index) => ({
          category: file.category,
          name: file.name,
          link: file.link,
          disabled_countries: file.disabled_countries || [],
          order: index + 1 // 自動產生排序 1, 2, 3...
        })),
        /* Disabled countries needed */
        modified_date: new Date().toISOString().split('T')[0], // 自動產生今天的日期 (例如 "2024-01-29")
        modified_by: "Admin" // 這裡暫時寫死，實際應該從使用者登入資訊取得
      }



      if (initialData?.id) {
        // --- 編輯模式 (Update) ---
        // 這裡需要注意：initialData 裡面要有 id。
        // 如果您的 ProductFormValues Type 沒有 id，可以用 (initialData as any).id 暫時繞過，或修正 Type
        await updateProduct(String(initialData.id), payload);
        console.log("Product updated successfully");
        alert("更新成功！");
      } else {
        // --- 新增模式 (Create) ---
        await createProduct(payload);
        alert("新增成功！");
      }

      // 3. 成功後跳轉回列表頁
      router.push('/products');
      router.refresh(); // 強制重新整理列表頁資料
    } catch (error) {
      console.error(error);
      alert("儲存失敗，請檢查後端連線");
    } finally {
      setIsSubmitting(false); // 關閉 Loading
    }
  }

  const onError = (errors: any) => {
    console.log("❌ 表單驗證失敗 (Validation Errors):", errors);
    alert("表單有欄位未填寫正確，請檢查 Console Log");
  };


  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError )} className="space-y-8  ">

        {/* --- 1. 基本資料區域 --- */}
        <div className="space-y-4">


          <div className="grid grid-cols-1 gap-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>

                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders className='h-4 w-4 text-slate-500 ' /> Product Name</label>
                  <FormControl className='px-6'>
                    <Input placeholder="e.g. VP1655" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Line */}
            <FormField
              control={form.control}
              name="product_line"
              render={({ field }) => (
                <FormItem>
                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders className='h-4 w-4 text-slate-500 ' /> Product Line</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl className='w-full px-6'>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Line" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="IFP">IFP</SelectItem>
                      <SelectItem value="CDE">CDE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Series */}
            <FormField
              control={form.control}
              name="series"
              render={({ field }) => (
                <FormItem>
                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders className='h-4 w-4 text-slate-500 ' /> Series (Optional)</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className='w-full px-6'>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Series" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VP Series">VP Series</SelectItem>
                      <SelectItem value="XG Series">XG Series</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- 2. 檔案列表區域 (動態表格) --- */}
        <div className="space-y-4">
          <p className="text-base font-medium text-slate-700  pb-2 flex items-center gap-2"><Folders className='h-4 w-4 text-slate-500 ' /> File upload and setting</p>

          <ProductFiles />

        </div>

        {/* --- 底部按鈕區 --- */}
        <div className="flex justify-end gap-4 pt-4">
          {/* <Button type="button" variant="outline">Cancel</Button> */}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            disabled={isSubmitting} // 送出中禁止點擊
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

      </form>
    </FormProvider>
  );
}