import { Megaphone } from 'lucide-react';
import type { Store } from '@/types';

interface UrgentNewsBannerProps {
  news: Store[];
}

export function UrgentNewsBanner({ news }: UrgentNewsBannerProps) {
  if (news.length === 0) return null;

  return (
    <div className="bg-status-error text-white py-2.5 px-4 overflow-hidden relative z-[60]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Megaphone size={18} className="shrink-0 animate-bounce" />
          <p className="text-sm font-black tracking-tight truncate">
            <span className="bg-white text-red-600 px-1.5 py-0.5 rounded text-[10px] mr-2">重要</span>
            {news[0].content.split('\n')[0]}
          </p>
        </div>
        <a
          href={news[0].sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold underline whitespace-nowrap hover:opacity-80"
        >
          詳細
        </a>
      </div>
    </div>
  );
}
