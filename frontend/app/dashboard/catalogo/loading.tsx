export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-10 w-40 animate-pulse rounded bg-zinc-800" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
          >
            <div className="aspect-square bg-zinc-800" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 rounded bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-800" />
              <div className="h-6 w-20 rounded bg-zinc-800 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
