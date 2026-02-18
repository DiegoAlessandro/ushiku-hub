// 店舗情報の型定義
export interface Store {
  id: string;
  name: string;
  category: 'food' | 'beauty' | 'shop' | 'event' | 'education' | 'jobs' | 'other';
  source: 'instagram' | 'twitter' | 'web' | 'WEEKEND-GUIDE' | 'AI-Curated';
  sourceUrl: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string; // AI生成された画像説明 (Task #23)
  postedAt: Date;
  collectedAt: Date;
  address?: string;
  phone?: string;
  instagramAccount?: string;
  businessHours?: string;
  regularHoliday?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  isPublished: boolean;
}

// UI状態の型定義
export type ViewMode = 'list' | 'map';
export type ThemeMode = 'light' | 'dark' | 'system';
export type CategoryId = Store['category'];

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  iconName: string;
  color: {
    light: string;
    dark: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
}

// 収集データの型
export interface CollectedData {
  source: 'instagram' | 'twitter' | 'web';
  category: 'food' | 'beauty' | 'shop' | 'event' | 'education' | 'jobs' | 'other';
  name: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  sourceUrl: string;
  postedAt: string;
  address?: string;
  phone?: string;
  instagramAccount?: string;
  businessHours?: string;
  regularHoliday?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}
