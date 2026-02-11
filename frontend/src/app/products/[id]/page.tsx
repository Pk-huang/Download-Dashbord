import React from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header'; // 用您剛剛改好的 Header
import { ProductForm } from '@/components/shared/product-form'; // 用我們做好的 Form

import { fetchProductById } from '@/lib/api';
import { ProductFormValues } from '@/lib/schemas/product-schema';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 這是 Server Component，所以可以直接 async 抓資料
export default async function EditProductPage({ params }: EditProductPageProps) {
  // 1. 模擬從後端抓取資料
  // 注意：params.id 對應的是網址上的 ID
  const { id } = await params; 
  
  // 2. 使用解析出來的 id 去抓資料
  const product = await fetchProductById(id);

  // 2. 如果找不到產品，顯示 404
  if (!product) {
    notFound();
  }

  console.log("Initial Data for Form:", product);

  return (
    <div className="w-full px-12 pt-6 bg-white min-h-screen">

      {/* 1. Header: 使用 autoBack 自動偵測回上一頁 */}
      <PageHeader
        title={`Edit Product: ${product.name}`}
        autoBack={true}
      />

      {/* 2. Form: 傳入 initialData，表單會自動填好值 */}
      <div className=" mx-auto">
        <ProductForm initialData={product} />
      </div>

    </div>
  );
}