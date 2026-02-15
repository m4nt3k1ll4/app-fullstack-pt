import Link from "next/link";
import { bebasNeue } from "@/app/ui/fonts";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1
        className={`${bebasNeue.className} mb-2 text-8xl tracking-wider text-indigo-400`}
      >
        404
      </h1>
      <p className="mb-8 text-lg text-zinc-400">
        La página que buscas no existe.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
