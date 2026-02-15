"use client";

import type { Product } from "@/app/types";
import { formatCurrency } from "@/app/helpers/utils";
import Image from "next/image";
import { FiBox } from "react-icons/fi";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950">
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
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-zinc-400 line-clamp-1">
          {product.features || "Producto"}
        </p>
        <h3 className="mt-1 text-base font-semibold text-zinc-100 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {product.name}
        </h3>
        <p className="mt-auto pt-3 text-xl font-bold text-emerald-400">
          {formatCurrency(Number(product.price))}
        </p>
      </div>
    </button>
  );
}
