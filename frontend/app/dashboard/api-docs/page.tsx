import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import { ApiDocsClient } from "./ApiDocsClient";

export default async function ApiDocsPage() {
  const session = await auth();

  if (!session?.user?.isInterviewer && !session?.user?.isAdmin) {
    redirect("/dashboard/catalogo");
  }

  return (
    <main className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1
          className={`${bebasNeue.className} text-4xl md:text-5xl text-zinc-100`}
        >
          Documentación de la API
        </h1>
        <p className="mt-2 text-zinc-400">
          Referencia interactiva de todos los endpoints del backend Laravel.
          Expande cada sección para ver detalles, headers, body y respuestas.
        </p>
      </div>

      {/* ── Nota de autenticación ── */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="text-sm text-amber-200/90">
          <strong>Autenticación dual:</strong> Los endpoints de cliente usan{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-300">
            API Key (sk_...)
          </code>{" "}
          sin expiración. Los endpoints de administración usan{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-300">
            Token Sanctum
          </code>{" "}
          con expiración de 5 minutos. El rol{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-emerald-300">
            interviewer
          </code>{" "}
          tiene acceso completo a ambos sistemas.
        </p>
      </div>

      <ApiDocsClient />
    </main>
  );
}
