// 店舗情報の型定義
export interface Store {
  id: string;
  name: string;
  category: 'food' | 'beauty' | 'shop' | 'event' | 'education' | 'other';
  source: 'instagram' | 'twitter' | 'web';
  sourceUrl: string;
  content: string;
  imageUrl?: string;
  postedAt: Date;
  collectedAt: Date;
  address?: string;
  phone?: string;
  instagramAccount?: string;
  businessHours?: string; // 例: "11:00-21:00"
  regularHoliday?: string; // 例: "月曜日"
  latitude?: number;
  longitude?: number;
  isPublished: boolean;
}

// 収集データの型
export interface CollectedData {
  source: 'instagram' | 'twitter' | 'web';
  category: 'food' | 'beauty' | 'shop' | 'event' | 'education' | 'other';
  name: string;
  content: string;
  imageUrl?: string;
  sourceUrl: string;
  postedAt: string;
  address?: string;
  phone?: string;
  instagramAccount?: string;
  businessHours?: string;
  regularHoliday?: string;
  latitude?: number;
  longitude?: number;
}
