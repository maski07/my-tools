# Node公式イメージ
FROM node:20

# アプリコードをコンテナ内にコピー
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Cloud Run が使うポート
ENV PORT=8080

# アプリ実行
CMD ["npm", "start"]
