'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ViewMode } from '@/types';

const STORAGE_KEY = 'ushiku_view_mode';

export function useViewMode(defaultMode: ViewMode = 'list') {
  const [viewMode, setViewModeState] = useState<ViewMode>(defaultMode);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === 'list' || stored === 'map') {
      setViewModeState(stored);
    }
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  }, [viewMode, setViewMode]);

  return { viewMode, setViewMode, toggleViewMode };
}
