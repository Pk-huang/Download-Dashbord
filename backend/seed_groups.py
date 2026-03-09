import random
from datetime import datetime, timedelta
from database import SessionLocal, engine
import models

# 確保資料表已經建立
models.Base.metadata.create_all(bind=engine)

# 剛剛確認的群組資料清單
GROUPS_DATA = [
    # 1. 圖片一：Product Line 總表 (22筆)
    { "name": "Product Line - Commercial Display", "source": "CMS", "modified_by": "system", "modified_date": "2024-11-15" },
    { "name": "Product Line - Commercial Display Accessories", "source": "CMS", "modified_by": "system", "modified_date": "2025-02-20" },
    { "name": "Product Line - Detachable PC Modules", "source": "CMS", "modified_by": "system", "modified_date": "2025-08-11" },
    { "name": "Product Line - Direct View LED", "source": "CMS", "modified_by": "system", "modified_date": "2024-05-05" },
    { "name": "Product Line - Direct View LED Accessories", "source": "CMS", "modified_by": "system", "modified_date": "2026-01-12" },
    { "name": "Product Line - For Microsoft Teams Rooms", "source": "CMS", "modified_by": "system", "modified_date": "2024-09-30" },
    { "name": "Product Line - LCD Display", "source": "CMS", "modified_by": "system", "modified_date": "2025-12-01" },
    { "name": "Product Line - Monitor Accessory", "source": "CMS", "modified_by": "system", "modified_date": "2025-04-18" },
    { "name": "Product Line - Monitor Software", "source": "CMS", "modified_by": "system", "modified_date": "2024-07-22" },
    { "name": "Product Line - Network Media Player", "source": "CMS", "modified_by": "system", "modified_date": "2026-02-15" },
    { "name": "Product Line - PC Mini", "source": "CMS", "modified_by": "system", "modified_date": "2024-10-08" },
    { "name": "Product Line - Pen Display", "source": "CMS", "modified_by": "system", "modified_date": "2025-06-25" },
    { "name": "Product Line - Presentation Software", "source": "CMS", "modified_by": "system", "modified_date": "2024-12-19" },
    { "name": "Product Line - Projector", "source": "CMS", "modified_by": "system", "modified_date": "2025-03-03" },
    { "name": "Product Line - Projector Accessories", "source": "CMS", "modified_by": "system", "modified_date": "2026-01-28" },
    { "name": "Product Line - Signage Software", "source": "CMS", "modified_by": "system", "modified_date": "2024-08-14" },
    { "name": "Product Line - Video Wall", "source": "CMS", "modified_by": "system", "modified_date": "2025-11-11" },
    { "name": "Product Line - ViewBoard", "source": "CMS", "modified_by": "system", "modified_date": "2025-01-09" },
    { "name": "Product Line - ViewBoard Accessories", "source": "CMS", "modified_by": "system", "modified_date": "2024-06-06" },
    { "name": "Product Line - ViewBoard Box", "source": "CMS", "modified_by": "system", "modified_date": "2025-10-27" },
    { "name": "Product Line - ViewBoard Sensor", "source": "CMS", "modified_by": "system", "modified_date": "2026-03-02" },
    { "name": "Product Line - ePoster", "source": "CMS", "modified_by": "system", "modified_date": "2024-04-01" },

    # 2. 圖片二：LCD Display Series (6筆)
    { "name": "LCD Display - TD Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-05-15" },
    { "name": "LCD Display - VA Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-11-20" },
    { "name": "LCD Display - VG Series", "source": "CMS", "modified_by": "system", "modified_date": "2026-02-10" },
    { "name": "LCD Display - VP Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-08-08" },
    { "name": "LCD Display - VX Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-09-12" },
    { "name": "LCD Display - XG Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-12-25" },

    # 3. 圖片三：Projector Applications (5筆)
    { "name": "Projector - Business", "source": "CMS", "modified_by": "system", "modified_date": "2025-03-18" },
    { "name": "Projector - Education", "source": "CMS", "modified_by": "system", "modified_date": "2024-07-30" },
    { "name": "Projector - Home Entertainment", "source": "CMS", "modified_by": "system", "modified_date": "2026-01-05" },
    { "name": "Projector - Installation", "source": "CMS", "modified_by": "system", "modified_date": "2025-10-14" },
    { "name": "Projector - On the Go", "source": "CMS", "modified_by": "system", "modified_date": "2024-12-02" },

    # 4. 圖片四：ViewBoard (IFP) Series (13筆)
    { "name": "ViewBoard - 33 Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-02-28" },
    { "name": "ViewBoard - 34 Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-08-25" },
    { "name": "ViewBoard - 35 Series", "source": "CMS", "modified_by": "system", "modified_date": "2026-03-01" },
    { "name": "ViewBoard - 41 Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-07-07" },
    { "name": "ViewBoard - 50 Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-11-18" },
    { "name": "ViewBoard - 51 Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-09-09" },
    { "name": "ViewBoard - 52 Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-05-22" },
    { "name": "ViewBoard - 53 Series", "source": "CMS", "modified_by": "system", "modified_date": "2026-01-20" },
    { "name": "ViewBoard - 62 Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-04-11" },
    { "name": "ViewBoard - 63 Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-10-05" },
    { "name": "ViewBoard - 110 Series", "source": "CMS", "modified_by": "system", "modified_date": "2025-11-29" },
    { "name": "ViewBoard - G1 Series", "source": "CMS", "modified_by": "system", "modified_date": "2026-02-05" },
    { "name": "ViewBoard - UW Series", "source": "CMS", "modified_by": "system", "modified_date": "2024-12-31" },

    # 5. 自訂群組 (20筆)
    { "name": "自訂群組 -- 1", "source": "personal", "modified_by": "Admin", "modified_date": "2025-01-20" },
    { "name": "自訂群組 -- 2", "source": "personal", "modified_by": "Admin", "modified_date": "2024-06-15" },
    { "name": "自訂群組 -- 3", "source": "personal", "modified_by": "Admin", "modified_date": "2025-08-22" },
    { "name": "自訂群組 -- 4", "source": "personal", "modified_by": "Admin", "modified_date": "2026-02-14" },
    { "name": "自訂群組 -- 5", "source": "personal", "modified_by": "Admin", "modified_date": "2024-11-03" },
    { "name": "自訂群組 -- 6", "source": "personal", "modified_by": "Admin", "modified_date": "2025-04-30" },
    { "name": "自訂群組 -- 7", "source": "personal", "modified_by": "Admin", "modified_date": "2026-01-08" },
    { "name": "自訂群組 -- 8", "source": "personal", "modified_by": "Admin", "modified_date": "2024-09-25" },
    { "name": "自訂群組 -- 9", "source": "personal", "modified_by": "Admin", "modified_date": "2025-12-12" },
    { "name": "自訂群組 -- 10", "source": "personal", "modified_by": "Admin", "modified_date": "2026-03-05" },
    { "name": "自訂群組 -- 11", "source": "personal", "modified_by": "Admin", "modified_date": "2024-05-18" },
    { "name": "自訂群組 -- 12", "source": "personal", "modified_by": "Admin", "modified_date": "2025-07-21" },
    { "name": "自訂群組 -- 13", "source": "personal", "modified_by": "Admin", "modified_date": "2024-12-08" },
    { "name": "自訂群組 -- 14", "source": "personal", "modified_by": "Admin", "modified_date": "2026-02-28" },
    { "name": "自訂群組 -- 15", "source": "personal", "modified_by": "Admin", "modified_date": "2025-03-14" },
    { "name": "自訂群組 -- 16", "source": "personal", "modified_by": "Admin", "modified_date": "2024-10-19" },
    { "name": "自訂群組 -- 17", "source": "personal", "modified_by": "Admin", "modified_date": "2025-09-02" },
    { "name": "自訂群組 -- 18", "source": "personal", "modified_by": "Admin", "modified_date": "2026-01-25" },
    { "name": "自訂群組 -- 19", "source": "personal", "modified_by": "Admin", "modified_date": "2024-08-07" },
    { "name": "自訂群組 -- 20", "source": "personal", "modified_by": "Admin", "modified_date": "2025-11-30" }
]

def run_seed():
    db = SessionLocal()
    try:
        # 1. 清空舊的 Group 資料 (透過 cascade 會一併清除關聯表紀錄，但不會刪除 Product 本身)
        print("正在清空舊的群組資料...")
        db.query(models.Group).delete()
        db.commit()

        # 2. 批次新增資料
        print(f"準備寫入 {len(GROUPS_DATA)} 筆群組資料...")
        for item in GROUPS_DATA:
            new_group = models.Group(
                name=item["name"],
                source=item["source"],
                modified_by=item["modified_by"],
                modified_date=item["modified_date"]
            )
            db.add(new_group)
        
        # 3. 儲存進資料庫
        db.commit()
        print(f"✅ 成功寫入 {len(GROUPS_DATA)} 筆群組資料！(Groups Seeded Successfully!)")

    except Exception as e:
        print(f"❌ 發生錯誤，資料已回滾: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()