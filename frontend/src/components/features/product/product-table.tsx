import { fetchProducts } from '@/lib/api'; // 引入真實 API

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';


export async function  ProductTable() {
    const products = await fetchProducts();
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
            <TableBody>
                {products.map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
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
                ))}
            </TableBody>
        </Table>
    )
}