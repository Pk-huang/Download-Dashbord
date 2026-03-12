import { API_URL, PaginatedResponse, FileItemPayload } from '@/lib/api/config'; // 引入 API_URL 和型別


// 建立或更新群組時，前端要送出的資料格式
export interface GroupPayload {
    name: string;
    modified_date: string;
    selectedProducts: number[]; // 核心：只要傳 ID 陣列給後端！
    files?: FileItemPayload[];
}

export async function fetchGroups(query?: string, page: number = 1) {
    const url = new URL(`${API_URL}/groups`);
    if (query) url.searchParams.set('name', query);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', '10');

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json() as Promise<PaginatedResponse<any>>;
}

export async function fetchGroupById(id: string) {
    const response = await fetch(`${API_URL}/groups/${id}`);
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
}

export async function createGroup(data: GroupPayload) {
    const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
}

export async function updateGroup(id: string, data: GroupPayload) {
    const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update group');
    return response.json();
}

export async function deleteGroup(id: string) {
    const response = await fetch(`${API_URL}/groups/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete group');
    return response.json();
}