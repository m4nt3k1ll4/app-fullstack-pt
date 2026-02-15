"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/app/types";
import { formatCurrency } from "@/app/helpers/utils";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight, FiBox, FiZap } from "react-icons/fi";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [];

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const prevImage = () => setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-zinc-800/80 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image section */}
          <div className="relative flex items-center justify-center bg-zinc-950 md:w-1/2 min-h-64 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[imageIndex]}
                  alt={`${product.name} - imagen ${imageIndex + 1}`}
                  width={400}
                  height={320}
                  className="max-h-80 w-full object-contain p-6"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 rounded-full bg-zinc-800/80 p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 rounded-full bg-zinc-800/80 p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImageIndex(i)}
                          className={`h-2 w-2 rounded-full transition-colors cursor-pointer ${
                            i === imageIndex ? "bg-indigo-400" : "bg-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
                <FiBox className="h-16 w-16 mb-2" />
                <span className="text-sm">Sin imágenes</span>
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="flex-1 p-6 md:p-8 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">{product.name}</h2>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {formatCurrency(Number(product.price))}
              </p>
            </div>

            {product.features && (
              <div>
                <h3 className="mb-1.5 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Características
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                  {product.features}
                </p>
              </div>
            )}

            {product.ai_description && (
              <div>
                <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  <FiZap className="h-3.5 w-3.5 text-indigo-400" />
                  Descripción IA
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                  {product.ai_description}
                </p>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 pt-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors cursor-pointer ${
                      i === imageIndex
                        ? "border-indigo-500"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
