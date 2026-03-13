"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Trash, Settings, Package, Monitor } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

// --- 引入您設定好的 Shadcn UI ---
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// --- 型別定義 ---
export interface ProductBasic {
    id: number;
    name: string;
    category: string;
    series: string;
}

export interface SelectedUIItem {
    uniqueId: string;
    type: "series" | "product";
    name: string;
    category: string;
    series: string;
    productIds: number[];
}

interface SmartProductSelectorProps {
    availableProducts: ProductBasic[];
    onUpdateFormIds: (ids: number[]) => void;
}

export function SmartProductSelector({ availableProducts, onUpdateFormIds }: SmartProductSelectorProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SelectedUIItem[]>([]);

    // 同步底層資料給 React Hook Form
    useEffect(() => {
        const allIds = selectedItems.flatMap(item => item.productIds);
        const uniqueIds = Array.from(new Set(allIds));
        onUpdateFormIds(uniqueIds);
    }, [selectedItems, onUpdateFormIds]);

    // 分類與過濾邏輯
    const seriesGroups = useMemo(() => {
        const groups: Record<string, ProductBasic[]> = {};
        availableProducts.forEach(p => {
            if (!p.series) return;
            if (!groups[p.series]) groups[p.series] = [];
            groups[p.series].push(p);
        });
        return groups;
    }, [availableProducts]);

    const filteredSeries = useMemo(() => {
        return Object.keys(seriesGroups).filter(s => s.toLowerCase().includes(query.toLowerCase()));
    }, [query, seriesGroups]);

    const filteredProducts = useMemo(() => {
        return availableProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }, [query, availableProducts]);

    // --- 選擇邏輯 (含防呆) ---
    const handleSelectSeries = (seriesName: string) => {
        const productsInSeries = seriesGroups[seriesName];
        if (selectedItems.some(item => item.type === "series" && item.name === seriesName)) {
            toast.info(`${seriesName} 已經在清單中了！`);
            setQuery(""); setIsOpen(false); return;
        }

        const cleanList = selectedItems.filter(item => !(item.type === "product" && item.series === seriesName));
        if (cleanList.length !== selectedItems.length) {
            toast.success(`已加入 ${seriesName}，並自動合併底下的單品！`);
        }

        setSelectedItems([...cleanList, {
            uniqueId: `series-${seriesName}`,
            type: "series",
            name: `${seriesName} Series`,
            category: productsInSeries[0]?.category || "N/A",
            series: seriesName,
            productIds: productsInSeries.map(p => p.id),
        }]);
        setQuery(""); setIsOpen(false);
    };

    const handleSelectProduct = (product: ProductBasic) => {
        if (selectedItems.some(item => item.type === "series" && item.series === product.series)) {
            toast.error(`無法加入！${product.name} 已包含在 ${product.series} 系列中。`);
            setQuery(""); setIsOpen(false); return;
        }
        if (selectedItems.some(item => item.type === "product" && item.uniqueId === `product-${product.id}`)) {
            toast.info(`${product.name} 已經在清單中了！`);
            setQuery(""); setIsOpen(false); return;
        }

        setSelectedItems([...selectedItems, {
            uniqueId: `product-${product.id}`,
            type: "product",
            name: product.name,
            category: product.category,
            series: product.series,
            productIds: [product.id],
        }]);
        setQuery(""); setIsOpen(false);
    };

    const handleRemove = (uniqueId: string) => {
        setSelectedItems(prev => prev.filter(item => item.uniqueId !== uniqueId));
    };

    return (
        <>

            {/* --- 1. 搜尋輸入框 (套用您的 UI) --- */}
            <div className="relative w-full">
                <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Type name or series to search..."
                        className="pl-9 py-6 text-base bg-white dark:bg-slate-900  "
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {/* 下拉選單面板 */}
                {isOpen && (query || filteredSeries.length > 0 || filteredProducts.length > 0) && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800   rounded-lg shadow-xl max-h-80 overflow-y-auto">
                        {/* 系列結果 */}
                        {filteredSeries.length > 0 && (
                            <div className="p-2">
                                <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 rounded">
                                    📂 整個系列 (Series)
                                </div>
                                {filteredSeries.map(series => (
                                    <button key={`s-${series}`} type="button" onClick={() => handleSelectSeries(series)} className="w-full flex items-center justify-between px-3 py-2 mt-1 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 rounded-md transition-colors">
                                        <span><span className="font-bold">{series}</span> Series</span>
                                        <span className="text-xs text-slate-400  px-2 py-0.5 rounded bg-white dark:bg-slate-800">⏎ 加入全系列</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 分隔線 */}
                        {filteredSeries.length > 0 && filteredProducts.length > 0 && <div className="border-t border-slate-100  my-1"></div>}

                        {/* 單品結果 */}
                        {filteredProducts.length > 0 && (
                            <div className="p-2">
                                <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900 rounded">
                                    💻 單一產品 (Products)
                                </div>
                                {filteredProducts.map(product => (
                                    <button key={`p-${product.id}`} type="button" onClick={() => handleSelectProduct(product)} className="w-full flex items-center justify-between px-3 py-2 mt-1 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                                        <span>{product.name} <span className="text-slate-400 ml-1">({product.category})</span></span>
                                        <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded bg-white dark:bg-slate-800">＋ 加入單品</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- 2. 已選清單 (套用您的 Table 與 Framer Motion) --- */}

            <Table className="table-auto my-5">
                <TableHeader>
                    <TableRow className="bg-slate-100 dark:bg-muted/50">
                        <TableHead className="font-bold py-4 min-w-[200px]">Name</TableHead>
                        <TableHead className="font-bold py-4 min-w-[150px]">Product / Group</TableHead>
                        <TableHead className="font-bold py-4 text-center min-w-[100px]">Category</TableHead>
                        <TableHead className="font-bold py-4 text-center min-w-[100px]">Series</TableHead>
                        <TableHead className="font-bold py-4 text-right pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <AnimatePresence mode='popLayout'>
                    <TableBody className="relative">
                        {selectedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    目前尚未選擇任何產品，請從上方搜尋框加入。
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedItems.map((item) => (
                                <motion.tr
                                    key={item.uniqueId}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="dark:hover:bg-muted/50 dark:border-gray-700 border-b border-gray-200 group"
                                >
                                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                        <div className="flex items-center gap-2">
                                            {item.type === "series" ? <Package className="w-4 h-4 text-blue-500" /> : <Monitor className="w-4 h-4 text-slate-400" />}
                                            {item.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.type === "series" ? (
                                            <span className="text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100 dark:border-blue-800">
                                                Group ({item.productIds.length} items)
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs">Product</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600 dark:text-slate-300">{item.category}</TableCell>
                                    <TableCell className="text-center font-medium text-slate-600 dark:text-slate-300">{item.series}</TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.type === "series" && (
                                                <Button variant="ghost" size="icon" onClick={() => toast.info('Drawer 即將上線！')} title="管理系列">
                                                    <Settings className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleRemove(item.uniqueId)} title="移除">
                                                <Trash className="h-4 w-4 text-slate-500 hover:text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))
                        )}
                    </TableBody>
                </AnimatePresence>
            </Table>


        </>
    );
}