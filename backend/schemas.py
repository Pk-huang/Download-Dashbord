from pydantic import BaseModel
from typing import List, Optional

# 1. 定義「檔案」的長相 (對應前端 files 裡的物件)
class FileItem(BaseModel):
    category: str
    name: str
    link: str
    disabled_countries: List[str] = []

# 2. 定義「建立產品」時，前端應該傳什麼給我 (Base Schema)
class ProductCreate(BaseModel):
    name: str
    product_line: str
    series: Optional[str] = None # 選填
    files: List[FileItem] = []   # 是一個 FileItem 的陣列
    modified_date: str

# 3. 定義「回傳給前端」時，會多出什麼欄位 (Response Schema)
# 繼承 ProductCreate，所以上面有的它都有，但多出了 id 和 modified_by
class Product(ProductCreate):
    id: int
    modified_by: str

    class Config:
        # 這行是設定讓 Pydantic 可以讀取 SQLAlchemy 的資料格式
        from_attributes = True