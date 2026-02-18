// 店舗情報の型定義
export interface Store {
  id: string;
  name: string;
  category: 'food' | 'beauty' | 'shop' | 'event' | 'other';
  source: 'instagram' | 'twitter' | 'web';
  sourceUrl: string;
  content: string;
  imageUrl?: string;
  postedAt: Date;
  collectedAt: Date;
  address?: string;
  phone?: string;
  instagramAccount?: string;
  isPublished: boolean;
}

// 収集データの型
export interface CollectedData {
  source: 'instagram' | 'twitter' | 'web';
  category: 'food' | 'beauty' | 'shop' | 'event' | 'other';
  name: string;
  content: string;
  imageUrl?: string;
  sourceUrl: string;
  postedAt: string;
  address?: string;
  phone?: string;
  instagramAccount?: string;
}
