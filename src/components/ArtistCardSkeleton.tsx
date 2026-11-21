export default function ArtistCardSkeleton() {
  return (
    <article aria-hidden="true" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="skeleton flex h-36 flex-col justify-end gap-2 p-4">
        <div className="h-5 w-2/3 rounded bg-zinc-400/30" />
        <div className="h-3 w-1/3 rounded bg-zinc-400/30" />
      </div>
      <div className="divide-y divide-zinc-100 px-3 py-1 dark:divide-zinc-800">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex min-h-16 items-center gap-3 px-2 py-2">
            <div className="skeleton h-3 w-14 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-4/5 rounded" />
              <div className="skeleton h-3 w-3/5 rounded" />
            </div>
            <div className="skeleton h-4 w-16 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </article>
  );
}
