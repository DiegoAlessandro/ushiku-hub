# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

牛久ナビ (ushiku-hub.jp) — 牛久市の飲食店・美容室・イベント情報をSNSから自動収集し、AIが編集・公開する地域ポータルサイト (PWA)。

**Stack:** Next.js 16 + React 19 + TypeScript (strict) + Tailwind CSS v4 + Neon PostgreSQL + OpenAI API

## Commands

```bash
npm run dev       # 開発サーバー (localhost:3000)
npm run build     # 本番ビルド
npm run start     # 本番サーバー起動
npm run lint      # ESLint (eslint-config-next/core-web-vitals + typescript)
```

テストフレームワークは未導入。

## Architecture

### Data Flow
```
scripts/ (AI収集・編集スクリプト)
  → OpenAI Vision API (GPT-4o-mini)
  → Neon PostgreSQL (stores テーブル)
  → Next.js Server Components (SSR)
  → Client Components (インタラクション)
```

### Key Directories
- `src/app/` — App Router ページ・APIルート
- `src/app/api/collect/` — 自動データ収集エンドポイント (Bearer token認証: CRON_SECRET)
- `src/app/api/post-news/` — ユーザー投稿API (公開)
- `src/components/` — React コンポーネント (StoreCard, StoreModal, InteractiveMap, InstagramEmbed, FavoriteButton)
- `src/lib/db.ts` — Neon PostgreSQL 接続・クエリ関数 (`neon()` tagged templates)
- `src/types/index.ts` — Store, CollectedData 型定義
- `scripts/` — 31個のAIデータ収集・編集用Node.jsスクリプト (tsconfig.jsonでexclude済み)
- `sql/` — DB初期化・マイグレーションSQL

### Database Schema
メインテーブルは `stores` (UUID PK)。`source_url` にUNIQUE制約があり、UPSERT (`ON CONFLICT`) でデータ更新。カテゴリは `'food' | 'beauty' | 'shop' | 'event' | 'education' | 'jobs' | 'other'`。

### Environment Variables
```
DATABASE_URL       # Neon PostgreSQL 接続文字列
OPENAI_API_KEY     # OpenAI API (GPT-4o-mini Vision)
CRON_SECRET        # /api/collect 認証用
```

## Conventions

- **言語:** コード内コメント・コミットメッセージは日本語OK
- **型安全:** すべての実装でTypeScript strict mode。`any` は極力避ける
- **コミット形式:** `feat: 説明 (Growth Task #XX)` / `fix:` / `design:` / `perf:`
- **コンポーネント:** Server Components がデフォルト、Client は `'use client'` 明示。PascalCase ファイル名
- **スタイル:** Tailwind CSS ユーティリティクラスのみ (CSS-in-JS 不使用)
- **パスエイリアス:** `@/*` → `./src/*`
- **地図:** Leaflet + react-leaflet (動的インポートでバンドル分割)
- **お気に入り:** localStorage (`ushiku_favorites`)
- **PWA:** next-pwa で対応 (開発時はdisable)

## Growth Roadmap

`docs/growth-100.md` に100タスクのロードマップあり。コミット時はタスク番号を参照 (`Growth Task #XX`)。
