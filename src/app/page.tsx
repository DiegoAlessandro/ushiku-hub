import { getStores } from '@/lib/db';
import { HomeClient } from '@/components/HomeClient';
import type { Store } from '@/types';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined;

  let stores: Store[] = [];
  try {
    stores = await getStores(category, 50, q, tag);
  } catch (e) {
    console.error('データ取得エラー:', e);
  }

  // 緊急ニュースフィルタリング
  let urgentNews: Store[] = [];
  if (!category && !q && !tag) {
    try {
      const allStores = await getStores(undefined, 200);
      urgentNews = allStores.filter(
        (s) =>
          s.name === '牛久市役所' &&
          (s.content.includes('重要') || s.content.includes('防災') || s.content.includes('募集'))
      ).slice(0, 1);
    } catch (e) {
      console.error('緊急ニュース取得エラー:', e);
    }
  }

  // コンテンツ優先順位付け
  const sortedStores = [...stores].sort((a, b) => {
    if (a.source === 'WEEKEND-GUIDE' && b.source !== 'WEEKEND-GUIDE') return -1;
    if (a.source !== 'WEEKEND-GUIDE' && b.source === 'WEEKEND-GUIDE') return 1;
    if (a.source === 'AI-Curated' && b.source !== 'AI-Curated') return -1;
    if (a.source !== 'AI-Curated' && b.source === 'AI-Curated') return 1;
    return 0;
  });

  return (
    <HomeClient
      stores={sortedStores}
      urgentNews={urgentNews}
      category={category}
      searchQuery={q}
      tag={tag}
    />
  );
}
