export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}
