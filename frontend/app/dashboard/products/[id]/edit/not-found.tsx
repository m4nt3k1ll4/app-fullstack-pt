import Link from "next/link";
import { FiArrowLeft, FiBox } from "react-icons/fi";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
      <FiBox className="mb-4 h-16 w-16" />
      <h2 className="mb-2 text-xl font-semibold text-zinc-200">
        Producto no encontrado
      </h2>
      <p className="mb-6 text-sm">
        El producto que buscas no existe o fue eliminado.
      </p>
      <Link
        href="/dashboard/products"
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>
    </div>
  );
}
