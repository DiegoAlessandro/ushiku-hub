'use client';

import dynamic from 'next/dynamic';
import type { Store } from '@/types';
import { USHIKU_CENTER } from '@/lib/constants';

// Leafletを動的インポート（SSR無効）
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full skeleton rounded-2xl flex items-center justify-center text-text-tertiary font-bold text-sm">
      地図を読み込み中...
    </div>
  ),
});

interface InteractiveMapProps {
  stores: Store[];
  onSelectStore?: (store: Store) => void;
}

export function InteractiveMap({ stores, onSelectStore }: InteractiveMapProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border-primary shadow-inner z-0">
      <MapInner stores={stores} center={USHIKU_CENTER} onSelectStore={onSelectStore} />
    </div>
  );
}
