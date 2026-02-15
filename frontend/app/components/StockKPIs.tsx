import { formatCurrency } from "@/app/helpers/utils";
import { FiPackage, FiDollarSign, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import type { Stock } from "@/app/types";

export function StockKPIs({ stocks }: { stocks: Stock[] }) {
  // Calcular KPIs
  const totalProducts = stocks.length;
  const totalItems = stocks.reduce((sum, stock) => sum + stock.stock, 0);
  const totalValue = stocks.reduce((sum, stock) => sum + Number(stock.total_stock), 0);
  const outOfStockProducts = stocks.filter((stock) => stock.stock === 0).length;
  const lowStockProducts = stocks.filter((stock) => stock.stock > 0 && stock.stock < 10).length;

  const kpis = [
    {
      label: "Total Productos",
      value: totalProducts.toString(),
      icon: FiPackage,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
    },
    {
      label: "Total Unidades",
      value: totalItems.toString(),
      icon: FiTrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Valor Total",
      value: formatCurrency(totalValue),
      icon: FiDollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Sin Stock / Bajo Stock",
      value: `${outOfStockProducts} / ${lowStockProducts}`,
      icon: FiAlertCircle,
      color: outOfStockProducts > 0 ? "text-red-400" : "text-zinc-400",
      bgColor: outOfStockProducts > 0 ? "bg-red-400/10" : "bg-zinc-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${kpi.bgColor} p-3`}>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className={`mt-1 text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
