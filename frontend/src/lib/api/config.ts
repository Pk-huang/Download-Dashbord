// 判斷現在是在「瀏覽器(Client)」還是在「Docker容器(Server)」
export const isServer = typeof window === 'undefined';


// 如果是 Server 端 (Docker內)，要連到 "http://backend:8000" (容器名稱)
// 如果是 Client 端 (瀏覽器)，要連到 "http://localhost:8000" (您的本機)
export const API_URL = isServer
    ? "http://backend:8000"  // Docker 內部互連
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");


/* 取得資料 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}


// 定義一下前端送資料時的型別 (對應後端的 ProductCreate Schema)
export interface FileItemPayload {
    category: string;
    name: string;
    link: string;
    disabled_countries: string[];
    order?: number; // 
}