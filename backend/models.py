from sqlalchemy import  Column, Integer, String, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship # 👈 加上這一行！超級重要！
from database import Base

 # 1. 群組與產品的橋接表 (多對多)
group_product_association = Table(
    'group_product',
    Base.metadata,
    Column('group_id', Integer, ForeignKey('groups.id', ondelete="CASCADE"), primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id', ondelete="CASCADE"), primary_key=True)
)

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
    
    groups = relationship("Group", secondary=group_product_association, back_populates="products")


    
# 2. 群組主表
class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, index=True)
    source = Column(String, default="personal") # 預設為 personal
    modified_by = Column(String)
    modified_date = Column(String)

    # 關聯設定
    # 與 Product 是多對多 (透過 group_product_association)
    products = relationship("Product", secondary=group_product_association, back_populates="groups")
    
    # 與 GroupFile 是一對多 (Cascade: 刪除群組時，底下檔案一併刪除)
    files = relationship("GroupFile", back_populates="group", cascade="all, delete-orphan")


# 3. 群組檔案表
class GroupFile(Base):
    __tablename__ = "group_files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    
    category = Column(String)
    name = Column(String)
    link = Column(String)
    disabled_countries = Column(String) # 存放 JSON 字串，例如 '["CN", "RU"]'
    order = Column(Integer, default=0)

    # 反向關聯回 Group
    group = relationship("Group", back_populates="files")