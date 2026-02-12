
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header'; // 用您剛剛改好的 Header
import { ProductForm } from '@/components/shared/product-form'; // 用我們做好的 Form

import { fetchProductById } from '@/lib/api';


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
    <div className="w-full px-12 pt-6  min-h-screen bg-white dark:bg-background">

      {/* 1. Header: 使用 autoBack 自動偵測回上一頁 */}
      <PageHeader
        id={String(product.id)} // 這裡的 ID 是給 Header 顯示用的，實際上 Header 不會用到它，但傳了之後 URL 上會有 ID (例如 Edit Product: VP1655 (ID: 123))
        title={`${product.name}`}
        autoBack={true}
      />

      {/* 2. Form: 傳入 initialData，表單會自動填好值 */}
      <div className=" mx-auto">
        <ProductForm initialData={product} />
      </div>

    </div>
  );
}