'use client';

import { Sun, Moon, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import type { ThemeMode } from '@/types';

const CYCLE: ThemeMode[] = ['auto', 'light', 'dark'];

const LABELS: Record<ThemeMode, string> = {
  auto: '自動モード（時間帯で切替）',
  light: 'ライトモード',
  dark: 'ダークモード',
};

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggle = () => {
    const idx = CYCLE.indexOf(theme);
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
  };

  const icon = theme === 'auto' ? <Clock size={20} />
    : theme === 'light' ? <Sun size={20} />
    : <Moon size={20} />;

  return (
    <button
      onClick={toggle}
      className={cn(
        'p-2 rounded-xl transition-all duration-200',
        'hover:bg-surface-tertiary active:scale-95',
        'text-text-secondary hover:text-text-primary'
      )}
      aria-label={LABELS[theme]}
    >
      {icon}
    </button>
  );
}
