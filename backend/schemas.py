import json
from pydantic import BaseModel, field_validator
from typing import List, Optional, Generic, TypeVar, Any

T = TypeVar("T")

# ==========================================
# 1. 共用與基礎 Schema
# ==========================================

class FileItem(BaseModel):
    category: str
    name: str
    link: str
    disabled_countries: List[str] = []

    # ✨ 殺蟲魔術：自動把資料庫的字串 '[]' 轉回陣列 List
    @field_validator('disabled_countries', mode='before')
    @classmethod
    def parse_disabled_countries(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v or []

class GroupBasic(BaseModel):
    id: int
    name: str
    source: str
    
    class Config:
        from_attributes = True

class ProductBasic(BaseModel):
    id: int
    name: str
    product_line: str
    series: Optional[str] = None
    
    class Config:
        from_attributes = True

# ==========================================
# 2. Product 相關 Schema
# ==========================================

class ProductCreate(BaseModel):
    name: str
    product_line: str
    series: Optional[str] = None
    files: List[FileItem] = []
    modified_date: str
    
class Product(ProductCreate):
    id: int
    modified_by: str
    groups: List[GroupBasic] = [] 

    class Config:
        from_attributes = True

# ==========================================
# 3. Group 相關 Schema (✨ 徹底分家，解決500錯誤)
# ==========================================

# 📤 前端傳給後端 (POST/PUT)：只要 ID 陣列
class GroupCreate(BaseModel):
    name: str
    modified_date: str
    files: List[FileItem] = []
    selected_products: List[int] = []

# 📥 後端傳給前端 (GET 讀取單一筆)：不含 selected_products，只含完整的 products
class Group(BaseModel):
    id: int
    name: str
    source: str
    modified_by: str
    modified_date: str
    files: List[FileItem] = []
    products: List[ProductBasic] = [] 

    class Config:
        from_attributes = True

# 📥 後端傳給前端 (GET 讀取列表)：最輕量化，不含檔案與產品
class GroupList(BaseModel):
    id: int
    name: str
    source: str
    modified_by: str
    modified_date: str

    class Config:
        from_attributes = True

# ==========================================
# 4. 分頁共用 Schema
# ==========================================

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]      
    total: int         
    page: int          
    limit: int