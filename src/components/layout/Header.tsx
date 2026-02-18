'use client';

import { Search, Map as MapIcon, Utensils, Scissors, ShoppingBag, Zap, GraduationCap, Briefcase } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

// アイコンマッピング
const ICON_MAP: Record<string, ReactNode> = {
  Search: <Search size={16} />,
  Utensils: <Utensils size={16} />,
  Scissors: <Scissors size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  Zap: <Zap size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  Briefcase: <Briefcase size={16} />,
};

interface HeaderProps {
  currentCategory?: string;
  searchQuery?: string;
}

export function Header({ currentCategory, searchQuery }: HeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 glass border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <MapIcon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-black text-text-primary tracking-tight leading-none">
                  牛久ナビ
                </h1>
                <span className="text-accent-primary text-[9px] tracking-[0.2em] font-bold">USHIKU HUB</span>
              </div>
            </a>

            {/* Search */}
            <form action="/" method="GET" className="flex-grow max-w-md mx-8 relative group">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="お店やキーワードで検索..."
                className={cn(
                  'w-full bg-surface-tertiary border border-border-primary rounded-2xl',
                  'py-2.5 pl-11 pr-4 text-sm font-medium',
                  'focus:ring-2 focus:ring-accent-primary focus:border-transparent',
                  'text-text-primary placeholder:text-text-tertiary',
                  'transition-all outline-none'
                )}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-primary transition-colors" size={18} />
            </form>

            {/* Nav + Theme */}
            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-0.5 p-1 bg-surface-tertiary rounded-xl border border-border-primary overflow-x-auto no-scrollbar max-w-[420px]">
                {NAV_ITEMS.map((item) => {
                  const isActive = (!currentCategory && item.id === 'all') || currentCategory === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                        isActive
                          ? 'bg-surface-elevated text-accent-primary shadow-sm'
                          : 'text-text-tertiary hover:text-text-primary hover:bg-surface-elevated/50'
                      )}
                    >
                      {ICON_MAP[item.iconName]}
                      {item.label}
                    </a>
                  );
                })}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 glass border-b border-border-primary px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center text-white shadow-md">
            <MapIcon size={18} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg text-text-primary tracking-tight">牛久ナビ</span>
        </a>

        <div className="flex items-center gap-2 flex-1 ml-3">
          <form action="/" method="GET" className="flex-1 relative">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="検索..."
              className={cn(
                'w-full bg-surface-tertiary border border-border-primary rounded-xl',
                'py-2 pl-9 pr-3 text-xs font-bold',
                'text-text-primary placeholder:text-text-tertiary',
                'outline-none focus:ring-2 focus:ring-accent-primary'
              )}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
          </form>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
