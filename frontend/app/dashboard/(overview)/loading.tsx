import { CardsSkeleton } from "@/app/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-zinc-800" />
      </div>
      <CardsSkeleton />
      <div>
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-zinc-800" />
        <div className="h-64 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />
      </div>
    </div>
  );
}
