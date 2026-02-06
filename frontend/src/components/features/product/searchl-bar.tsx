'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { FilterBar } from '@/components/shared/filter-bar';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";



export function SearchBar() {
    // const [searchTerm, setSearchTerm] = usse('');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(`Searching... ${term}`);
        
        const params = new URLSearchParams(searchParams);
        
        // 搜尋變更時，通常要重置回第 1 頁
        // params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }, 300);



    return (
        <FilterBar>
            {/* 左側搜尋 */}
            <div className="w-full md:w-1/3 relative ">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search name..."
                    className="pl-9 "
                    onChange={(e) => handleSearch(e.target.value)}

                    defaultValue={searchParams.get('query')?.toString()}
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