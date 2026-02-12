'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion'; // 1. 引入

export interface ProductTableProps {
    data?: any[];
}

export function ProductTable({ data }: ProductTableProps) { // 接收參數




    return (
        <Table className=' table-auto '>
            <TableHeader className=" ">
                <TableRow className='bg-slate-100  dark:bg-muted/50 '>
                    <TableHead className="font-bold py-5  min-w-[150px]">Name</TableHead>
                    <TableHead className="font-bold py-5">Product Line</TableHead>
                    <TableHead className="font-bold py-5">Series</TableHead>
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
                                No products found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((product) => (   
                            <motion.tr
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="hover:bg-slate-50  border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                            >
                                <TableCell className="font-medium text-slate-900 ">{product.name}</TableCell>
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
                            </motion.tr>
                        ))
                    )}
                </TableBody>
            </AnimatePresence>
        </Table>
    )
}