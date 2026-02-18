'use client';

import { POPULAR_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FilterPillsProps {
  currentTag?: string;
  currentCategory?: string;
}

export function FilterPills({ currentTag, currentCategory }: FilterPillsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
      role="group"
      aria-label="タグフィルター"
    >
      {POPULAR_TAGS.map((tag) => {
        const isActive = currentTag === tag;
        const href = `/?tag=${encodeURIComponent(tag)}${currentCategory ? `&category=${currentCategory}` : ''}`;

        return (
          <a
            key={tag}
            href={isActive ? (currentCategory ? `/?category=${currentCategory}` : '/') : href}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 snap-start',
              isActive
                ? 'bg-text-primary text-surface-primary border-text-primary shadow-md'
                : 'bg-surface-elevated text-text-secondary border-border-primary hover:border-text-tertiary shadow-sm'
            )}
            aria-pressed={isActive}
          >
            #{tag}
          </a>
        );
      })}
    </div>
  );
}
