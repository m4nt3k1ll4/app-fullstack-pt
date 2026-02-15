"use client";

import type { Product } from "@/app/types";
import { formatCurrency } from "@/app/helpers/utils";
import Image from "next/image";
import { FiBox, FiShoppingCart, FiEye, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "./CartContext";
import { useState } from "react";
import { fetchStockByProductAction } from "@/app/helpers/actions";
import { toast } from "sonner";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null;
  
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      const stockRes = await fetchStockByProductAction(product.id);
      if (!stockRes.success || !stockRes.data) {
        toast.error("No se pudo verificar el stock");
        return;
      }

      const stock = stockRes.data;
      if (stock.stock === 0) {
        toast.error("Producto sin stock disponible");
        return;
      }

      if (quantity > stock.stock) {
        toast.error(`Solo hay ${stock.stock} unidades disponibles`);
        return;
      }

      addItem(product, quantity, stock);
      toast.success(`${quantity}x ${product.name} agregado al carrito`);
      setQuantity(1);
    } catch (error) {
      toast.error("Error al agregar al carrito");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Image - clickeable para abrir modal */}
      <button
        onClick={onClick}
        className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <FiBox className="h-12 w-12" />
          </div>
        )}
        {/* Image count badge */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
            +{product.images.length - 1} fotos
          </span>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <button onClick={onClick} className="text-left cursor-pointer">
          <p className="text-sm text-zinc-400 line-clamp-1">
            {product.features || "Producto"}
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-100 line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>
        </button>
        
        <p className="mt-auto pt-3 text-xl font-bold text-emerald-400">
          {formatCurrency(Number(product.price))}
        </p>

        {/* Controles de cantidad y agregar al carrito */}
        <div className="mt-3 flex items-center gap-2">
          {/* Selector de cantidad */}
          <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-800">
            <button
              onClick={handleDecrement}
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium text-zinc-200">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="h-4 w-4" />
            {isAdding ? "..." : "Agregar"}
          </button>
        </div>

        {/* Botón ver detalles */}
        <button
          onClick={onClick}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <FiEye className="h-4 w-4" />
          Ver detalles
        </button>
      </div>
    </div>
  );
}
