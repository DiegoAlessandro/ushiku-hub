import { Store } from '@/types';
import { ExternalLink, MapPin, Instagram, Globe, Calendar } from 'lucide-react';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const categoryLabels: Record<string, string> = {
    food: '飲食',
    beauty: '美容',
    shop: '買い物',
    event: 'イベント',
    other: 'その他'
  };

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-50 text-orange-600 border-orange-100',
    beauty: 'bg-pink-50 text-pink-600 border-pink-100',
    shop: 'bg-blue-50 text-blue-600 border-blue-100',
    event: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    other: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
        {store.imageUrl ? (
          <img
            src={store.imageUrl}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Globe size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${categoryColors[store.category]}`}>
            {categoryLabels[store.category]}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs">
          <Calendar size={14} />
          <time dateTime={new Date(store.collectedAt).toISOString()}>
            {formatDate(store.collectedAt)}
          </time>
        </div>
        
        <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {store.name}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {store.content}
        </p>
        
        <div className="space-y-2.5 mb-6">
          {store.address && (
            <div className="flex items-start gap-2 text-slate-500 text-xs">
              <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{store.address}</span>
            </div>
          )}
          {store.instagramAccount && (
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Instagram size={14} className="shrink-0 text-slate-400" />
              <span>@{store.instagramAccount}</span>
            </div>
          )}
        </div>
        
        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {store.source}
            </span>
          </div>
          <a
            href={store.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link"
          >
            詳しく見る
            <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}
