import { StoreCard } from '@/components/StoreCard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { getStores } from '@/lib/db';
import { Store } from '@/types';
import { Search, Map as MapIcon, Utensils, Scissors, ShoppingBag, Zap, Info, GraduationCap, Megaphone, MessageSquarePlus, Tag, Heart, Briefcase, PlusCircle } from 'lucide-react';

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

  const popularTags = ['牛久駅エリア', 'ひたち野うしく駅エリア', '駐車場あり', '駅近', 'ランチ', '朝食', '観光', '子連れ歓迎', 'クーポン', 'アルバイト募集'];

  const urgentNews = allStores.filter(s => 
    s.name === '牛久市役所' && 
    (s.content.includes('重要') || s.content.includes('防災') || s.content.includes('募集'))
  ).slice(0, 1);

  const sortedStores = [...stores].sort((a, b) => {
    if (a.source === 'AI-Curated' && b.source !== 'AI-Curated') return -1;
    if (a.source !== 'AI-Curated' && b.source === 'AI-Curated') return 1;
    return 0;
  });

  const navItems = [
    { id: 'all', label: 'すべて', href: '/', icon: <Search size={18} /> },
    { id: 'food', label: '飲食', href: '/?category=food', icon: <Utensils size={18} /> },
    { id: 'beauty', label: '美容', href: '/?category=beauty', icon: <Scissors size={18} /> },
    { id: 'education', label: '習い事', href: '/?category=education', icon: <GraduationCap size={18} /> },
    { id: 'jobs', label: '求人', href: '/?category=jobs', icon: <Briefcase size={18} /> },
    { id: 'shop', label: '買い物', href: '/?category=shop', icon: <ShoppingBag size={18} /> },
    { id: 'event', label: 'イベント', href: '/?category=event', icon: <Zap size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-24 md:pb-0 font-sans">
      {/* Urgent News Banner */}
      {urgentNews.length > 0 && !category && !q && !tag && (
        <div className="bg-red-600 text-white py-2.5 px-4 overflow-hidden relative z-[60]">
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
              詳細
            </a>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <MapIcon size={24} strokeWidth={2.5} />
              </div>
              <a href="/">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  牛久ナビ<br/><span className="text-blue-600 text-[10px] tracking-[0.2em] font-bold">USHIKU HUB</span>
                </h1>
              </a>
            </div>

            <div className="flex-grow max-w-md mx-8">
              <form action="/" method="GET" className="relative group">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="お店やキーワードで検索..."
                  className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              </form>
            </div>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar max-w-[400px]">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      (!category && item.id === 'all') || category === item.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <MapIcon size={18} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg tracking-tight">牛久ナビ</span>
        </div>
        <form action="/" method="GET" className="flex-1 ml-4 relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="検索..."
            className="w-full bg-slate-100 border-none rounded-xl py-2 pl-9 pr-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        </form>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Popular Tags */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {popularTags.map((t) => (
            <a
              key={t}
              href={`/?tag=${encodeURIComponent(t)}${category ? `&category=${category}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                tag === t 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 shadow-sm'
              }`}
            >
              #{t}
            </a>
          ))}
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {q ? `「${q}」` : tag ? `#${tag}` : category ? navItems.find(n => n.id === category)?.label : '最新の街ネタ'}
              {stores.length > 0 && <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg ml-2">{stores.length}</span>}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
              牛久市のSNSや公式情報をAIが24時間集約中
            </p>
          </div>
          {/* Post Button (Task #35) */}
          <a 
            href="https://forms.gle/your-user-post-form-id" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <PlusCircle size={16} />
            街のネタを投稿
          </a>
        </div>

        {/* Map View */}
        {!q && !tag && (
          <div className="mb-10">
            <InteractiveMap stores={stores} />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 z-[100] flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              (!category && item.id === 'all') || category === item.id
                ? 'text-blue-600 scale-110'
                : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${
              (!category && item.id === 'all') || category === item.id
                ? 'bg-blue-50'
                : ''
            }`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter">{item.label}</span>
          </a>
        ))}
        <button className="flex flex-col items-center gap-1 text-slate-400 opacity-30 cursor-not-allowed">
           <div className="p-2"><Heart size={18} /></div>
           <span className="text-[9px] font-black tracking-tighter">保存済み</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-2xl mb-12 flex flex-col gap-4">
              <a 
                href="https://forms.gle/your-feedback-form-id" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95 w-full sm:w-auto"
              >
                <MessageSquarePlus size={20} />
                爆速でAIに改善要望を送る
              </a>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                【AI改善宣言】このサイトは住民の声を最短数分で実装に反映します。
              </p>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              © 2026 USHIKU HUB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
