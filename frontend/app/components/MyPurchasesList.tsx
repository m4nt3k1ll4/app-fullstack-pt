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

function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
            <FiPackage className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Compra #{purchase.id}
            </p>
            <p className="text-xs text-zinc-500">
              {formatDate(purchase.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              statusColors[purchase.status] || "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            {statusLabels[purchase.status] || purchase.status}
          </span>
          <span className="text-sm font-semibold text-emerald-400">
            {formatCurrency(Number(purchase.total))}
          </span>
          {expanded ? (
            <FiChevronUp className="h-4 w-4 text-zinc-500" />
          ) : (
            <FiChevronDown className="h-4 w-4 text-zinc-500" />
          )}
        </div>
      </button>

      {expanded && purchase.items && (
        <div className="border-t border-zinc-800 px-4 py-3">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500">
                <th className="pb-2 text-left font-medium">Producto</th>
                <th className="pb-2 text-center font-medium">Cant.</th>
                <th className="pb-2 text-right font-medium">P. Unit.</th>
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
        </div>
      )}
    </div>
  );
}

export function MyPurchasesList({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiPackage className="mb-4 h-14 w-14" />
        <p className="text-lg font-medium">No tienes compras aún</p>
        <p className="mt-1 text-sm">
          Visita el catálogo para realizar tu primera compra.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <PurchaseCard key={purchase.id} purchase={purchase} />
      ))}
    </div>
  );
}
