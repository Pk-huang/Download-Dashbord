from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

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
    allow_origins=["*"], # 開發環境允許所有來源，正式上線再改
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. API 路由區 ---

# 取得所有產品 (GET)
@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # 去資料庫撈資料，相當於 SQL: SELECT * FROM products
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

# 新增產品 (POST)
@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # 1. 把 Pydantic schema 轉成 dict
    product_data = product.model_dump()
    
    # 2. 建立資料庫 Model 物件
    db_product = models.Product(**product_data)
    
    # 3. 存入資料庫
    db.add(db_product)
    db.commit()      # 確認交易
    db.refresh(db_product) # 重新抓取 (為了拿到自動產生的 id)
    
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
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    # 1. 先找舊資料
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
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
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"ok": True}