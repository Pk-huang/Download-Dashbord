'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

import { useAutoAnimate } from '@formkit/auto-animate/react'; // 1. 引入這個 hook

export interface ProductTableProps {
    data?: any[];
}

export function ProductTable({ data }: ProductTableProps) { // 接收參數

    const [parent] = useAutoAnimate(); // 2. 使用 hook，它會回傳一個 ref (parent)
    console.log(parent); // 確認 data 的內容
    // 只要 parent 裡面的子元素有變動 (新增/刪除/移動)，就會自動產生動畫
    return (
        <Table className=' table-auto '>
            <TableHeader className=" ">
                <TableRow className='bg-slate-100 '>
                    <TableHead className="font-bold py-5  min-w-[150px]">Name</TableHead>
                    <TableHead className="font-bold py-5">Product Line</TableHead>
                    <TableHead className="font-bold py-5">Series</TableHead>
                    <TableHead className="font-bold py-5">Modified</TableHead>
                    <TableHead className="font-bold py-5 w-[100px]">Date</TableHead>
                    <TableHead className="font-bold py-5 text-center min-w-[100px]">Update</TableHead>
                </TableRow>
            </TableHeader>
         <TableBody ref={parent} className="relative">
                    {!data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                No products found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((product) => (
                            <TableRow key={product.id} className="hover:bg-slate-50 ">
                                <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                                <TableCell>{product.product_line}</TableCell>
                                <TableCell>{product.series}</TableCell>
                                <TableCell>{product.modified_by}</TableCell>
                                <TableCell>{product.modified_date}</TableCell>
                                <TableCell className="text-center">
                                    <Link href={`/products/${product.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <FileText className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
        </Table>
    )
}