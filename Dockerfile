# 使用官方 Node.js 18 作為基礎映像
FROM node:18-alpine AS base

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./


# 安裝依賴
RUN npm install

# 複製所有檔案
COPY . .

# 構建應用程式
RUN npm run build

# 暴露 3000 端口
EXPOSE 3000

# 啟動應用程式
CMD ["npm", "run", "start"]
