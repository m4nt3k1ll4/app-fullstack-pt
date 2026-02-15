import { Suspense } from "react";
import { bebasNeue } from "@/app/ui/fonts";
import { PendingUsersTable } from "@/app/components/PendingUsersTable";
import { Pagination } from "@/app/components/Pagination";
import { TableSkeleton } from "@/app/components/Skeletons";
import { fetchPendingUsers } from "@/app/helpers/api";
import { auth } from "@/app/auth";

export default async function PendingUsersPage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const session = await auth();
  const adminToken = session?.user?.adminToken ?? "";
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const res = await fetchPendingUsers(adminToken, { page: currentPage, per_page: 10 });
  const totalPages = res.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <h1
        className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
      >
        Usuarios Pendientes
      </h1>

      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <PendingUsersTable currentPage={currentPage} />
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
