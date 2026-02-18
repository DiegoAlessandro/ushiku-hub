import { StoreCard } from '@/components/StoreCard';
import { getStores } from '@/lib/db';
import { Store } from '@/types';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  let stores: Store[] = [];
  let error = '';

  try {
    stores = await getStores(category, 50);
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error(e);
  }

  // 全体のカウント用
  let allStores: Store[] = [];
  try {
    allStores = await getStores(undefined, 100);
  } catch (e) {
    console.error(e);
  }

  const categoryCounts = allStores.reduce((acc, store) => {
    acc[store.category] = (acc[store.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                牛久ナビ 🐄
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                牛久市のお店情報を自動収集中
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>掲載店舗数</p>
              <p className="text-2xl font-bold text-blue-600">{allStores.length}</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <a
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                !category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              すべて
            </a>
            <a
              href="/?category=food"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                category === 'food' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              飲食 ({categoryCounts['food'] || 0})
            </a>
            <a
              href="/?category=beauty"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                category === 'beauty' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              美容 ({categoryCounts['beauty'] || 0})
            </a>
            <a
              href="/?category=shop"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                category === 'shop' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              ショップ ({categoryCounts['shop'] || 0})
            </a>
            <a
              href="/?category=event"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                category === 'event' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              イベント ({categoryCounts['event'] || 0})
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              データベースの接続を確認してください
            </p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {category ? 'このカテゴリーにはまだデータがありません' : 'まだデータが収集されていません'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              OpenClawエージェントがデータを収集するまでお待ちください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 牛久ナビ - 牛久市のお店情報自動収集サービス
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            Instagram #牛久グルメ #牛久市 などから自動収集中
          </p>
        </div>
      </footer>
    </main>
  );
}
