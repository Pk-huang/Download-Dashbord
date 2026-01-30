'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

// 引入我們剛剛做的共用元件
import { PageHeader } from '@/components/shared/page-header';
import { FilterBar } from '@/components/shared/filter-bar';

// Shadcn UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';


export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" w-full px-12 pt-6 bg-white min-h-screen">

      {/* 1. 使用共用的 PageHeader */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Product List"
          icon={FileText}
          subtitle='Product Page'
        />
      </div>
      <div className="flex justify-end mb-7">
        <Link href="/products/new">
          <Button variant="vsbds_sky" size="vsbds_size">
            <Plus />
            新增產品
          </Button>
        </Link>

      </div>

      {/* 2. 使用共用的 FilterBar */}
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

      {/* 3. 表格區域 (Table 比較特殊，通常直接放，或是之後也可以包成 DataTable) */}
      <div className='rounded-md overflow-hidden'>
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
            {filteredProducts.map((product) => (
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
      </div>


      {/* 4. 分頁元件 Pagination */}
      <Pagination className="mt-6 justify-end">
        <PaginationContent>
          <PaginationPrevious>
            <PaginationLink size="icon" aria-label="Previous">
              &lt;
            </PaginationLink>
          </PaginationPrevious>

          <PaginationItem>
            <PaginationLink size="icon" isActive href="#">
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink size="icon" href="#">
              2
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink size="icon" href="#">
              5
            </PaginationLink>
          </PaginationItem>

          <PaginationNext>
            <PaginationLink size="icon" aria-label="Next">
              &gt;
            </PaginationLink>
          </PaginationNext>
        </PaginationContent>
      </Pagination>


    </div>
  );
}