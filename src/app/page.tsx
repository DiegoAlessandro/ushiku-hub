import { StoreCard } from '@/components/StoreCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { getStores } from '@/lib/db';
import { Store } from '@/types';
import { Search, Map as MapIcon, Utensils, Scissors, ShoppingBag, Zap, Info, GraduationCap, Megaphone, MessageSquarePlus, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined;

  let stores: Store[] = [];
  let error = '';

  try {
    stores = await getStores(category, 50, q, tag);
  } catch (e) {
    error = 'データの取得に失敗しました';
    console.error(e);
  }

  let allStores: Store[] = [];
  try {
    allStores = await getStores(undefined, 200);
  } catch (e) {
    console.error(e);
  }

  const categoryCounts = allStores.reduce((acc, store) => {
    acc[store.category] = (acc[store.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 主要な人気タグ (Task #41)
  const popularTags = ['駐車場あり', '駅近', 'ランチ', '朝食', '観光', '子連れ歓迎', 'クーポン'];

  // 緊急・重要ニュースのフィルタリング
  const urgentNews = allStores.filter(s => 
    s.name === '牛久市役所' && 
    (s.content.includes('重要') || s.content.includes('防災') || s.content.includes('募集'))
  ).slice(0, 1);

  const navItems = [
    { id: 'all', label: 'すべて', href: '/', icon: <Search size={18} /> },
    { id: 'food', label: '飲食', href: '/?category=food', icon: <Utensils size={18} /> },
    { id: 'beauty', label: '美容', href: '/?category=beauty', icon: <Scissors size={18} /> },
    { id: 'education', label: '習い事', href: '/?category=education', icon: <GraduationCap size={18} /> },
    { id: 'shop', label: '買い物', href: '/?category=shop', icon: <ShoppingBag size={18} /> },
    { id: 'event', label: 'イベント', href: '/?category=event', icon: <Zap size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Urgent News Banner */}
      {urgentNews.length > 0 && !category && !q && !tag && (
        <div className="bg-red-600 text-white py-2.5 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Megaphone size={18} className="shrink-0 animate-bounce" />
              <p className="text-sm font-black tracking-tight truncate">
                <span className="bg-white text-red-600 px-1.5 py-0.5 rounded text-[10px] mr-2">重要</span>
                {urgentNews[0].content.split('\n')[0]}
              </p>
            </div>
            <a 
              href={urgentNews[0].sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold underline whitespace-nowrap hover:opacity-80"
            >
              詳細を見る
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <MapIcon size={24} strokeWidth={2.5} />
              </div>
              <a href="/">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  牛久ナビ <span className="text-blue-600">USHIKU HUB</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Autonomous Local Intelligence
                </p>
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-grow max-w-md mx-auto md:mx-8">
              <form action="/" method="GET" className="relative group">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="お店やキーワードで検索..."
                  className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                {category && <input type="hidden" name="category" value={category} />}
                {tag && <input type="hidden" name="tag" value={tag} />}
              </form>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    (!category && item.id === 'all') || category === item.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  <span className="text-[10px] opacity-50 ml-1">
                    {item.id === 'all' ? allStores.length : categoryCounts[item.id] || 0}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile/Tablet Nav */}
          <nav className="flex xl:hidden items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-t border-slate-50 pt-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${
                  (!category && item.id === 'all') || category === item.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Popular Tags Nav (Task #41) */}
          <div className="flex items-center gap-3 py-3 overflow-x-auto no-scrollbar border-t border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0">
              <Tag size={12} /> Popular:
            </span>
            {popularTags.map((t) => (
              <a
                key={t}
                href={`/?tag=${encodeURIComponent(t)}${category ? `&category=${category}` : ''}`}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                  tag === t 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                #{t}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          <a href="/" className="hover:text-blue-600 transition-colors">HOME</a>
          {(category || q || tag) && (
            <>
              <span className="text-slate-300">/</span>
              <span className={!(q || tag) ? "text-slate-900" : "text-slate-400"}>
                {category ? navItems.find(n => n.id === category)?.label : '検索'}
              </span>
            </>
          )}
          {tag && (
            <>
              <span className="text-slate-300">/</span>
              <span className={!q ? "text-slate-900" : "text-slate-400"}>#{tag}</span>
            </>
          )}
          {q && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">「{q}」の検索結果</span>
            </>
          )}
        </nav>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {q ? `「${q}」の検索結果` : tag ? `#${tag}` : category ? navItems.find(n => n.id === category)?.label : '最新の街ネタ'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {q || tag ? `${stores.length}件見つかりました` : '牛久市のSNSや公式情報をAIがリアルタイムに集約しています'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-xs font-bold w-fit">
            <Info size={14} />
            毎時自動更新
          </div>
        </div>

        {/* Map View */}
        {!q && !tag && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <MapIcon size={14} />
              街のマップから探す
            </div>
            <InteractiveMap stores={stores} />
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <p className="text-red-600 font-bold">{error}</p>
            <p className="text-sm text-red-400 mt-2">データベース接続を確認してください</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-slate-900 font-black text-xl italic uppercase">
              {q || tag ? 'Result not found' : 'No data collected yet'}
            </p>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              {q || tag ? '別の条件で試してみてください。' : 'OpenClawエージェントが街の情報を収集しています。しばらくお待ちください。'}
            </p>
            {(q || tag) && (
              <a href="/" className="inline-block mt-6 text-sm font-bold text-blue-600 hover:underline">
                すべて表示に戻る
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <MapIcon size={18} />
              </div>
              <span className="font-black text-slate-900 tracking-tight">USHIKU HUB</span>
            </div>
            
            <div className="max-w-2xl mb-8">
              <p className="text-[10px] text-slate-400 leading-relaxed italic mb-6">
                【AI改善宣言】このサイトは住民の皆様の声を爆速で反映します。「ここを直して」「こんな機能がほしい」という要望をAIが24時間受け付け、最短数分で実装に反映します。
              </p>
              <a 
                href="https://forms.gle/your-feedback-form-id" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                <MessageSquarePlus size={18} />
                AIに爆速改善要望を出す
              </a>
            </div>

            <div className="max-w-2xl mb-8">
              <p className="text-[10px] text-slate-400 leading-relaxed text-justify md:text-center">
                【免責事項】当サイト「牛久ナビ」は、AIエージェントを用いてインターネット上の公開情報を自動収集・集約している試験的なポータルサイトです。情報の正確性、最新性、妥当性については細心の注意を払っておりますが、これらを保証するものではありません。掲載情報に基づいた判断や行動により生じた損害等について、当サイトは一切の責任を負いかねます。最新かつ正確な情報は、各店舗・団体の公式サイトやSNSを直接ご確認ください。
              </p>
            </div>

            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              © 2026 Powered by OpenClaw Agent
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 border-t border-slate-50 pt-8 w-full">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Instagram Scraping</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Public Web News</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">AI Categorization</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
