import { Suspense } from "react";
import { bebasNeue } from "@/app/ui/fonts";
import { Search } from "@/app/components/Search";
import { UsersTable } from "@/app/components/UsersTable";
import { Pagination } from "@/app/components/Pagination";
import { TableSkeleton } from "@/app/components/Skeletons";
import { fetchUsers } from "@/app/helpers/api";
import { auth } from "@/app/auth";

export default async function AdminUsersPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  const adminToken = session?.user?.adminToken ?? "";
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const res = await fetchUsers(adminToken, { search, page: currentPage, per_page: 10 });
  const totalPages = res.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <h1
        className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
      >
        Usuarios
      </h1>

      <Search placeholder="Buscar usuarios..." />

      <Suspense key={search + currentPage} fallback={<TableSkeleton />}>
        <UsersTable search={search} currentPage={currentPage} />
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
