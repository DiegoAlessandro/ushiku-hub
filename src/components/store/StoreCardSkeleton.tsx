export function StoreCardSkeleton() {
  return (
    <div className="bg-surface-elevated rounded-2xl border border-border-primary overflow-hidden flex flex-col">
      {/* Image skeleton */}
      <div className="aspect-[16/10] skeleton" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="skeleton h-6 w-3/4" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
          <div className="skeleton h-3 w-2/3" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-3 w-48" />
        </div>
        <div className="pt-4 border-t border-border-secondary flex items-center justify-between">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
