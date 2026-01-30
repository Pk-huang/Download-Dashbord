// src/components/features/product/product-form.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, GripVertical, Globe, Plus, Save , Folders  } from 'lucide-react';
import { ProductFormValues, productFormSchema } from '@/lib/schemas/product-schema';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface ProductFormProps {
  initialData?: ProductFormValues;
}

// 設定預設值
const defaultValues: Partial<ProductFormValues> = {
  name: "",
  product_line: "",
  series: "",
  files: [
    { category: "User Guides", name: "", link: "", disabled_countries: [] }
  ],
};

const FILTER_OPTIONS = [
  "User Guide",
  "Driver & Software",
  "Technical Document",
  "Reports",
  "Installation Guide",
  "All"
];

export function ProductForm({ initialData }: ProductFormProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: initialData || defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files",
  });

  // 監聽表單數值變化，用於篩選顯示
  const watchedFiles = form.watch("files");

  function onSubmit(data: ProductFormValues) {
    console.log("Form Submitted:", data);
    alert("儲存成功！請看 Console log (F12)");
  }

  const handleAddRow = () => {
    const defaultCategory = activeFilter === "All" ? "User Guide" : activeFilter;
    append({
      category: defaultCategory,
      name: "",
      link: "",
      disabled_countries: []
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  ">

        {/* --- 1. 基本資料區域 --- */}
        <div className="space-y-4">

          
          <div className="grid grid-cols-1 gap-6">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  
                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders  className='h-4 w-4 text-slate-500 '/> Product Name</label>
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
                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders  className='h-4 w-4 text-slate-500 '/> Product Line</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl className='w-full px-6'>
                      <SelectTrigger>
                        <SelectValue  placeholder="Select Line" />
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
                  <label className="text-base font-medium text-slate-700 flex items-center gap-2"><Folders  className='h-4 w-4 text-slate-500 '/> Series (Optional)</label>
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
          <p className="text-base font-medium text-slate-700  pb-2 flex items-center gap-2"><Folders  className='h-4 w-4 text-slate-500 '/> File upload and setting</p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  activeFilter === filter
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className=" rounded-md overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="w-[50px] py-5"></TableHead>
                  <TableHead className="w-[200px] py-5">Category</TableHead>
                  <TableHead className="py-5">Name of doc/file</TableHead>
                  <TableHead className="py-5">Link to outer server</TableHead>
                  <TableHead className="w-[80px] py-5 text-center">Country</TableHead>
                  <TableHead className="w-[80px] py-5 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((fieldItem, rowIndex) => {
                  // 取得當前行的最新資料
                  // 我們使用 watchedFiles[rowIndex] 來確保篩選邏輯使用的是使用者當下選擇的值
                  const currentFileValues = watchedFiles?.[rowIndex];
                  const currentCategory = currentFileValues?.category;
                  
                  // 決定是否顯示該行
                  const isRowVisible = activeFilter === "All" || currentCategory === activeFilter;

                  if (!isRowVisible) return null;

                  return (
                    <TableRow key={fieldItem.id} className="group">
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-slate-400 cursor-move" />
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`files.${rowIndex}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FILTER_OPTIONS.filter(opt => opt !== 'All').map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`files.${rowIndex}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="h-9" placeholder="File name" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Link */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`files.${rowIndex}.link`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="h-9" placeholder="https://" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Country Button */}
                      <TableCell className="text-center">
                        <Button type="button" variant="ghost" size="icon">
                          <Globe className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(rowIndex)} // 這裡必須使用 rowIndex 來移除正確的項目
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Empty State Hint */}
                {watchedFiles?.filter(f => activeFilter === "All" || f.category === activeFilter).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No files found in "{activeFilter}" category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2 hover:bg-slate-50 py-6 text-slate-500"
              onClick={handleAddRow}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add File to {activeFilter === "All" ? "List" : activeFilter}
            </Button>
          </div>
        </div>

        {/* --- 底部按鈕區 --- */}
        <div className="flex justify-end gap-4 pt-4">
          {/* <Button type="button" variant="outline">Cancel</Button> */}
          <Button type="submit" variant="vsbds_sky" size="vsbds_size">
            <Save  className='w-1 h-1'/>
            Save Changes
          </Button>
        </div>

      </form>
    </Form>
  );
}