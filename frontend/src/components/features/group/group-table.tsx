'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText, Trash } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion'; // 1. 引入
import { deleteProduct } from '@/lib/api/product'; // 2. 引入刪除 API
import { string } from 'zod';


export interface GroupTableProps {
    id: number;
    name: string;
    source: string;
    modified_by: string;
    modified_date: string;
}

export function GroupTable({ data }: { data: GroupTableProps[] }) { // 接收參數


    const handleDelete = async (id: string) => {
        if (!id) return; // 沒有 ID 就不執行刪除

        const confirmed = window.confirm("Are you sure you want to delete this group? This action cannot be undone.");
        if (!confirmed) return;

        try {
            await deleteProduct(string().parse(id));
            // 刪除成功後可以選擇導回列表頁或顯示成功訊息
            alert("Group deleted successfully.");
            // 如果有返回連結，則導回去

        } catch (error) {
            console.error("Failed to delete group:", error);
            alert("Failed to delete group. Please try again.");
        }
    }


    return (
        <Table className=' table-auto '>
            <TableHeader className=" ">
                <TableRow className='bg-slate-100  dark:bg-muted/50 '>
                    <TableHead className="font-bold py-5  min-w-[150px]">Name</TableHead>
                    <TableHead className="font-bold py-5">Source</TableHead>
                    <TableHead className="font-bold py-5">Modified</TableHead>
                    <TableHead className="font-bold py-5 w-[100px]">Date</TableHead>
                    <TableHead className="font-bold py-5 text-center min-w-[100px]">Update</TableHead>
                </TableRow>
            </TableHeader>
            <AnimatePresence mode='popLayout'>
                <TableBody className="relative">
                    {!data || data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                No groups found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((group) => (
                            <motion.tr
                                key={group.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className=" dark:hover:bg-muted/50 dark:border-gray-700 border-b border-gray-200 "
                            >
                                <TableCell className="font-medium text-slate-900 ">{group.name}</TableCell>



                                <TableCell>{group.source}</TableCell>
                                <TableCell>{group.modified_by}</TableCell>
                                <TableCell>{group.modified_date}</TableCell>
                                <TableCell className="text-center">
                                    <Link href={`/groups/${group.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <FileText className="h-4 w-4 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400" />
                                        </Button>
                                    </Link>

                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(String(group.id))}>
                                        <Trash className="h-4 w-4 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400" />
                                    </Button>

                                </TableCell>
                            </motion.tr>
                        ))
                    )}
                </TableBody>
            </AnimatePresence>
        </Table>
    )
}