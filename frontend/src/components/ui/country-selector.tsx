'use client';

import { useState, useEffect, use } from "react";
import { Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { REGION_CONFIG, ALL_COUNTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils"; // 確保你有這個 utility (shadcn 預設有)

interface CountrySelectorProps {
    Selectcoutry: string[];// 傳入目前被隱藏的國家代碼，例如 ['tw', 'jp']
    onChange: (newValue: string[]) => void; // 回傳更新後的陣列
}


export function CountrySelector({ Selectcoutry = [], onChange }: CountrySelectorProps) {
    // 1. 本地狀態：使用者在彈窗內操作時，先暫存起來，不要直接改外部資料
    // 直到按下「確認」才送出
    const [selected, setSelected] = useState<string[]>(Selectcoutry);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (isOpen) {
            setSelected(Selectcoutry);
        }
    }, [isOpen, Selectcoutry]);

    // --- 邏輯區 ---

    // 判斷某個國家是否被選中 (隱藏)
    const isSelected = (Countrycode: string) => selected.includes(Countrycode);

    // 切換單一國家
    const toggleCountry = (Countrycode: string) => {
        if (isSelected(Countrycode)) {
            setSelected(selected.filter((SelectingCountry) => SelectingCountry !== Countrycode)); // 移除
        } else {
            setSelected([...selected, Countrycode]); // 加入
        }
     
    };

    // 切換整個區域 (例如 VSA)
    const toggleRegion = (regionKey: string) => {
        const countriesInRegion = REGION_CONFIG[regionKey];
        // 檢查該區域是否已經「全選」了
        const isAllRegionSelected = countriesInRegion.every((country) => selected.includes(country));

        if (isAllRegionSelected) {
            // 如果已經全選 -> 全部取消 (移除該區域所有國家)
            setSelected(selected.filter((country) => !countriesInRegion.includes(country)));
        } else {
            // 如果沒有全選 -> 全部加入 (加入該區域所有國家，注意去重複)
            setSelected(Array.from(new Set([...selected, ...countriesInRegion])));
        }
       
    }

    const toggleAll = () => {
        const isAllSelected = ALL_COUNTRIES.every((country) => selected.includes(country));
        if (isAllSelected) {
            // 已經全選 -> 全部取消
            setSelected([]);
        } else {
            // 沒有全選 -> 全部加入
            setSelected(ALL_COUNTRIES);
        }
        
    }

    const handleConfirm = () => {
        onChange(selected);
        console.log("Confirmed selection:", selected);
        setIsOpen(false);
    };


    const isAllDisabled = ALL_COUNTRIES.every((c) => selected.includes(c));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* 外面的觸發按鈕：顯示地球圖示 */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        // 如果有任何國家被隱藏，顯示紅色或不同顏色提醒
                        Selectcoutry.length > 0 ? "text-red-500 hover:text-red-600" : "text-slate-500"
                    )}
                    title={Selectcoutry.length > 0 ? `Disabled in ${Selectcoutry.length} regions` : "Visible to all"}
                >
                    <Globe className="h-5 w-5" />
                    {/* 可以加個小紅點顯示數量 */}
                    {Selectcoutry.length > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">請選擇要隱藏的國家</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">被選取的國家將無法下載此檔案</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">

                    {/* 1. 全部國家隱藏 */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">全部國家隱藏</h3>
                        <Button
                            variant="outline"
                            onClick={toggleAll}
                            className={cn(
                                "min-w-[120px]",
                                isAllDisabled && "bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            ALL Country
                        </Button>
                    </div>

                    <hr />

                    {/* 2. 區域迴圈 (VSA, VSE, VSI...) */}
                    {Object.entries(REGION_CONFIG).map(([regionKey, countries]) => {
                        const isRegionAllSelected = countries.every((c) => selected.includes(c));

                        return (
                            <div key={regionKey} className="space-y-3">
                                {/* 區域標題與全選按鈕 */}
                                <h3 className="text-lg font-bold">{regionKey}</h3>

                                <div className="flex flex-wrap gap-2">
                                    {/* 區域全選按鈕 */}
                                    <Button
                                        variant="outline"

                                        onClick={() => toggleRegion(regionKey)}
                                        className={cn(

                                            isRegionAllSelected
                                                ? "bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                                                : "border-slate-400"
                                        )}
                                    >
                                        {regionKey} ALL
                                    </Button>

                                    {/* 該區域的國家按鈕 */}
                                    {countries.map((code) => {
                                        const active = isSelected(code);
                                        return (
                                            <Button
                                                key={code}
                                                variant="outline"
                                                size="default"
                                                onClick={() => toggleCountry(code)}
                                                className={cn(

                                                    active && "bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                                                )}
                                            >
                                                {code}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                </div>

                <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t">
                    <Button onClick={handleConfirm} className="w-full sm:w-auto bg-slate-900 text-white">
                        回到上傳選項 (儲存設定)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}