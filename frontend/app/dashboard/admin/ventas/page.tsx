import { Suspense } from "react";
import { bebasNeue } from "@/app/ui/fonts";
import { Search } from "@/app/components/Search";
import { SalesTable } from "@/app/components/SalesTable";
import { Pagination } from "@/app/components/Pagination";
import { TableSkeleton } from "@/app/components/Skeletons";
import { fetchAllPurchases } from "@/app/helpers/api";
import { auth } from "@/app/auth";

export default async function AdminVentasPage(props: {
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

  const res = await fetchAllPurchases(adminToken, {
    search,
    page: currentPage,
    per_page: 10,
  });

  const purchases = res.data ?? [];
  const totalPages = res.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <h1
        className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
      >
        Ventas
      </h1>

      <Search placeholder="Buscar por cliente o producto..." />

      <Suspense key={search + currentPage} fallback={<TableSkeleton />}>
        <SalesTable purchases={purchases} />
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
