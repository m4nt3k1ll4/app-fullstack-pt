export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-800" />
      </div>
      <div className="mt-4 h-8 w-20 rounded bg-zinc-800" />
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-zinc-800">
      <td className="px-4 py-3">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-zinc-800" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-800" />
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase">
              <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
            </th>
          </tr>
        </thead>
        <tbody>
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </tbody>
      </table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
      <CardsSkeleton />
      <TableSkeleton />
    </div>
  );
}
