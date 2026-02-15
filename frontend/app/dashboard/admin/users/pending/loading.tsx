import { TableSkeleton } from "@/app/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded bg-zinc-800" />
      <TableSkeleton />
    </div>
  );
}
