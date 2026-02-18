import { Store } from '@/types';
import { ExternalLink, MapPin, Instagram, Globe, Calendar, GraduationCap, AlertCircle, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const categoryLabels: Record<string, string> = {
    food: '飲食',
    beauty: '美容',
    shop: '買い物',
    event: 'イベント',
    education: '習い事',
    other: 'その他'
  };

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-100 text-orange-700 border-orange-200',
    beauty: 'bg-pink-100 text-pink-700 border-pink-200',
    shop: 'bg-blue-100 text-blue-700 border-blue-200',
    event: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    education: 'bg-purple-100 text-purple-700 border-purple-200',
    other: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 営業中かどうかの簡易判定
  const getBusinessStatus = () => {
    if (!store.businessHours) return null;

    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [start, end] = store.businessHours.split('-');
      if (!start || !end) return null;

      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      
      const startTime = startH * 60 + startM;
      let endTime = endH * 60 + endM;

      if (endTime < startTime) {
        endTime += 24 * 60;
        if (currentTime < startTime) {
          const adjustedCurrent = currentTime + 24 * 60;
          return adjustedCurrent >= startTime && adjustedCurrent <= endTime;
        }
      }

      return currentTime >= startTime && currentTime <= endTime;
    } catch (e) {
      return null;
    }
  };

  const isOpen = getBusinessStatus();
  const reportUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfYourFormId/viewform?entry.123456=${encodeURIComponent(store.name)}`;

  // 開店・閉店バッジ (Task #20)
  const isNewOpen = store.tags?.includes('開店') || store.tags?.includes('オープン');
  const isClosing = store.tags?.includes('閉店');

  // SNSシェアURLの生成 (Task #34)
  const shareText = encodeURIComponent(`【牛久ナビ】${store.name} の最新情報をチェック！\n#牛久市 #牛久ナビ #街ネタ\n`);
  const shareUrl = encodeURIComponent(`https://ushiku-hub.jp/?q=${store.name}`);
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Section */}
      <a 
        href={store.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-[16/10] relative overflow-hidden bg-slate-100 block"
      >
        {store.imageUrl ? (
          <Image
            src={store.imageUrl}
            alt={store.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            {store.category === 'education' ? <GraduationCap size={48} strokeWidth={1.5} /> : <Globe size={48} strokeWidth={1.5} />}
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-sm ${categoryColors[store.category]}`}>
            {categoryLabels[store.category]}
          </span>
          {isOpen !== null && (
            <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md border shadow-sm ${isOpen ? 'bg-green-500 text-white border-green-600' : 'bg-slate-500 text-white border-slate-600'}`}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          )}
          {isNewOpen && (
            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md bg-yellow-400 text-black border border-yellow-500 shadow-sm animate-pulse">
              NEW OPEN
            </span>
          )}
          {isClosing && (
            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md bg-red-500 text-white border border-red-600 shadow-sm">
              閉店情報
            </span>
          )}
        </div>
      </a>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Calendar size={14} />
            <time dateTime={new Date(store.collectedAt || new Date()).toISOString()}>
              {formatDate(store.collectedAt || new Date())}
            </time>
          </div>
          <div className="flex items-center gap-3">
            {/* Share Tooltip simulation */}
            <div className="flex items-center gap-2 border-r border-slate-100 pr-3 mr-1">
              <a href={lineShareUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-green-500 transition-colors" title="LINEで送る">
                <Globe size={14} />
              </a>
              <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-900 transition-colors" title="Xでシェア">
                <Share2 size={14} />
              </a>
            </div>
            <a 
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="情報の誤りを報告"
            >
              <AlertCircle size={14} />
            </a>
          </div>
        </div>
        
        <a 
          href={store.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group/title"
        >
          <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover/title:text-blue-600 transition-colors line-clamp-1">
            {store.name}
          </h3>
        </a>
        
        <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow font-medium">
          {store.content}
        </p>
        
        <div className="space-y-2.5 mb-6">
          {store.businessHours && (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
              <Clock size={14} className="text-blue-500" />
              <span>営業時間: {store.businessHours}</span>
              {store.regularHoliday && <span className="text-slate-400 text-[10px]">（定休日: {store.regularHoliday}）</span>}
            </div>
          )}
          {store.address && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-slate-600 text-xs hover:text-blue-600 transition-colors group/map"
            >
              <MapPin size={14} className="mt-0.5 shrink-0 text-slate-500 group-hover/map:text-blue-600" />
              <span className="line-clamp-1 underline underline-offset-4 decoration-slate-300 group-hover/map:decoration-blue-600 font-medium">{store.address}</span>
            </a>
          )}
          {store.instagramAccount && (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
              <Instagram size={14} className="shrink-0 text-slate-500" />
              <span>@{store.instagramAccount}</span>
            </div>
          )}
        </div>
        
        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {store.source}
            </span>
          </div>
          <a
            href={store.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
          >
            詳しく見る
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
