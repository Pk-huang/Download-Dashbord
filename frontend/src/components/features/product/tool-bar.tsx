'use client';

import { useState } from "react";
import { FilterBar } from '@/components/shared/filter-bar';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";



export function ToolBar() {
    const [searchTerm, setSearchTerm] = useState('');


    return (
        <FilterBar>
            {/* 左側搜尋 */}
            <div className="w-full md:w-1/3 relative ">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search name..."
                    className="pl-9 "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 右側篩選選單 */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                <Select defaultValue="all" >
                    <SelectTrigger className='min-w-[240px]'>
                        <SelectValue placeholder="Product Line" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem className='min-w-[240px]' value="all">ALL (Product Line)</SelectItem>
                        <SelectItem className='min-w-[240px]' value="monitor">Monitor</SelectItem>
                        <SelectItem className='min-w-[240px]' value="ifp">IFP</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all">
                    <SelectTrigger className="">
                        <SelectValue placeholder="Series" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Series</SelectItem>
                        <SelectItem value="monitor">Monitor</SelectItem>
                        <SelectItem value="ifp">IFP</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="10">
                    <SelectTrigger >
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                {/* ...其他 Select 省略，結構保持不變... */}
            </div>
        </FilterBar>
    )
}