Vercelへのデプロイを実行するスキルです。

## 手順

1. まず `npm run build` でビルドが通ることを確認する
2. ビルドが成功したら、以下のコマンドでデプロイを実行する:
   - **プレビューデプロイ:** `vercel -t $VERCEL_TOKEN --yes`
   - **本番デプロイ:** `vercel --prod -t $VERCEL_TOKEN --yes`
3. デプロイURLをユーザーに報告する

## 環境変数

VERCEL_TOKEN は `.env.local` に保存されている。コマンド実行時は以下のように読み込む:
```
export $(grep VERCEL_TOKEN .env.local | xargs) && vercel -t $VERCEL_TOKEN --yes
```

## 引数

- 引数なし → プレビューデプロイ
- `--prod` または `prod` → 本番デプロイ

ユーザーの引数: $ARGUMENTS
