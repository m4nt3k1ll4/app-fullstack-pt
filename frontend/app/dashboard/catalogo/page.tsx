import { bebasNeue } from "@/app/ui/fonts";
import { auth } from "@/app/auth";
import { fetchProducts } from "@/app/helpers/api";
import { Search } from "@/app/components/Search";
import { CatalogGrid } from "@/app/components/CatalogGrid";
import { Pagination } from "@/app/components/Pagination";

export default async function CatalogoPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const res = await fetchProducts({ search, page: currentPage, per_page: 20 });
  const totalPages = res.meta?.last_page || 1;
  const products = res.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
        >
          Catálogo
        </h1>
        <p className="mt-1 text-zinc-400">
          Bienvenido, {session?.user?.name ?? "Usuario"}. Explora nuestros productos.
        </p>
      </div>

      <Search placeholder="Buscar en el catálogo..." />

      <CatalogGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
