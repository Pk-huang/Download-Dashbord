
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header'; // 用您剛剛改好的 Header
import { GroupForm } from '@/components/features/group/group-form'; // 用我們做好的 Form

import { fetchGroupById } from '@/lib/api';


interface EditGroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 這是 Server Component，所以可以直接 async 抓資料
export default async function EditGroupPage({ params }: EditGroupPageProps) {
  // 1. 模擬從後端抓取資料
  // 注意：params.id 對應的是網址上的 ID
  const { id } = await params; 
  
  // 2. 使用解析出來的 id 去抓資料
  const group = await fetchGroupById(id);

  // 2. 如果找不到群組，顯示 404
  if (!group) {
    notFound();
  }

  console.log("Initial Data for Form:", group);

  return (
    <div className="w-full px-12 pt-6  min-h-screen bg-white dark:bg-background">

      {/* 1. Header: 使用 autoBack 自動偵測回上一頁 */}
      <PageHeader
        id={String(group.id)} // 這裡的 ID 是給 Header 顯示用的，實際上 Header 不會用到它，但傳了之後 URL 上會有 ID (例如 Edit Group: VP1655 (ID: 123))
        title={`${group.name}`}
        autoBack={true}
      />

      {/* 2. Form: 傳入 initialData，表單會自動填好值 */}
      <div className=" mx-auto">
        {/* <GroupForm initialData={group} /> */}
      </div>

    </div>
  );
}