'use client';

import { useState } from 'react';
import type { Store } from '@/types';
import { ExternalLink, MapPin, Instagram, Globe, Calendar, GraduationCap, AlertCircle, Clock, Share2, Eye, Utensils, Scissors, ShoppingBag, Zap, Briefcase, Info } from 'lucide-react';
import Image from 'next/image';
import { FavoriteButton } from '@/components/FavoriteButton';
import { getCategoryConfig } from '@/lib/constants';
import { formatDate, getBusinessStatus, cn } from '@/lib/utils';

const CATEGORY_PLACEHOLDER: Record<string, { gradient: string; Icon: typeof Globe }> = {
  food:      { gradient: 'from-orange-400 to-amber-500',   Icon: Utensils },
  beauty:    { gradient: 'from-pink-400 to-rose-500',      Icon: Scissors },
  shop:      { gradient: 'from-blue-400 to-indigo-500',    Icon: ShoppingBag },
  event:     { gradient: 'from-emerald-400 to-teal-500',   Icon: Zap },
  education: { gradient: 'from-purple-400 to-violet-500',  Icon: GraduationCap },
  jobs:      { gradient: 'from-indigo-400 to-blue-500',    Icon: Briefcase },
  other:     { gradient: 'from-slate-400 to-gray-500',     Icon: Info },
};

interface StoreCardProps {
  store: Store;
  onSelect: (store: Store) => void;
}

function CategoryPlaceholder({ category }: { category: string }) {
  const placeholder = CATEGORY_PLACEHOLDER[category] ?? CATEGORY_PLACEHOLDER.other;
  const PlaceholderIcon = placeholder.Icon;
  return (
    <div className={cn('w-full h-full flex items-center justify-center bg-gradient-to-br', placeholder.gradient)}>
      <PlaceholderIcon size={48} strokeWidth={1.5} className="text-white/70" />
    </div>
  );
}

export function StoreCard({ store, onSelect }: StoreCardProps) {
  const [imgError, setImgError] = useState(false);
  const config = getCategoryConfig(store.category);
  const isOpen = getBusinessStatus(store.businessHours);

  // バッジ判定
  const isNewOpen = store.tags?.includes('開店') || store.tags?.includes('オープン');
  const isClosing = store.tags?.includes('閉店');
  const isDeals = store.tags?.includes('クーポン') || store.tags?.includes('セール') || store.tags?.includes('特売');

  // シェアURL
  const shareText = encodeURIComponent(`【牛久ナビ】${store.name} の最新情報をチェック！\n#牛久市 #牛久ナビ #街ネタ\n`);
  const shareUrl = encodeURIComponent(`https://ushiku-hub.jp/?q=${store.name}`);
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
  const xShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const reportUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfYourFormId/viewform?entry.123456=${encodeURIComponent(store.name)}`;

  return (
    <article className={cn(
      'group bg-surface-elevated rounded-2xl border border-border-primary',
      'shadow-sm hover:shadow-xl hover:border-accent-primary/30',
      'transition-all duration-300 flex flex-col overflow-hidden'
    )}>
      {/* Image */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(store)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(store); } }}
        className="aspect-[16/10] relative overflow-hidden bg-surface-tertiary block cursor-pointer w-full text-left"
        aria-label={`${store.name}の詳細を見る`}
      >
        {store.imageUrl && !imgError ? (
          <Image
            src={store.imageUrl}
            alt={store.imageAlt || store.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <CategoryPlaceholder category={store.category} />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {config && (
            <span className={cn('text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-sm', config.color.light)}>
              {config.label}
            </span>
          )}
          {isOpen !== null && (
            <span className={cn(
              'text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md border shadow-sm',
              isOpen ? 'bg-green-500 text-white border-green-600' : 'bg-slate-500 text-white border-slate-600'
            )}>
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
          {isDeals && (
            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md bg-orange-500 text-white border border-orange-600 shadow-sm">
              お得情報
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton storeId={store.id} />
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white shadow-2xl">
            <Eye size={24} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-text-tertiary text-xs font-medium">
            <Calendar size={14} />
            <time dateTime={new Date(store.collectedAt || new Date()).toISOString()}>
              {formatDate(store.collectedAt || new Date())}
            </time>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-border-secondary pr-3 mr-1">
              <a href={lineShareUrl} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-green-500 transition-colors" title="LINEで送る" aria-label="LINEで送る">
                <Globe size={14} />
              </a>
              <a href={xShareUrl} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-text-primary transition-colors" title="Xでシェア" aria-label="Xでシェア">
                <Share2 size={14} />
              </a>
            </div>
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-status-error transition-colors"
              title="情報の誤りを報告"
              aria-label="情報の誤りを報告"
            >
              <AlertCircle size={14} />
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(store)}
          className="text-left group/title cursor-pointer"
        >
          <h3 className="font-bold text-xl text-text-primary mb-2 group-hover/title:text-accent-primary transition-colors line-clamp-1">
            {store.name}
          </h3>
        </button>

        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 flex-grow font-medium">
          {store.content}
        </p>

        <div className="space-y-2.5 mb-6">
          {store.businessHours && (
            <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
              <Clock size={14} className="text-accent-primary" />
              <span>営業時間: {store.businessHours}</span>
              {store.regularHoliday && <span className="text-text-tertiary text-[10px]">（定休日: {store.regularHoliday}）</span>}
            </div>
          )}
          {store.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-text-secondary text-xs hover:text-accent-primary transition-colors group/map"
            >
              <MapPin size={14} className="mt-0.5 shrink-0 text-text-tertiary group-hover/map:text-accent-primary" />
              <span className="line-clamp-1 underline underline-offset-4 decoration-border-primary group-hover/map:decoration-accent-primary font-medium">
                {store.address}
              </span>
            </a>
          )}
          {store.instagramAccount && (
            <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
              <Instagram size={14} className="shrink-0 text-text-tertiary" />
              <span>@{store.instagramAccount}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border-secondary flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_8px_var(--accent-primary)]" />
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
              {store.source}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelect(store)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-bold hover:bg-accent-primary-hover transition-all shadow-md active:scale-95"
          >
            詳しく見る
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
