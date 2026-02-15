import { fetchProducts } from "@/app/helpers/api";
import { formatCurrency, formatDate } from "@/app/helpers/utils";
import { FiEdit2, FiBox } from "react-icons/fi";
import { DeleteProductButton, GenerateDescriptionButton } from "./ProductActions";
import Link from "next/link";

export async function ProductsTable({
  search,
  currentPage,
}: {
  search: string;
  currentPage: number;
}) {
  const res = await fetchProducts({ search, page: currentPage, per_page: 10 });

  if (!res.success || !res.data) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Error al cargar productos: {res.message}
      </div>
    );
  }

  const products = res.data;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiBox className="mb-3 h-12 w-12" />
        <p className="text-lg">No se encontraron productos</p>
        {search && (
          <p className="mt-1 text-sm">
            No hay resultados para &quot;{search}&quot;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                Características
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                IA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                Fecha
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-zinc-200">
                    {product.name}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-emerald-400 font-medium">
                    {formatCurrency(Number(product.price))}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-sm text-zinc-400 truncate max-w-xs">
                    {product.features || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {product.ai_description ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Generada
                    </span>
                  ) : (
                    <GenerateDescriptionButton productId={product.id} />
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-zinc-500">
                    {formatDate(product.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-indigo-400 transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
