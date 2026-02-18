# 牛久ナビ UI/UX 根本リデザイン計画

## レビュー経緯
- Gemini MCP: ブレインストーミング（15案生成）→ UI/UXレビュー
- Codex MCP: アーキテクチャ・セキュリティ・パフォーマンスレビュー
- 両者の合意点を統合した最終計画

---

## Phase 0: 基盤整備（セキュリティ + 型 + 定数）

### 0-1. SQLインジェクション修正 [最優先・Codex指摘]
**ファイル:** `src/lib/db.ts`
- `getStores()` の文字列連結クエリをパラメータ化クエリに全面置換
- category/tag/searchを安全にバインド

### 0-2. 型定義の拡張
**ファイル:** `src/types/index.ts`
```typescript
export type ViewMode = 'list' | 'map';
export type ThemeMode = 'light' | 'dark' | 'system';
export type CategoryId = Store['category'];

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  iconName: string;
  color: { light: string; dark: string; };
}
```

### 0-3. 定数・ユーティリティ抽出
**新規:** `src/lib/constants.ts`
- CATEGORY_CONFIG（カテゴリ定義の一元管理）
- NAV_ITEMS、POPULAR_TAGS
- USHIKU_CENTER座標

**新規:** `src/lib/utils.ts`
- formatDate()、getBusinessStatus()（StoreCardから抽出）

### 0-4. 依存追加
```bash
npm install vaul framer-motion
```
- vaul: BottomSheet（Radix UIベース、a11y完備）
- framer-motion: AnimatePresence + LazyMotionのみ限定使用

---

## Phase 1: テーマシステム（ダークモード基盤）

### 1-1. CSS変数の大幅拡張
**ファイル:** `src/app/globals.css`
- :root にライトモード変数（surface, text, border, glass）
- [data-theme="dark"] にダークモード変数
- @theme inline でTailwind v4に橋渡し
- shimmerアニメーション定義
- prefers-color-schemeのメディアクエリは削除（data-theme方式に統一）

### 1-2. ThemeProvider
**新規:** `src/providers/ThemeProvider.tsx`（Client Component）
- React Context + localStorage('ushiku_theme')永続化
- html要素にdata-theme属性を注入
- system選択時はprefers-color-schemeを監視

### 1-3. useTheme フック
**新規:** `src/hooks/useTheme.ts`
- { theme, setTheme, resolvedTheme, isDark } を返却

### 1-4. layout.tsx修正
**ファイル:** `src/app/layout.tsx`
- suppressHydrationWarning追加
- ThemeProvider + LazyMotion(domAnimation) でwrap
- SSRフラッシュ防止インラインスクリプト注入

---

## Phase 2: レイアウト分割 + Glassmorphismナビ

### 2-1. Header（デスクトップ + モバイル統合）
**新規:** `src/components/layout/Header.tsx`（Client Component）
- backdrop-blur-xl + CSS変数(--glass-bg)でGlassmorphism
- レスポンシブ分岐（md:以上はフルナビ、以下はコンパクト）
- ロゴ、検索バー、ThemeToggle
- sticky top-0, z-50
- 検索バーはスクロール時にstickyで常時表示（Morphingは後回し）

### 2-2. BottomNav
**新規:** `src/components/layout/BottomNav.tsx`（Client Component）
- Glassmorphism（backdrop-blur）
- 5カテゴリ + お気に入り
- セーフエリア対応: pb-[env(safe-area-inset-bottom)]
- アクティブ状態のカテゴリカラー表示

### 2-3. Footer
**新規:** `src/components/layout/Footer.tsx`（Server Component）
- page.tsxのフッター部分をそのまま分離

### 2-4. ThemeToggle
**新規:** `src/components/ui/ThemeToggle.tsx`（Client Component）
- Sun/Moonアイコン切替（CSS transition）

---

## Phase 3: Smart Filter Pills + コンテンツ整理

### 3-1. FilterPills
**新規:** `src/components/sections/FilterPills.tsx`（Client Component）
- 横スクロールチップ: 営業中、駐車場あり、駅近、クーポン、子連れ歓迎、NEW OPEN
- URL searchParams管理（サーバーサイドフィルタ維持）
- 複数選択可
- scroll-snap-type: x mandatory
- ダークモード時のカテゴリカラー対応

### 3-2. StoreGrid
**新規:** `src/components/sections/StoreGrid.tsx`（Client Component）
- グリッドレイアウト管理
- framer-motionのAnimatePresenceでフィルタ切替アニメーション
- Suspense + スケルトンローディング対応

### 3-3. UrgentNewsBanner / Breadcrumbs 分離
**新規:** `src/components/sections/UrgentNewsBanner.tsx`（Server Component）
**新規:** `src/components/sections/Breadcrumbs.tsx`（Server Component）
- page.tsxから分離、ダークモード対応

---

## Phase 4: BottomSheet（vaul採用）+ 状態リフトアップ [Codex・Gemini共通推奨]

### 4-1. StoreDetailSheet
**新規:** `src/components/store/StoreDetailSheet.tsx`（Client Component）
- vaulのDrawerコンポーネントを使用
- スナップポイント: [0.4, 0.75, 1]（peek/half/full）
- 店舗詳細、Instagram埋め込み、Google Map経路リンク
- デスクトップでは右サイドパネル的に表示
- a11y: role="dialog", aria-modal, フォーカストラップ, Escape閉じ

### 4-2. 状態リフトアップ [Gemini指摘・重要]
- StoreCard内のuseState + StoreModalを削除
- page.tsx（またはClient wrapper）にselectedStoreId状態を1つだけ持つ
- StoreDetailSheetはツリー最上位に1つだけ配置
- StoreCardはクリック時にIDをセットするだけ
→ DOM数の劇的削減、パフォーマンス改善

### 4-3. StoreCard修正
**ファイル:** `src/components/StoreCard.tsx` → `src/components/store/StoreCard.tsx`
- StoreModal依存を削除
- onClick → selectedStoreIdのセッター呼び出し
- ダークモード対応（CSS変数ベース）
- div onClick → button要素に変更（a11y）

### 4-4. StoreCardSkeleton
**新規:** `src/components/store/StoreCardSkeleton.tsx`
- shimmerアニメーション（CSS only）
- StoreCardと同じレイアウト

---

## Phase 5: Map-List Toggle

### 5-1. useViewMode フック
**新規:** `src/hooks/useViewMode.ts`
- 'list' | 'map' の切り替え
- localStorage永続化

### 5-2. MapListToggle FAB
**新規:** `src/components/map/MapListToggle.tsx`（Client Component）
- フローティングボタン（画面右下、BottomNavの上）
- 現在モードの反対アイコン表示
- framer-motion AnimatePresenceで切替アニメーション

### 5-3. InteractiveMap修正
**ファイル:** `src/components/InteractiveMap.tsx` → `src/components/map/InteractiveMap.tsx`
- require()をnext/dynamic(ssr: false)に置換
- ダークモード: CartoDB Dark Matterタイルに切替
- マーカークリック → BottomSheet連携

---

## Phase 6: page.tsx最終統合

### 6-1. page.tsx大幅簡素化
**ファイル:** `src/app/page.tsx`
- Server Componentとして維持（SSRの利点保持）
- データ取得ロジックのみ残す
- UIは全て子コンポーネントに委譲
- カテゴリカウント用の集計クエリをdb.tsに追加

### 6-2. HomeClient wrapper
**新規:** `src/components/HomeClient.tsx`（Client Component）
- selectedStoreId状態管理
- ViewMode状態管理
- Vaul Drawer.Root配置
- 各Client Componentの統合

### 最終コンポーネントツリー
```
RootLayout (Server)
└── ThemeProvider (Client)
    └── LazyMotion
        └── Home Page (Server) — データ取得のみ
            └── HomeClient (Client) — 状態管理
                ├── UrgentNewsBanner (Server)
                ├── Header (Client) — Glassmorphism, 検索, ThemeToggle
                ├── main
                │   ├── Breadcrumbs (Server)
                │   ├── FilterPills (Client)
                │   ├── MapListToggle FAB (Client)
                │   ├── InteractiveMap (Client, dynamic) — 条件表示
                │   └── StoreGrid (Client) — AnimatePresence
                │       ├── StoreCardSkeleton (Client)
                │       └── StoreCard (Client) — クリックでID通知
                ├── BottomNav (Client)
                ├── Footer (Server)
                └── StoreDetailSheet (Client, vaul) — 1つだけ
```

---

## 新規ファイル一覧（作成順）

| # | ファイル | 種別 | Phase |
|---|---------|------|-------|
| 1 | `src/lib/constants.ts` | 新規 | 0 |
| 2 | `src/lib/utils.ts` | 新規 | 0 |
| 3 | `src/types/index.ts` | 修正 | 0 |
| 4 | `src/lib/db.ts` | 修正 | 0 |
| 5 | `src/app/globals.css` | 修正 | 1 |
| 6 | `src/providers/ThemeProvider.tsx` | 新規 | 1 |
| 7 | `src/hooks/useTheme.ts` | 新規 | 1 |
| 8 | `src/app/layout.tsx` | 修正 | 1 |
| 9 | `src/components/ui/ThemeToggle.tsx` | 新規 | 2 |
| 10 | `src/components/layout/Header.tsx` | 新規 | 2 |
| 11 | `src/components/layout/BottomNav.tsx` | 新規 | 2 |
| 12 | `src/components/layout/Footer.tsx` | 新規 | 2 |
| 13 | `src/components/sections/FilterPills.tsx` | 新規 | 3 |
| 14 | `src/components/sections/StoreGrid.tsx` | 新規 | 3 |
| 15 | `src/components/sections/UrgentNewsBanner.tsx` | 新規 | 3 |
| 16 | `src/components/sections/Breadcrumbs.tsx` | 新規 | 3 |
| 17 | `src/components/store/StoreDetailSheet.tsx` | 新規 | 4 |
| 18 | `src/components/store/StoreCard.tsx` | 修正(移動) | 4 |
| 19 | `src/components/store/StoreCardSkeleton.tsx` | 新規 | 4 |
| 20 | `src/hooks/useViewMode.ts` | 新規 | 5 |
| 21 | `src/components/map/MapListToggle.tsx` | 新規 | 5 |
| 22 | `src/components/map/InteractiveMap.tsx` | 修正(移動) | 5 |
| 23 | `src/components/HomeClient.tsx` | 新規 | 6 |
| 24 | `src/app/page.tsx` | 修正 | 6 |

## 既存ファイルの削除
- `src/components/StoreModal.tsx` → StoreDetailSheet.tsx に完全置換

---

## 後回し（Phase 7以降・別タスクとして管理）
- Morphing Search Bar（layoutId）→ まずstickyで十分
- Time-Context Hero → 挨拶テキスト程度に縮小
- Horizontal Scroll Sections（Netflix風シェルフ）
- ネオン発光エフェクト（ダークモードの装飾的要素）
- 複雑なStaggeredアニメーション
- Pull to Refresh
- Playwrightテスト
- Web Vitals監視（LCP/INP）