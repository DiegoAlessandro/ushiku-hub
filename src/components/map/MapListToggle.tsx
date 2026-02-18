'use client';

import { Map as MapIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/types';

interface MapListToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export function MapListToggle({ viewMode, onToggle }: MapListToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'fixed z-[90] right-4',
        'bottom-[calc(80px+env(safe-area-inset-bottom))]',
        'md:bottom-6',
        'flex items-center gap-2 px-4 py-3',
        'bg-text-primary text-surface-primary',
        'rounded-full font-bold text-xs',
        'shadow-xl hover:scale-105 active:scale-95',
        'transition-all duration-200'
      )}
      aria-label={viewMode === 'list' ? 'マップ表示に切り替え' : 'リスト表示に切り替え'}
    >
      {viewMode === 'list' ? (
        <>
          <MapIcon size={16} />
          マップ
        </>
      ) : (
        <>
          <List size={16} />
          リスト
        </>
      )}
    </button>
  );
}
