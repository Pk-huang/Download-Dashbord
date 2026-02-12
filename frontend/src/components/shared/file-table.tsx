'use client';

import { useState } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Trash2, Plus, GripVertical } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { CountrySelector } from "@/components/ui/country-selector";
import { FILE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// 定義篩選選項：All + 來自常數的類別
const FILTER_OPTIONS = ["All", ...FILE_CATEGORIES];

type FileItem = {
    id?: string;
    category: string;
    name: string;
    link: string;
    disabled_countries: string[];
    order: number;
};

interface ProductFilesFormValues {
    files: FileItem[];
}


export function ProductFiles() {
    // 1. 取得表單 Context
    const { control, register, watch } = useFormContext<ProductFilesFormValues>();

    // 2. 狀態管理：當前篩選器
    const [activeFilter, setActiveFilter] = useState("All");

    // 3. Field Array 初始化
    const { fields, append, remove, move } = useFieldArray<ProductFilesFormValues, "files">({
        control,
        name: "files",
    });

    // 4. 監聽所有檔案變更 (為了取得即時的 category 用於篩選)
    const watchedFiles = watch("files");

    // 5. 處理新增邏輯：根據當前 Filter 自動帶入 Category
    const handleAddRow = () => {
        // 如果在 "All" 分頁，預設給第一個類別；如果在特定分頁，直接給該類別
        const defaultCategory = activeFilter === "All" ? FILE_CATEGORIES[0] : activeFilter;

        append({
            category: defaultCategory,
            name: "",
            link: "",
            disabled_countries: [],
            order: fields.length + 1,
        });
    };

    return (
        <div className="space-y-4">
     

            {/* --- Filter Tabs (篩選頁籤) --- */}
            <div className="flex flex-wrap gap-2 mb-6">
                {FILTER_OPTIONS.map((filter) => (
                    <Button
                        key={filter}
                        type="button"
                        variant="outline" // 使用 shadcn 的樣式
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "", // 調整大小
                            activeFilter === filter
                                ? "bg-slate-800 text-white hover:bg-slate-700 hover:text-white border-slate-800"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-muted/50 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                        )}
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            {/* --- Data Table --- */}
            <div className="rounded-md  overflow-hidden ">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-muted/50 ">
                        <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="w-[180px]">Category</TableHead>
                            <TableHead>Name of doc/file</TableHead>
                            <TableHead>Link (URL)</TableHead>
                            <TableHead className="w-[100px] text-center">Country</TableHead>
                            <TableHead className="w-[80px] text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {fields.map((field, index) => {
                            // A. 取得當前這行的最新資料 (因為 fields 不會即時更新 input value)
                            const currentFile = watchedFiles?.[index];
                            const currentCategory = currentFile?.category || field.category; // fallback 到 field

                            // B. 篩選邏輯：如果不符合，直接不渲染 (return null)
                            // 注意：我們依然保留了 map 的 index，這樣 React Hook Form 才能對應到正確的陣列位置
                            const isVisible = activeFilter === "All" || currentCategory === activeFilter;

                            if (!isVisible) return null;

                            return (
                                <TableRow key={field.id} className=" transition-colors ">

                                    {/* 拖拉把手 (裝飾用，之後可做排序) */}
                                    <TableCell className="py-4">
                                        <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                                    </TableCell>

                                    {/* 1. Category */}
                                    <TableCell className="py-4 align-top">
                                        <Controller
                                            control={control}
                                            name={`files.${index}.category`}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="bg-white h-9 w-full">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FILE_CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>
                                                                {cat}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </TableCell>

                                    {/* 2. File Name */}
                                    <TableCell className="py-4 align-top">
                                        <Input
                                            {...register(`files.${index}.name`)}
                                            placeholder="File name"
                                            className="bg-white h-9"
                                        />
                                    </TableCell>

                                    {/* 3. Link */}
                                    <TableCell className="py-4 align-top">
                                        <Input
                                            {...register(`files.${index}.link`)}
                                            placeholder="https://"
                                            className="bg-white h-9 text-blue-600 underline-offset-4"
                                        />
                                    </TableCell>

                                    {/* 4. Country Selector */}
                                    <TableCell className="py-4 align-top text-center">
                                        <Controller
                                            control={control}
                                            name={`files.${index}.disabled_countries`}
                                            render={({ field }) => (
                                                <CountrySelector
                                                    Selectcoutry={field.value}
                                                    onChange={(newVal) => {
                                                        // 強制設定為 dirty，確保表單知道有變更
                                                        field.onChange(newVal);
                                                    }}
                                                />
                                            )}
                                        />
                                    </TableCell>

                                    {/* 5. Remove Button */}
                                    <TableCell className="py-4 align-top text-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {/* Empty State Hint (當篩選結果為空時顯示) */}
                        {watchedFiles?.length > 0 &&
                            watchedFiles.filter((f: any) => activeFilter === "All" || f.category === activeFilter).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-4 text-center text-slate-500">
                                        No files found in <span className="font-bold">"{activeFilter}"</span> category.
                                    </TableCell>
                                </TableRow>
                            )}

                        {/* 完全沒資料時的顯示 */}
                        {fields.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-4 text-center text-slate-500">
                                    No files added yet.
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </div>

            {/* --- Add Button --- */}
            <div className="mt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                    onClick={handleAddRow}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add File to {activeFilter === "All" ? "List" : activeFilter}
                </Button>
            </div>
        </div>
    );
}