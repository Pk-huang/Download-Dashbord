import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";

import { PageHeader } from '@/components/shared/page-header';
import { ProductTable } from '@/components/features/product/product-table';
import { ToolBar } from '@/components/features/product/tool-bar';
import { PageNav } from '@/components/shared/paginav';

export default function ProductListPage() {
 
  return (
    <div className=" w-full px-12 pt-6 bg-white min-h-screen">

      {/* 1. 使用共用的 PageHeader */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Product List"
          icon="file"
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

      <ToolBar />

      {/* 3. 表格區域 (Table 比較特殊，通常直接放，或是之後也可以包成 DataTable) */}
      <div className='rounded-md overflow-hidden'>
        <ProductTable />
      </div>

      <PageNav />

    </div>
  );
}