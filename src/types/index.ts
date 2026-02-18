// 店舗情報の型定義
export interface Store {
  id: string;
  name: string;
  category: 'food' | 'beauty' | 'shop' | 'event' | 'education' | 'jobs' | 'other';
  source: 'instagram' | 'twitter' | 'web';
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
