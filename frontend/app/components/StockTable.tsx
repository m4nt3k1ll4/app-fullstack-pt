"use client";

import { formatCurrency, formatDate } from "@/app/helpers/utils";
import { FiPackage } from "react-icons/fi";
import { DeleteStockButton, EditStockButton } from "./StockActions";
import type { Stock } from "@/app/types";

export function StockTable({
  stocks,
  search,
  onEdit,
}: {
  stocks: Stock[];
  search: string;
  onEdit: (stock: Stock) => void;
}) {
  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiPackage className="mb-3 h-12 w-12" />
        <p className="text-lg">No se encontró inventario</p>
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
                Producto
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                Valor Unitario
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                Precio Venta
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                Valor Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                Última Actualización
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {stocks.map((stock) => (
              <tr
                key={stock.id}
                className="transition-colors hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-zinc-200">
                    {stock.product?.name || `Producto #${stock.product_id}`}
                  </p>
                  {stock.product?.features && (
                    <p className="text-xs text-zinc-500 truncate max-w-xs">
                      {stock.product.features}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`text-sm font-semibold ${
                      stock.stock === 0
                        ? "text-red-400"
                        : stock.stock < 10
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {stock.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="text-sm text-zinc-400">
                    {formatCurrency(Number(stock.unit_value))}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="text-sm text-emerald-400 font-medium">
                    {formatCurrency(Number(stock.sale_value))}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden lg:table-cell">
                  <span className="text-sm text-zinc-300 font-medium">
                    {formatCurrency(Number(stock.total_stock))}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-zinc-500">
                    {formatDate(stock.updated_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <EditStockButton onClick={() => onEdit(stock)} />
                    <DeleteStockButton
                      stockId={stock.id}
                      productName={stock.product?.name || `Producto #${stock.product_id}`}
                    />
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
