# ビルドステージ
FROM node:20-slim AS builder

WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピーしてキャッシュを活用
COPY package*.json ./

# すべての依存関係（devDependencies含む）をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# 本番ステージ
FROM node:20-slim AS production

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 本番環境用の依存関係のみをインストール
RUN npm ci --only=production && npm cache clean --force

# ビルドされたファイルをビルドステージからコピー
COPY --from=builder /app/dist ./dist

# filesディレクトリをコピー
COPY files ./files

# Cloud Run が使うポート
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# アプリ実行（本番環境用のstart:prodスクリプトを使用）
CMD ["npm", "run", "start:prod"]
