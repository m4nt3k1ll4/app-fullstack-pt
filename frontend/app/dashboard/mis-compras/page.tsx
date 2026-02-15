import { bebasNeue } from "@/app/ui/fonts";
import { MyPurchasesList } from "@/app/components/MyPurchasesList";
import { Pagination } from "@/app/components/Pagination";
import { fetchMyPurchases } from "@/app/helpers/api";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function MisComprasPage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const res = await fetchMyPurchases(userEmail, {
    page: currentPage,
    per_page: 10,
  });

  const purchases = res.data ?? [];
  const totalPages = res.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
        >
          Mis Compras
        </h1>
        <p className="mt-1 text-zinc-400">
          Historial de todas tus compras realizadas.
        </p>
      </div>

      <MyPurchasesList purchases={purchases} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
