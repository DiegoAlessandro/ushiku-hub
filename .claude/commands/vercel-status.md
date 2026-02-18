Vercelプロジェクトの状態を確認するスキルです。

## 手順

以下の情報をユーザーに報告してください:

1. `export $(grep VERCEL_TOKEN .env.local | xargs) && vercel ls -t $VERCEL_TOKEN --yes` で最近のデプロイ一覧を取得
2. 結果を簡潔にまとめて報告する（デプロイURL、状態、日時）

ユーザーの引数: $ARGUMENTS
