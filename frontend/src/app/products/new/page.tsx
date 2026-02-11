// src/app/products/new/page.tsx
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ProductForm } from '@/components/shared/product-form';


export default function NewProductPage() {
  return (
    <div className="w-full px-12 pt-6 bg-white min-h-screen">

      {/* 1. 頁面標題 (帶返回按鈕) */}

      <PageHeader title="Create Product" subtitle='Product Information' backUrl="/products" />


      {/* 2. 載入表單元件 */}
      <div className=" mx-auto">
        <ProductForm />
      </div>

    </div>
  );
}