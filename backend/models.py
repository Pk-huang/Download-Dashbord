from sqlalchemy import Column, Integer, String, JSON
from database import Base

class Product(Base):
    # 這行告訴資料庫，這張表的名字叫 "products"
    __tablename__ = "products"

    # 定義欄位 (Columns)
    id = Column(Integer, primary_key=True, index=True) # 唯一的識別碼
    name = Column(String, index=True)                  # 產品名稱
    product_line = Column(String)                      # 產品線
    series = Column(String, nullable=True)             # 系列 (nullable代表可以為空)
    
    # 這裡我們偷懶一下：直接用 JSON 存 files 陣列
    # 這樣我們就不用多開一張表來存檔案列表，對初期開發最快
    files = Column(JSON, default=[]) 
    
    # 系統自動欄位
    modified_by = Column(String, default="Admin")
    modified_date = Column(String)
    
    
    