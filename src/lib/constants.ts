import type { CategoryConfig, NavItem } from '@/types';

// カテゴリ設定の一元管理
export const CATEGORY_CONFIG: CategoryConfig[] = [
  { id: 'food', label: '飲食', iconName: 'Utensils', color: { light: 'bg-orange-100 text-orange-700 border-orange-200', dark: 'bg-orange-900/30 text-orange-300 border-orange-700' } },
  { id: 'beauty', label: '美容', iconName: 'Scissors', color: { light: 'bg-pink-100 text-pink-700 border-pink-200', dark: 'bg-pink-900/30 text-pink-300 border-pink-700' } },
  { id: 'shop', label: '買い物', iconName: 'ShoppingBag', color: { light: 'bg-blue-100 text-blue-700 border-blue-200', dark: 'bg-blue-900/30 text-blue-300 border-blue-700' } },
  { id: 'event', label: 'イベント', iconName: 'Zap', color: { light: 'bg-emerald-100 text-emerald-700 border-emerald-200', dark: 'bg-emerald-900/30 text-emerald-300 border-emerald-700' } },
  { id: 'education', label: '習い事', iconName: 'GraduationCap', color: { light: 'bg-purple-100 text-purple-700 border-purple-200', dark: 'bg-purple-900/30 text-purple-300 border-purple-700' } },
  { id: 'jobs', label: '求人', iconName: 'Briefcase', color: { light: 'bg-indigo-100 text-indigo-700 border-indigo-200', dark: 'bg-indigo-900/30 text-indigo-300 border-indigo-700' } },
  { id: 'other', label: 'その他', iconName: 'Info', color: { light: 'bg-slate-100 text-slate-700 border-slate-200', dark: 'bg-slate-800 text-slate-300 border-slate-600' } },
];

// ナビゲーション項目
export const NAV_ITEMS: NavItem[] = [
  { id: 'all', label: 'すべて', href: '/', iconName: 'Search' },
  { id: 'food', label: '飲食', href: '/?category=food', iconName: 'Utensils' },
  { id: 'beauty', label: '美容', href: '/?category=beauty', iconName: 'Scissors' },
  { id: 'education', label: '習い事', href: '/?category=education', iconName: 'GraduationCap' },
  { id: 'jobs', label: '求人', href: '/?category=jobs', iconName: 'Briefcase' },
  { id: 'shop', label: '買い物', href: '/?category=shop', iconName: 'ShoppingBag' },
  { id: 'event', label: 'イベント', href: '/?category=event', iconName: 'Zap' },
];

// 人気タグ
export const POPULAR_TAGS = [
  '牛久駅エリア', 'ひたち野うしく駅エリア', '駐車場あり', '駅近',
  'ランチ', '朝食', '観光', '子連れ歓迎', 'クーポン', 'アルバイト募集',
] as const;

// 牛久市の中心座標
export const USHIKU_CENTER: [number, number] = [35.98, 140.15];

// カテゴリIDからConfigを取得
export function getCategoryConfig(categoryId: string): CategoryConfig | undefined {
  return CATEGORY_CONFIG.find((c) => c.id === categoryId);
}

// カテゴリIDからラベルを取得
export function getCategoryLabel(categoryId: string): string {
  return getCategoryConfig(categoryId)?.label ?? 'その他';
}