# Download Dashboard System

基於 **Next.js** (Frontend) 與 **FastAPI** (Backend) 的全端儀表板系統。
採用 **Docker** 全容器化開發環境，無需在本機安裝語言環境。

## 🚀 技術棧 (Tech Stack)

### Infrastructure
- **Docker & Docker Compose**: 統一開發環境與部署
- **Nginx** (Production only): 靜態資源伺服 (未來規劃)

### Frontend (`/frontend`)
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Hooks / Zustand (Planned)

### Backend (`/backend`)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.9+
- **Database**: SQLite (Development)
- **Validation**: Pydantic

---

## 🛠 快速開始 (Quick Start)

### 1. 啟動開發環境
只需要一行指令即可啟動前端、後端與資料庫：

```bash
docker-compose up --build -d