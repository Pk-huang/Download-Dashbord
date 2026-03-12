// src/components/features/product/product-form.tsx
'use client';

// 移除原本的 useState，因為 react-hook-form 已經內建了
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Folders } from 'lucide-react';
import { GroupFormValues, groupSchema } from '@/lib/schemas/group-schema';

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
import { createGroup, updateGroup, GroupPayload } from '@/lib/api/';

import { DownloadsFiles } from '@/components/shared/file-table';
import { toast } from "sonner"; // ✅ 引入 sonner

interface GroupFormProps {
  initialData?: GroupFormValues;
}

const defaultValues: Partial<GroupFormValues> = {
  id: undefined,
  name: "",
  selectedProducts: [], // ✅ 1. 預設值改成空陣列，等使用者選擇產品後才有值
  files: [
    { category: "", name: "", link: "", disabled_countries: [] }
  ],
};

export function GroupForm({ initialData }: GroupFormProps) {
  const router = useRouter();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialData,
      // 👇 在這裡塞入寫死的測試資料，這才是 Zod 會檢查的東西！
      selectedProducts: initialData?.selectedProducts || [1, 2],
    },
    mode: "onChange",
  });

  // ✅ 1. 從 formState 取出我們需要的狀態，不用自己寫 useState
  const { isSubmitting, isDirty, dirtyFields } = form.formState;

  async function onSubmit(data: GroupFormValues) {
    try {
      // 整理要傳給後端的資料格式
      const payload: GroupPayload = {
        name: data.name,
        modified_date: new Date().toISOString().split('T')[0],
        modified_by: "Admin",

        selectedProducts: data.selectedProducts, // ✅ 2. 送出產品 ID 陣列給後端        
        files: (data.files || []).map((file, index) => ({
          category: file.category,
          name: file.name,
          link: file.link,
          disabled_countries: file.disabled_countries || [],
          order: index + 1
        })),

      }

      // ✅ 2. 準備進階版 Toast 的「修改清單」文字
      const fieldNamesMap: Record<string, string> = {
        name: "Group Name",
        product_line: "Product Line",
        series: "Series",
        files: "Files / Documents",
      };
      const modifiedFieldsText = Object.keys(dirtyFields)
        .map((key) => fieldNamesMap[key] || key)
        .join(", ");

      if (initialData?.id) {
        // --- 編輯模式 (Update) ---
        await updateGroup(String(initialData.id), payload);

        toast.success("Saved Successfully", {
          description: (
            <div className="mt-1">
              <p>Group <strong className="font-bold">"{data.name}"</strong> has been updated.</p>
              {modifiedFieldsText && (
                <p className="mt-2 text-sm bg-green-900/20 px-2 py-1 rounded border border-green-800/30">
                  ✏️ <span className="opacity-80">Modified:</span> {modifiedFieldsText}
                </p>
              )}
            </div>
          ),
        });
      } else {
        // --- 新增模式 (Create) ---
        await createGroup(payload);

        // 新增成功也換成 toast
        toast.success("Created Successfully", {
          description: `Group "${data.name}" has been added to the database.`,
        });
      }

      router.push('/groups');
      router.refresh();

    } catch (error) {
      console.error(error);
      // ✅ 3. 錯誤訊息換成 toast.error
      toast.error("Error", {
        description: "Failed to save group. Please check your connection.",
      });
    }
    // isSubmitting 會由 react-hook-form 自動控制，所以我們不需要 finally
  }

  function onError(errors: any) {
    console.log("🛑 Zod 驗證失敗的詳細錯誤:", errors);

    // 把第一個錯誤抓出來顯示在畫面上，讓您知道哪裡出錯
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error("表單驗證失敗", {
      description: `欄位 [${firstErrorKey}] 發生錯誤：${firstErrorMessage}`,
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">

        {/* --- 1. 基本資料區域 --- */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">

            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Folders className='h-4 w-4 text-slate-500 dark:text-slate-300' />
                    Product Name
                    {/* ✅ 5. 加上修改提示標籤 */}
                    {dirtyFields.name && (
                      <span className="text-amber-500 text-xs font-medium bg-amber-50 dark:bg-amber-950/30 px-1.5 rounded ml-2">
                        * Edited
                      </span>
                    )}
                  </label>
                  <FormControl className='px-6'>
                    <Input placeholder="e.g. VP1655" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />




          </div>
        </div>

        {/* --- 2. 檔案列表區域 (動態表格) --- */}
        <div className="space-y-4">
          <p className="text-base font-medium text-slate-700 dark:text-slate-300 pb-2 flex items-center gap-2">
            <Folders className='h-4 w-4 text-slate-500 dark:text-slate-300' />
            File upload and setting
            {dirtyFields.files && (
              <span className="text-amber-500 text-xs font-medium bg-amber-50 dark:bg-amber-950/30 px-1.5 rounded ml-2">
                * Edited
              </span>
            )}
          </p>
          <DownloadsFiles />
        </div>

        {/* --- 底部按鈕區 --- */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            // ✅ 6. 防呆機制：如果沒有修改 (且是編輯模式)，或者正在送出，就反灰按鈕
            disabled={(initialData && !isDirty) || isSubmitting}
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