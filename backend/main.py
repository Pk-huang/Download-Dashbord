from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc # 1. 記得引入 desc (descending)


import models
import schemas
from database import engine, get_db

# --- 1. 初始化資料庫 ---
# 這行指令很重要：它會去檢查資料庫檔案在不在，不在的話就依照 models.py 自動建立表格
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- 2. 設定 CORS (跨域權限) ---
# 因為前端在 localhost:3000，後端在 localhost:8000
# 如果沒設這個，瀏覽器會擋住前端的請求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開發環境允許所有來源，正式上線再改
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. API 路由區 ---


# 取得所有產品 (GET)
@app.get("/products", response_model=schemas.PaginatedResponse[schemas.Product])
def read_products(
    page: int = 1,
    limit: int = 10,
    name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # 去資料庫撈資料，相當於 SQL: SELECT * FROM products
    # 先建立基本的查詢物件
    
    

    query = db.query(models.Product)
    
    query = query.order_by(
            desc(models.Product.modified_date)
        )

    # 3. 判斷：如果有傳 name 進來，就加上過濾條件
    if name:
        # models.Product.name.contains(name) 會轉成 SQL 的 LIKE '%name%'
        # 這代表「只要名稱裡面包含這個字」都算符合
        query = query.filter(models.Product.name.contains(name))

   

    total = query.count()  # 4. 先算出總筆數，這樣前端才知道分頁要怎麼做
    skip = (
        page - 1
    ) * limit  # 5. 計算要跳過幾筆 (Skip Logic)，這樣才能拿到正確的分頁資料

    # 最後再加上分頁並執行查詢
    products = query.offset(skip).limit(limit).all()
    return {"data": products, "total": total, "page": page, "limit": limit}


# 新增產品 (POST)
@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # 1. 把 Pydantic schema 轉成 dict
    product_data = product.model_dump()

    # 2. 建立資料庫 Model 物件
    db_product = models.Product(**product_data)

    # 3. 存入資料庫
    db.add(db_product)
    db.commit()  # 確認交易
    db.refresh(db_product)  # 重新抓取 (為了拿到自動產生的 id)

    return db_product


# 取得單一產品 (GET by ID) - 編輯頁用
@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# 更新產品 (PUT) - 編輯頁存檔用
@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    product_update: schemas.ProductCreate,
    db: Session = Depends(get_db),
):
    # 1. 先找舊資料
    db_product = (
        db.query(models.Product).filter(models.Product.id == product_id).first()
    )
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. 更新欄位
    for key, value in product_update.model_dump().items():
        setattr(db_product, key, value)

    # 3. 存檔
    db.commit()
    db.refresh(db_product)
    return db_product


# 刪除產品 (DELETE)
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    # 1. 先找有沒有這筆資料
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    # 2. 如果找不到，回傳 404 錯誤
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # 3. 刪除並存檔
    db.delete(product)
    db.commit()
    
    return {"ok": True, "message": "Product deleted successfully"}
