import sys
import os
import json
import random
from datetime import datetime, timedelta

# 為了確保能 import 專案內的模組，將當前目錄加入 path
sys.path.append(os.getcwd())

# 嘗試匯入必要的模組
try:
    from database import SessionLocal, engine, Base
    from models import Product
except ImportError as e:
    print("錯誤: 找不到 database 或 models 模組。")
    print(f"詳細錯誤: {e}")
    print("請確保這個腳本放在 backend 資料夾內，且與 main.py 同一層。")
    sys.exit(1)

# 1. 準備資料
SEED_DATA = [
  {"name": "VBS105-W", "product_line": "Accessories", "series": "Large Format Display"},
  {"name": "VBS104-W", "product_line": "Accessories", "series": "Large Format Display"},
  {"name": "VA-AC10", "product_line": "Accessories", "series": "Large Format Display"},
  {"name": "VA-AC8-N", "product_line": "Accessories", "series": "Large Format Display"},
  {"name": "VSH29168", "product_line": "Projector", "series": "Value"},
  {"name": "VG1457", "product_line": "Display", "series": "Business — VG Series"},
  {"name": "XG2735-2K-W", "product_line": "Display", "series": "Gaming — XG series"},
  {"name": "XG2735-2K", "product_line": "Display", "series": "Gaming — XG series"},
  {"name": "VX24G11-2", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VA27G11-2", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "LD-STND-009", "product_line": "Accessories", "series": "Direct View LED Display"},
  {"name": "V784K", "product_line": "Projector", "series": "LED Projector"},
  {"name": "VA1653-2", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "LCD-SMA-004", "product_line": "Accessories", "series": "Display"},
  {"name": "LCD-SMA-002", "product_line": "Accessories", "series": "Display"},
  {"name": "VP2768A_H2-2", "product_line": "Display", "series": "Professional — VP Series"},
  {"name": "VA272-HDJ", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VX27G26-2K-4", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VA2731-4K-HD", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA24G25-MHDJ", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VG2719U-4K", "product_line": "Display", "series": "Business — VG Series"},
  {"name": "VA272-MHD", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA242-MHD", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA242-HDJ", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA27G1-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VX2740D-4K", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "XG2738-2K-OLED", "product_line": "Display", "series": "Gaming — XG series"},
  {"name": "VX2738-2K-OLED", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "LS740W-5", "product_line": "Projector", "series": "LCD Series"},
  {"name": "LSD600W", "product_line": "Projector", "series": "LCD Series"},
  {"name": "V52HD-5", "product_line": "Projector", "series": "LCD Series"},
  {"name": "LS740HD-5", "product_line": "Projector", "series": "LCD Series"},
  {"name": "V53HD", "product_line": "Projector", "series": "LCD Series"},
  {"name": "UMC211T", "product_line": "Accessories", "series": "Large Format Display"},
  {"name": "VG1655-1T", "product_line": "Display", "series": "Business — VG Series"},
  {"name": "TD1655-1T", "product_line": "Display", "series": "Touch Displays"},
  {"name": "VX27G70Z-2K-3", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VX27G70Z-2K-2", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VX27G70Z-2K", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VA270A-H-2", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA272-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA242-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA2708-2K-HD-2", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VX2779-HD-PRO-2", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VA221A-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VX2479-HD-PRO-2", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "CDE9831-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE8631-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE7531-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE6531-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE5531-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE4331-1B", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "VA1650-1N", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VX3276-MHD-4T", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VA242-MH", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "VA272-MH", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "IN01-2", "product_line": "Large Format Display", "series": "Interactive Flat Panel"},
  {"name": "VA2272-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "V754K", "product_line": "Projector", "series": "Laser Series"},
  {"name": "V724K", "product_line": "Projector", "series": "Laser Series"},
  {"name": "VA22E2-H", "product_line": "Display", "series": "Value — VA Series"},
  {"name": "XG273F-2K-OLED", "product_line": "Display", "series": "Gaming — XG series"},
  {"name": "VX2756-2K-PRO-3", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "LX750-4KB", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LX750-4KE", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LX750-4KN", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LX720-4KN", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LX720-4KB", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LX720-4KE", "product_line": "Projector", "series": "Laser Series"},
  {"name": "LDM136-151C", "product_line": "Projector", "series": "LED Projector"},
  {"name": "TD2230-1B", "product_line": "Display", "series": "Touch Displays"},
  {"name": "VX2776-4K-MHDU-1T", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VX2467-MHD-1T", "product_line": "Display", "series": "Entertainment – VX Series"},
  {"name": "VS2747-H-2B", "product_line": "Display", "series": "Medical Display"},
  {"name": "VS2747-H-2", "product_line": "Display", "series": "Medical Display"},
  {"name": "VG2208A-P", "product_line": "Display", "series": "Business — VG Series"},
  {"name": "VG2748A-2B", "product_line": "Display", "series": "Business — VG Series"},
  {"name": "CDE43G3-1M", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE55G3-1M", "product_line": "Large Format Display", "series": "Commercial TVs"},
  {"name": "CDE65G3-1M", "product_line": "Large Format Display", "series": "Commercial TVs"}
]

def get_random_date(year_start=2025, year_end=2026):
    start_date = datetime(year_start, 1, 1)
    end_date = datetime(year_end, 12, 31)
    delta = end_date - start_date
    random_days = random.randrange(delta.days)
    return (start_date + timedelta(days=random_days)).strftime("%Y-%m-%d")

# 2. 執行匯入
def seed():
    # 建立資料庫連線
    db = SessionLocal()
    try:
        # 強制建立資料表 (如果不存在)
        Base.metadata.create_all(bind=engine)
        print("資料表結構檢查完畢。")

        # 清空資料
        db.query(Product).delete()
        db.commit()
        print("舊資料已清空。")

        # 寫入新資料
        count = 0
        for item in SEED_DATA:
            product = Product(
                name=item["name"],
                product_line=item["product_line"],
                series=item["series"],
                files=[],  # 這裡 JSON 欄位直接給 list，SQLAlchemy 會處理
                modified_by="Admin",
                modified_date=get_random_date()
            )
            db.add(product)
            count += 1
        
        db.commit()
        print(f"==========================================")
        print(f"成功匯入 {count} 筆資料到 Docker 資料庫！")
        print(f"==========================================")
        
    except Exception as e:
        print(f"匯入失敗: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()