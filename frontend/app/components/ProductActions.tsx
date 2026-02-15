"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiZap, FiLoader } from "react-icons/fi";
import { deleteProductAction, generateDescriptionAction } from "@/app/helpers/actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el producto "${productName}"?`)) return;
    startTransition(async () => {
      await deleteProductAction(productId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      title="Eliminar"
    >
      {isPending ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <FiTrash2 className="h-4 w-4" />
      )}
    </button>
  );
}

export function GenerateDescriptionButton({
  productId,
}: {
  productId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateDescriptionAction(productId);
      if (result.success) {
        router.refresh();
      } else {
        setMessage(result.message);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-400/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 hover:bg-indigo-400/20 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        title="Generar con IA"
      >
        {isPending ? (
          <FiLoader className="h-3 w-3 animate-spin" />
        ) : (
          <FiZap className="h-3 w-3" />
        )}
        {isPending ? "Generando..." : "Generar"}
      </button>
      {message && (
        <span className="text-xs text-red-400">{message}</span>
      )}
    </div>
  );
}
