"use client";

import type { Purchase } from "@/app/types";
import { formatCurrency, formatDate } from "@/app/helpers/utils";
import { FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  cancelled: "bg-red-900/30 text-red-400 border-red-800",
};

const statusLabels: Record<string, string> = {
  completed: "Completada",
  pending: "Pendiente",
  cancelled: "Cancelada",
};

export function SalesTable({ purchases }: { purchases: Purchase[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiPackage className="mb-4 h-14 w-14" />
        <p className="text-lg font-medium">No hay ventas registradas</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Cliente</th>
            <th className="px-4 py-3 text-center font-medium">Items</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-center font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Fecha</th>
            <th className="px-4 py-3 text-center font-medium">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <>
              <tr
                key={purchase.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-zinc-300">
                  #{purchase.id}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {purchase.user?.name || "—"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {purchase.user?.email || "—"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-zinc-400">
                  {purchase.items?.length || 0}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400">
                  {formatCurrency(Number(purchase.total))}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[purchase.status] || "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {statusLabels[purchase.status] || purchase.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-zinc-400">
                  {formatDate(purchase.created_at)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === purchase.id ? null : purchase.id)
                    }
                    className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {expandedId === purchase.id ? (
                      <FiChevronUp className="h-4 w-4" />
                    ) : (
                      <FiChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
              {expandedId === purchase.id && purchase.items && (
                <tr key={`${purchase.id}-detail`}>
                  <td colSpan={7} className="bg-zinc-950 px-6 py-3">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-zinc-500">
                          <th className="pb-2 text-left font-medium">Producto</th>
                          <th className="pb-2 text-center font-medium">Cantidad</th>
                          <th className="pb-2 text-right font-medium">P. Unitario</th>
                          <th className="pb-2 text-right font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {purchase.items.map((item) => (
                          <tr key={item.id} className="border-t border-zinc-800/50">
                            <td className="py-2 text-zinc-300">
                              {item.product?.name || `Producto #${item.product_id}`}
                            </td>
                            <td className="py-2 text-center text-zinc-400">
                              {item.quantity}
                            </td>
                            <td className="py-2 text-right text-zinc-400">
                              {formatCurrency(Number(item.unit_price))}
                            </td>
                            <td className="py-2 text-right font-medium text-emerald-400">
                              {formatCurrency(Number(item.subtotal))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
