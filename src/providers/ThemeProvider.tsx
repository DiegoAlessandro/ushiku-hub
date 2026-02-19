'use client';

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@/types';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'auto',
  resolvedTheme: 'light',
  isDark: false,
  setTheme: () => {},
});

const STORAGE_KEY = 'ushiku_theme';

function getAutoTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // 初期化: localStorageから読み込み
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // 旧 'system' 値の互換: autoに変換
    const initial: ThemeMode = stored === 'light' ? 'light' : stored === 'dark' ? 'dark' : 'auto';
    setThemeState(initial);

    const resolved = initial === 'auto' ? getAutoTheme() : initial;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // autoモード時: 1分ごとに時刻チェック
  useEffect(() => {
    if (theme !== 'auto') return;

    const check = () => {
      const resolved = getAutoTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);

    const resolved = newTheme === 'auto' ? getAutoTheme() : newTheme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, isDark: resolvedTheme === 'dark', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
