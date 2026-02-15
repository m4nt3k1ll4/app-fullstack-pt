"use client";

import { useTransition } from "react";
import { FiTrash2, FiEdit2, FiLoader } from "react-icons/fi";
import { deleteStockAction } from "@/app/helpers/actions";

export function DeleteStockButton({
  stockId,
  productName,
}: {
  stockId: number;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar el stock de "${productName}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteStockAction(stockId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      title="Eliminar stock"
    >
      {isPending ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <FiTrash2 className="h-4 w-4" />
      )}
    </button>
  );
}

export function EditStockButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-indigo-400 transition-colors cursor-pointer"
      title="Editar stock"
    >
      <FiEdit2 className="h-4 w-4" />
    </button>
  );
}
