"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiArrowLeft, FiLoader } from "react-icons/fi";
import type { Product } from "@/app/types";
import type { ActionState } from "@/app/helpers/actions";
import { createProductAction, updateProductAction } from "@/app/helpers/actions";

export function ProductForm({
  product,
}: {
  product?: Product;
}) {
  const router = useRouter();
  const isEditing = !!product;

  const boundAction = isEditing
    ? updateProductAction.bind(null, product.id)
    : createProductAction;

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    { success: false, message: "" }
  );

  // Redirect on success for create
  if (state.success && !isEditing) {
    router.push("/dashboard/products");
  }

  return (
    <form action={formAction} className="space-y-6">
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

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Nombre <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          defaultValue={product?.name}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          placeholder="Nombre del producto"
        />
        {state.errors?.name && (
          <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Precio
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price ? Number(product.price) : undefined}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          placeholder="0.00"
        />
        {state.errors?.price && (
          <p className="mt-1 text-xs text-red-400">{state.errors.price[0]}</p>
        )}
      </div>

      {/* Features */}
      <div>
        <label
          htmlFor="features"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Características
        </label>
        <textarea
          id="features"
          name="features"
          rows={3}
          defaultValue={product?.features || ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          placeholder="Describe las características del producto"
        />
        {state.errors?.features && (
          <p className="mt-1 text-xs text-red-400">
            {state.errors.features[0]}
          </p>
        )}
      </div>

      {/* AI Description */}
      <div>
        <label
          htmlFor="ai_description"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Descripción IA
        </label>
        <textarea
          id="ai_description"
          name="ai_description"
          rows={4}
          defaultValue={product?.ai_description || ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          placeholder="Se puede generar automáticamente con IA"
        />
        {state.errors?.ai_description && (
          <p className="mt-1 text-xs text-red-400">
            {state.errors.ai_description[0]}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <FiSave className="h-4 w-4" />
          )}
          {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
    </form>
  );
}
