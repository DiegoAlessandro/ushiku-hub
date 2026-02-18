'use client';

import { useState, useCallback } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { Store } from '@/types';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { UrgentNewsBanner } from '@/components/sections/UrgentNewsBanner';
import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { FilterPills } from '@/components/sections/FilterPills';
import { StoreGrid } from '@/components/sections/StoreGrid';
import { StoreCard } from '@/components/store/StoreCard';
import { StoreDetailSheet } from '@/components/store/StoreDetailSheet';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { MapListToggle } from '@/components/map/MapListToggle';
import { useViewMode } from '@/hooks/useViewMode';
import { NAV_ITEMS } from '@/lib/constants';
import { PlusCircle, Map as MapIcon } from 'lucide-react';

interface HomeClientProps {
  stores: Store[];
  urgentNews: Store[];
  category?: string;
  searchQuery?: string;
  tag?: string;
}

export function HomeClient({ stores, urgentNews, category, searchQuery, tag }: HomeClientProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { viewMode, toggleViewMode } = useViewMode();

  const handleSelectStore = useCallback((store: Store) => {
    setSelectedStore(store);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedStore(null);
  }, []);

  const showMap = !searchQuery && !tag;
  const isFiltered = !!(category || searchQuery || tag);

  // タイトル生成
  const pageTitle = searchQuery
    ? `「${searchQuery}」`
    : tag
      ? `#${tag}`
      : category
        ? NAV_ITEMS.find((n) => n.id === category)?.label
        : '最新の街ネタ';

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-surface-primary text-text-primary pb-24 md:pb-0 font-sans">
        {/* Urgent News */}
        {!isFiltered && <UrgentNewsBanner news={urgentNews} />}

        {/* Header */}
        <Header currentCategory={category} searchQuery={searchQuery} />

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Filter Pills */}
          <div className="mb-6">
            <FilterPills currentTag={tag} currentCategory={category} />
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs category={category} searchQuery={searchQuery} tag={tag} />

          {/* Section Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
                {pageTitle}
                {stores.length > 0 && (
                  <span className="text-sm font-bold text-accent-primary bg-accent-subtle px-2 py-1 rounded-lg ml-2">
                    {stores.length}
                  </span>
                )}
              </h2>
              <p className="text-xs md:text-sm text-text-secondary font-medium mt-1">
                牛久市のSNSや公式情報をAIが24時間集約中
              </p>
            </div>
            <a
              href="https://forms.gle/your-user-post-form-id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold text-xs shadow-lg hover:bg-accent-primary-hover transition-all active:scale-95"
            >
              <PlusCircle size={16} />
              街のネタを投稿
            </a>
          </div>

          {/* Map or Grid */}
          {showMap && viewMode === 'map' ? (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-text-tertiary uppercase tracking-widest">
                <MapIcon size={14} />
                街のマップから探す
              </div>
              <InteractiveMap stores={stores} onSelectStore={handleSelectStore} />
            </div>
          ) : (
            <StoreGrid storeIds={stores.map((s) => s.id)}>
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} onSelect={handleSelectStore} />
              ))}
            </StoreGrid>
          )}

          {/* Empty State */}
          {stores.length === 0 && !searchQuery && (
            <div className="text-center py-20">
              <p className="text-text-tertiary text-sm font-medium">該当する情報が見つかりませんでした</p>
            </div>
          )}
        </main>

        {/* Map/List Toggle FAB */}
        {showMap && <MapListToggle viewMode={viewMode} onToggle={toggleViewMode} />}

        {/* Bottom Nav */}
        <BottomNav currentCategory={category} />

        {/* Footer */}
        <Footer />

        {/* Bottom Sheet (1つだけ配置) */}
        <StoreDetailSheet store={selectedStore} onClose={handleCloseSheet} />
      </div>
    </LazyMotion>
  );
}
