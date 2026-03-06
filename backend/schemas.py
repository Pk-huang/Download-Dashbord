from pydantic import BaseModel
from typing import List, Optional, Generic, TypeVar

T = TypeVar("T")

# --- 共用與基礎 Schema ---

class FileItem(BaseModel):
    category: str
    name: str
    link: str
    disabled_countries: List[str] = []

# 為了避免無限迴圈，我們先定義一個「輕量版」的群組資訊
# 專門給 Product 讀取時當作 Tag 標籤使用
class GroupBasic(BaseModel):
    id: int
    name: str
    source: str
    
    class Config:
        from_attributes = True

# 同樣地，定義一個「輕量版」的產品資訊
# 專門給 Group 讀取時，顯示群組內有哪些產品使用
class ProductBasic(BaseModel):
    id: int
    name: str
    product_line: str
    series: Optional[str] = None
    
    class Config:
        from_attributes = True


# --- Product 相關 Schema ---

class ProductCreate(BaseModel):
    name: str
    product_line: str
    series: Optional[str] = None
    files: List[FileItem] = []
    modified_date: str
    
class Product(ProductCreate):
    id: int
    modified_by: str
    # 👇 新增這行：讀取產品時，後端會自動帶入所屬的群組資訊！
    groups: List[GroupBasic] = [] 

    class Config:
        from_attributes = True


# --- Group 相關 Schema (本次新增) ---

# 定義「建立群組」時，前端應該傳什麼給我
class GroupCreate(BaseModel):
    name: str
    modified_date: str
    files: List[FileItem] = []   # 群組專屬的檔案
    product_ids: List[int] = []  # 👈 核心：前端只要傳產品 ID 陣列過來就好！

# 定義「回傳群組給前端」時，會多出什麼欄位
class Group(GroupCreate):
    id: int
    source: str
    modified_by: str
    # 👈 核心：回傳時，後端會自動把 ID 陣列展開成詳細的 ProductBasic 列表！
    products: List[ProductBasic] = [] 

    class Config:
        from_attributes = True


# --- 分頁共用 Schema ---

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]      
    total: int         
    page: int          
    limit: int