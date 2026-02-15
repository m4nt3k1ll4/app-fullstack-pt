"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import { Search } from "@/app/components/Search";
import { StockTable } from "@/app/components/StockTable";
import { StockKPIs } from "@/app/components/StockKPIs";
import { StockModal } from "@/app/components/StockModal";
import { Pagination } from "@/app/components/Pagination";
import { TableSkeleton } from "@/app/components/Skeletons";
import { fetchStocksAction, fetchProductsAction } from "@/app/helpers/actions";
import type { Stock, Product } from "@/app/types";
import { FiPlus } from "react-icons/fi";

export default function AdminStockPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>(undefined);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [stocksRes, productsRes] = await Promise.all([
          fetchStocksAction({ search, page: currentPage, per_page: 10 }),
          fetchProductsAction({ per_page: 500 }), // Cargar todos los productos para el selector
        ]);

        if (!stocksRes.success || !stocksRes.data) {
          setError(stocksRes.message || "Error al cargar inventario");
          return;
        }

        setStocks(stocksRes.data);
        setTotalPages(stocksRes.meta?.last_page || 1);
        setProducts(productsRes.data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [search, currentPage]);

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingStock(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(undefined);
    // Recargar datos después de cerrar el modal
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
        >
          Inventario
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo Stock
        </button>
      </div>

      {/* KPIs */}
      {!isLoading && !error && <StockKPIs stocks={stocks} />}

      <Search placeholder="Buscar producto en inventario..." />

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && <TableSkeleton />}

      {/* Tabla */}
      {!isLoading && !error && (
        <StockTable stocks={stocks} search={search} onEdit={handleEdit} />
      )}

      <Pagination totalPages={totalPages} />

      {/* Modal */}
      <StockModal
        stock={editingStock}
        products={products}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
