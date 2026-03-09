import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";

import { PageHeader } from '@/components/shared/page-header';
import { GroupTable } from '@/components/features/group/group-table';
import { SearchBar } from '@/components/features/product/searchl-bar';
import { PageNav } from '@/components/shared/paginav';

import { fetchProducts } from '@/lib/api/product'; // 引入真實 API

interface GroupListPageProps {
  // 可以在這裡定義接收的 props 型別
  searchParams?: {
    query?: string;
    page?: string;  
  };
}

export default async function GroupListPage({ searchParams }: GroupListPageProps) {
  const params = await searchParams;
  const query = params?.query || '';


  const currentPage = Number(params?.page) || 1;

  const response = await fetchProducts(query, currentPage); // 呼叫 API，傳入 query 和 page

  return (
    <div className=" w-full px-12 pt-6 min-h-screen">

      {/* 1. 使用共用的 PageHeader */}
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Group List"
          icon="file"
          subtitle='Group Page'
        />
      </div>

      <div className="flex justify-end mb-7">
        <Link href="/groups/new">
          <Button variant="vsbds_sky" size="vsbds_size">
            <Plus />
            新建群組
          </Button>
        </Link>
      </div>

      <SearchBar />

      {/* 3. 表格區域 (Table 比較特殊，通常直接放，或是之後也可以包成 DataTable) */}
      <div className='rounded-md overflow-hidden'>
        <GroupTable data={response.data} />
      </div>

      <PageNav totalCount={response.total }   />

    </div>
  );
}