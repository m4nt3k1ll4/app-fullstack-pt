"use client";

import { useCart } from "@/app/components/CartContext";
import { formatCurrency } from "@/app/helpers/utils";
import { createPurchaseAction } from "@/app/helpers/actions";
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, setIsOpen } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setMessage(null);

    try {
      const purchaseItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const res = await createPurchaseAction(purchaseItems);

      if (res.success) {
        setMessage({ type: "success", text: "¡Compra realizada exitosamente!" });
        clearCart();
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
          router.push("/dashboard/mis-compras");
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: "error", text: res.message || "Error al procesar la compra." });
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-zinc-100">Carrito</h2>
            <span className="rounded-full bg-indigo-600/30 px-2 py-0.5 text-xs font-medium text-indigo-300">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <FiShoppingCart className="mb-3 h-12 w-12" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const price = item.stock
                  ? Number(item.stock.sale_value)
                  : Number(item.product.price);
                const maxStock = item.stock ? item.stock.stock : 99;

                return (
                  <li
                    key={item.product.id}
                    className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-zinc-200 truncate">
                        {item.product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {formatCurrency(price)} c/u
                      </p>

                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="rounded-md bg-zinc-800 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <FiMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity < maxStock) {
                              updateQuantity(item.product.id, item.quantity + 1);
                            }
                          }}
                          disabled={item.quantity >= maxStock}
                          className="rounded-md bg-zinc-800 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiPlus className="h-3.5 w-3.5" />
                        </button>
                        {item.stock && (
                          <span className="text-[11px] text-zinc-600">
                            (máx: {maxStock})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="rounded-md p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(price * item.quantity)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-800 px-6 py-4 space-y-3">
            {message && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.type === "success"
                    ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
                    : "bg-red-900/30 text-red-400 border border-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total</span>
              <span className="text-xl font-bold text-emerald-400">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Vaciar
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
