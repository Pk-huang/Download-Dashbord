# 建立 backend/main.py
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# 允許 Next.js (Port 3000) 呼叫 API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 簡單的 SQLite 初始化
def init_db():
    conn = sqlite3.connect("dashboard.db")
    c = conn.cursor()
    # 建立一個測試用的 table
    c.execute(
        """CREATE TABLE IF NOT EXISTS downloads 
                 (id INTEGER PRIMARY KEY, filename TEXT, status TEXT)"""
    )
    conn.commit()
    conn.close()


init_db()


@app.get("/")
def read_root():
    return {"message": "Download-dashbord Backend is Running!"}


@app.get("/api/data")
def get_data():
    # 這裡未來會從 SQLite 讀取，現在先回傳假資料
    return [
        {"id": 1, "filename": "report_2023.pdf", "status": "completed"},
        {"id": 2, "filename": "image_pack.zip", "status": "processing"},
    ]
