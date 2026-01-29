# Download Dashboard System

基於 **Next.js** (Frontend) 與 **FastAPI** (Backend) 的全端儀表板系統。
採用 **Docker** 全容器化開發環境，無需在本機安裝複雜的語言環境即可執行。

## 🚀 技術棧 (Tech Stack)

### Infrastructure
- **Docker & Docker Compose**: 統一開發環境與部署
- **Nginx** (Production only): 靜態資源伺服 (未來規劃)

### Frontend (`/frontend`)
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend (`/backend`)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.9+
- **Database**: SQLite (Development) / PostgreSQL (Production Planned)
- **Validation**: Pydantic

---

## 🛠 快速開始 (Quick Start)

### 1. 準備開發環境 (VS Code 支援)
為了讓 VS Code 的 IntelliSense (自動補全) 與 ESLint 正常運作，建議先在本機安裝依賴（僅供編輯器讀取，實際運行仍在 Docker 內）。

```bash
# 前端依賴 (消除 VS Code 紅色波浪線)
cd frontend
npm install

# 後端依賴 (可選)
cd ../backend
pip install -r requirements.txt