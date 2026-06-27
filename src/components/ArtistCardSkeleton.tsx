/**
 * Скелетон карточки артиста — показывается во время загрузки концертов.
 * Повторяет структуру реальной карточки из page.tsx.
 */
export default function ArtistCardSkeleton() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Шапка: аватар + имя */}
      <div className="flex gap-4 p-4 pb-2">
        <div className="skeleton w-14 h-14 rounded-lg flex-shrink-0" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>

      {/* Превью концертов */}
      <div className="px-4 pb-4 pt-2 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="skeleton h-3.5 w-1/2 rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="skeleton h-4 w-16 rounded-full" />
              <div className="skeleton h-4 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
