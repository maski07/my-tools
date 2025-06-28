# API Test Scripts

このディレクトリには、各APIエンドポイントをテストするためのcurlコマンドが含まれています。

## 使用方法

### ローカル環境でのテスト
```bash
# Jobs API
./curl-test/jobs/local/local-check-authority.sh

# Mix B API
./curl-test/mix-b/local/local-check.sh

# OpenAI API
./curl-test/openai/local/local-chat.sh
```

### 本番環境でのテスト
```bash
# Jobs API
./curl-test/jobs/prod/prd-check-authority.sh

# Mix B API
./curl-test/mix-b/prod/prd-check.sh

# OpenAI API
./curl-test/openai/prod/prd-chat.sh
```

## テストケース

### Jobs API テストケース
- **基本テスト**: `local-check-authority.sh` / `prd-check-authority.sh`
- **完全一致**: `local-check-authority-exact.sh` / `prd-check-authority-exact.sh`
- **部分一致**: `local-check-authority-partial.sh` / `prd-check-authority-partial.sh`
- **バリデーションエラー**: `local-check-authority-validation.sh` / `prd-check-authority-validation.sh`

## 注意事項

- すべてのスクリプトには実行権限が付与されています
- 本番環境のテストは実際のAPIにリクエストを送信します
- 必要に応じてリクエストボディを編集してください 