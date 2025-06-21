# Node公式イメージ
FROM node:20-slim

# アプリコードをコンテナ内にコピー
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピーしてキャッシュを活用
COPY package*.json ./
RUN npm ci --only=production

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# Cloud Run が使うポート
ENV PORT=8080
EXPOSE 8080

# アプリ実行
CMD ["npm", "start"]
