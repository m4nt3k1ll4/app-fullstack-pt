"use client";

import { useActionState, useEffect } from "react";
import { FiX, FiSave, FiLoader } from "react-icons/fi";
import type { Stock, Product } from "@/app/types";
import type { ActionState } from "@/app/helpers/actions";
import { createStockAction, updateStockAction } from "@/app/helpers/actions";

export function StockModal({
  stock,
  products,
  isOpen,
  onClose,
}: {
  stock?: Stock;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const isEditing = !!stock;

  const boundAction = isEditing
    ? updateStockAction.bind(null, stock.id)
    : createStockAction;

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    { success: false, message: "" }
  );

  // Cerrar modal al finalizar con éxito
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [state.success, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-zinc-100">
            {isEditing ? "Editar Stock" : "Nuevo Stock"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="p-6 space-y-4">
          {/* Status Message */}
          {state.message && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                state.success
                  ? "border-emerald-800/50 bg-emerald-900/20 text-emerald-400"
                  : "border-red-800/50 bg-red-900/20 text-red-400"
              }`}
            >
              {state.message}
            </div>
          )}

          {/* Product Selection (solo para crear) */}
          {!isEditing && (
            <div>
              <label
                htmlFor="product_id"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Producto <span className="text-red-400">*</span>
              </label>
              <select
                id="product_id"
                name="product_id"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Seleccionar producto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {state.errors?.product_id && (
                <p className="mt-1 text-xs text-red-400">{state.errors.product_id[0]}</p>
              )}
            </div>
          )}

          {/* Si está editando, mostrar nombre del producto */}
          {isEditing && stock.product && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 px-4 py-3">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Producto</p>
              <p className="mt-1 text-sm font-medium text-zinc-200">{stock.product.name}</p>
            </div>
          )}

          {/* Stock Quantity */}
          <div>
            <label
              htmlFor="stock"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Cantidad en Stock <span className="text-red-400">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              required
              min="0"
              step="1"
              defaultValue={stock?.stock}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="0"
            />
            {state.errors?.stock && (
              <p className="mt-1 text-xs text-red-400">{state.errors.stock[0]}</p>
            )}
          </div>

          {/* Unit Value */}
          <div>
            <label
              htmlFor="unit_value"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Valor Unitario <span className="text-red-400">*</span>
            </label>
            <input
              id="unit_value"
              name="unit_value"
              type="number"
              required
              min="0"
              step="0.01"
              defaultValue={stock?.unit_value ? Number(stock.unit_value) : undefined}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="0.00"
            />
            {state.errors?.unit_value && (
              <p className="mt-1 text-xs text-red-400">{state.errors.unit_value[0]}</p>
            )}
          </div>

          {/* Sale Value */}
          <div>
            <label
              htmlFor="sale_value"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Precio de Venta <span className="text-red-400">*</span>
            </label>
            <input
              id="sale_value"
              name="sale_value"
              type="number"
              required
              min="0"
              step="0.01"
              defaultValue={stock?.sale_value ? Number(stock.sale_value) : undefined}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="0.00"
            />
            {state.errors?.sale_value && (
              <p className="mt-1 text-xs text-red-400">{state.errors.sale_value[0]}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  {isEditing ? "Actualizar" : "Crear"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
