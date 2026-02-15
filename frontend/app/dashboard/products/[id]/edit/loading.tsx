export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
      <div className="max-w-2xl space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
          <div className="h-20 w-full animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="h-28 w-full animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
