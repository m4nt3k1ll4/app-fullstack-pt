"use client";

import { useState } from "react";
import type { Product } from "@/app/types";
import { ProductCard } from "@/app/components/ProductCard";
import { ProductModal } from "@/app/components/ProductModal";
import { FiShoppingBag } from "react-icons/fi";

export function CatalogGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-20 text-zinc-500">
        <FiShoppingBag className="mb-4 h-14 w-14" />
        <p className="text-lg font-medium">No hay productos disponibles</p>
        <p className="mt-1 text-sm">Vuelve más tarde para ver novedades.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelected(product)}
          />
        ))}
      </div>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
