'use client';

import { Search, Utensils, Scissors, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const BOTTOM_ITEMS: Array<{ id: string; label: string; href: string; icon: ReactNode }> = [
  { id: 'all', label: 'すべて', href: '/', icon: <Search size={18} /> },
  { id: 'food', label: '飲食', href: '/?category=food', icon: <Utensils size={18} /> },
  { id: 'beauty', label: '美容', href: '/?category=beauty', icon: <Scissors size={18} /> },
  { id: 'education', label: '習い事', href: '/?category=education', icon: <GraduationCap size={18} /> },
  { id: 'jobs', label: '求人', href: '/?category=jobs', icon: <Briefcase size={18} /> },
];

interface BottomNavProps {
  currentCategory?: string;
}

export function BottomNav({ currentCategory }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-[100]',
        'glass border-t border-border-primary',
        'px-4 pt-2 flex justify-between items-start',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]'
      )}
      role="navigation"
      aria-label="メインナビゲーション"
    >
      {BOTTOM_ITEMS.map((item) => {
        const isActive = (!currentCategory && item.id === 'all') || currentCategory === item.id;
        return (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-all min-w-[48px]',
              isActive ? 'text-accent-primary scale-105' : 'text-text-tertiary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={cn(
              'p-2 rounded-xl transition-colors',
              isActive && 'bg-accent-subtle'
            )}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter">{item.label}</span>
          </a>
        );
      })}
      <button
        className="flex flex-col items-center gap-1 text-text-tertiary opacity-30 cursor-not-allowed min-w-[48px]"
        disabled
        aria-label="保存済み（準備中）"
      >
        <div className="p-2"><Heart size={18} /></div>
        <span className="text-[9px] font-black tracking-tighter">保存済み</span>
      </button>
    </nav>
  );
}
