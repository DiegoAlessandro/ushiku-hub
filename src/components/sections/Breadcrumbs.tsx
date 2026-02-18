import { getCategoryLabel } from '@/lib/constants';

interface BreadcrumbsProps {
  category?: string;
  searchQuery?: string;
  tag?: string;
}

export function Breadcrumbs({ category, searchQuery, tag }: BreadcrumbsProps) {
  if (!category && !searchQuery && !tag) return null;

  return (
    <nav
      className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-6"
      aria-label="パンくずリスト"
    >
      <a href="/" className="hover:text-accent-primary transition-colors">HOME</a>

      {category && (
        <>
          <span className="text-border-primary">/</span>
          <span className={!searchQuery && !tag ? 'text-text-primary' : ''}>
            {getCategoryLabel(category)}
          </span>
        </>
      )}

      {tag && (
        <>
          <span className="text-border-primary">/</span>
          <span className={!searchQuery ? 'text-text-primary' : ''}>#{tag}</span>
        </>
      )}

      {searchQuery && (
        <>
          <span className="text-border-primary">/</span>
          <span className="text-text-primary">「{searchQuery}」の検索結果</span>
        </>
      )}
    </nav>
  );
}
