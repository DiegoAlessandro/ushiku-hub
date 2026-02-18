Vercelの環境変数を管理するスキルです。

## 環境変数の読み込み

コマンド実行前に必ずトークンを読み込む:
```
export $(grep VERCEL_TOKEN .env.local | xargs)
```

## 手順

ユーザーの引数に応じて以下を実行:

- `list` → `vercel env ls -t $VERCEL_TOKEN --yes` で環境変数一覧を表示
- `add <NAME> <VALUE>` → `echo "<VALUE>" | vercel env add <NAME> production -t $VERCEL_TOKEN --yes` で追加
- `rm <NAME>` → 実行前にユーザーに確認してから `vercel env rm <NAME> production -t $VERCEL_TOKEN --yes` で削除

ユーザーの引数: $ARGUMENTS
