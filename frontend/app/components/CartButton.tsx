"use client";

import { useCart } from "@/app/components/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative rounded-lg bg-zinc-800 p-2.5 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
      aria-label="Abrir carrito"
    >
      <FiShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}
