// src/lib/api.ts

import { ur } from "zod/locales";

// 判斷現在是在「瀏覽器(Client)」還是在「Docker容器(Server)」
const isServer = typeof window === 'undefined';

// 如果是 Server 端 (Docker內)，要連到 "http://backend:8000" (容器名稱)
// 如果是 Client 端 (瀏覽器)，要連到 "http://localhost:8000" (您的本機)
const API_URL = isServer
    ? "http://backend:8000"  // Docker 內部互連
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

// ... 下面的 fetch 程式碼不用改


export interface ProductPayload {
    name: string,
    product_line: string,
    series?: string,
    files: any[],
    modified_date: string,
}

/* 取得資料 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}


export async function fetchProducts(query?: string ,page: number = 1){

    const url = new URL(`${API_URL}/products`);
    if (query) url.searchParams.set('name', query); // 拼接到後端網址

    url.searchParams.set('page', page.toString()); // 傳送 page 給後端
    url.searchParams.set('limit', '10');           // 設定一頁 10 筆

    console.log('Fetching products with URL:', url.toString()); // 調試用，看看實際呼叫的 URL
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json() as Promise<PaginatedResponse<any>>; // 回傳分頁格式的資料
}

/* 依 ID 取得單一產品資料 */
export async function fetchProductById(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

/* 新增產品 */
export async function createProduct(data: ProductPayload) {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to create product');
    }
    return response.json();
}

export async function updateProduct(id: string, data: ProductPayload) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update product');
    }
    return response.json();
}


export async function deleteProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete product');
    }
    return response.json();
}