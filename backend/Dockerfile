# 建立 backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 這裡不 COPY 程式碼，因為我們會用 Volume 掛載，方便開發
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]