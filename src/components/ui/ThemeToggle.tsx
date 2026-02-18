'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { isDark, setTheme, theme } = useTheme();

  const toggle = () => {
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'p-2 rounded-xl transition-all duration-200',
        'hover:bg-surface-tertiary active:scale-95',
        'text-text-secondary hover:text-text-primary'
      )}
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
