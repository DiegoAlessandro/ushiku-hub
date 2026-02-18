'use client';

import { Drawer } from 'vaul';
import { X, ExternalLink, MapPin, Instagram, Clock, Tag } from 'lucide-react';
import { InstagramEmbed } from '@/components/InstagramEmbed';
import { cn } from '@/lib/utils';
import { getCategoryConfig } from '@/lib/constants';
import type { Store } from '@/types';

interface StoreDetailSheetProps {
  store: Store | null;
  onClose: () => void;
}

export function StoreDetailSheet({ store, onClose }: StoreDetailSheetProps) {
  const isOpen = !!store;
  const config = store ? getCategoryConfig(store.category) : undefined;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
      noBodyStyles
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-[150] bg-black/40"
          style={{ pointerEvents: isOpen ? 'auto' : 'none', opacity: isOpen ? 1 : 0 }}
        />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[200]',
            'rounded-t-3xl',
            'max-h-[90vh] flex flex-col',
            'outline-none'
          )}
          style={{ backgroundColor: 'var(--surface-elevated, #fff)' }}
        >
          {/* Drag Handle */}
          <Drawer.Handle className="mt-2 mb-1" />

          {/* Radix Dialog requires Title for a11y */}
          <Drawer.Title className="sr-only">
            {store?.name ?? '店舗詳細'}
          </Drawer.Title>

          {store && (
            <>
              {/* Visible Header */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-border-primary shrink-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {config && (
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md border', config.color.light)}>
                        {config.label}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-text-primary truncate">
                    {store.name}
                  </h2>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">
                    Source: {store.source}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-tertiary rounded-full transition-colors text-text-tertiary ml-2 shrink-0"
                  aria-label="閉じる"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6 no-scrollbar overscroll-contain">
                <p className="text-text-secondary leading-relaxed font-medium whitespace-pre-wrap text-sm">
                  {store.content}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {store.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-surface-tertiary rounded-2xl hover:bg-accent-subtle transition-colors group"
                    >
                      <MapPin size={18} className="text-accent-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase">住所</p>
                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{store.address}</p>
                      </div>
                    </a>
                  )}
                  {store.businessHours && (
                    <div className="flex items-start gap-3 p-4 bg-surface-tertiary rounded-2xl">
                      <Clock size={18} className="text-status-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase">営業時間</p>
                        <p className="text-sm font-bold text-text-primary">{store.businessHours}</p>
                        {store.regularHoliday && (
                          <p className="text-[10px] text-text-tertiary mt-0.5">定休日: {store.regularHoliday}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {store.tags && store.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {store.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-[10px] font-bold text-text-secondary bg-surface-tertiary px-2 py-1 rounded-md">
                        <Tag size={10} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {store.source === 'instagram' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-text-tertiary uppercase tracking-widest">
                      <Instagram size={14} />
                      Original Post
                    </div>
                    <InstagramEmbed url={store.sourceUrl} />
                  </div>
                )}

                <a
                  href={store.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-accent-primary text-white rounded-2xl font-black text-sm hover:bg-accent-primary-hover transition-all shadow-lg"
                >
                  元投稿で詳しく見る
                  <ExternalLink size={18} />
                </a>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
