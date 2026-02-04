from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. 指定資料庫位置：在 Docker 容器裡的 /app/sql_app.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# 2. 建立引擎 (Engine)：這是真正負責溝通的核心
# connect_args={"check_same_thread": False} 是 SQLite 特有的設定，讓它允許多個請求同時連線
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. 建立 Session：每次 API 請求進來，都會透過 Session 跟資料庫講話
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base：這是一個基礎類別，等一下我們的 Model 都要繼承它
Base = declarative_base()

# 5. 工具函式：給 API 用的，確保每次請求都有拿到資料庫連線，用完會自動關閉
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()