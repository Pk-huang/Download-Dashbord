import React from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header'; // 用您剛剛改好的 Header
import { ProductForm } from '@/components/features/product/product-form'; // 用我們做好的 Form
import { getProductById } from '@/lib/mock-data'; // 模擬抓資料
import { ProductFormValues } from '@/lib/schemas/product-schema';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

// 這是 Server Component，所以可以直接 async 抓資料
export default async function EditProductPage({ params }: EditProductPageProps) {
  // 1. 模擬從後端抓取資料
  // 注意：params.id 對應的是網址上的 ID
  const product = getProductById(params.id);

  // 2. 如果找不到產品，顯示 404
  if (!product) {
    notFound();
  }

  // 3. 資料轉換 (Transform)
  // 因為後端(Mock)的資料結構跟表單(Form)的結構可能不完全一樣
  // 我們需要把它轉成 ProductFormValues 格式
  const initialData: ProductFormValues = {
    name: product.name,
    product_line: product.product_line,
    series: product.series,
    // 這裡先塞假檔案資料，因為 Mock Data 的結構可能比較簡單
    // 等接後端時，這裡會是真實的 product.files
    files: [
      { category: "User Guide", name: `${product.name} Manual`, link: "https://example.com/manual.pdf", disabled_countries: [] },
      { category: "Driver & Software", name: "v1.0 Driver", link: "https://example.com/driver.zip", disabled_countries: [] },
    ]
  };

  return (
    <div className="p-6 w-full max-w-[1400px] mx-auto bg-slate-50/50 min-h-screen">
      
      {/* 1. Header: 使用 autoBack 自動偵測回上一頁 */}
      <PageHeader 
        title={`Edit Product: ${product.name}`}
        autoBack={true} 
      />

      {/* 2. Form: 傳入 initialData，表單會自動填好值 */}
      <div className="max-w-[1200px] mx-auto">
        <ProductForm initialData={initialData} />
      </div>
      
    </div>
  );
}