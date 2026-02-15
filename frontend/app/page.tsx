import Link from "next/link";
import Header from "@/app/components/Header";
import { bebasNeue } from "@/app/ui/fonts";
import { FiZap, FiBox, FiShield, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: FiZap,
    title: "Inteligencia Artificial",
    description:
      "Genera descripciones de productos con IA usando modelos Gemini de última generación.",
  },
  {
    icon: FiBox,
    title: "Gestión de Productos",
    description:
      "Crea, edita y administra tu catálogo de productos con una interfaz intuitiva.",
  },
  {
    icon: FiShield,
    title: "Panel de Administración",
    description:
      "Controla usuarios, aprobaciones y estadísticas desde un panel centralizado.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-950/30 via-black to-black" />
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <FiZap className="h-3.5 w-3.5" />
            Potenciado con IA
          </div>

          <h1
            className={`${bebasNeue.className} mb-6 text-6xl leading-tight tracking-wider sm:text-7xl md:text-8xl`}
          >
            Tu plataforma
            <br />
            <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              inteligente
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Gestiona productos, genera contenido con IA y administra tu negocio
            desde una sola plataforma moderna y poderosa.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              Comenzar ahora
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Conocer más
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-zinc-600 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-zinc-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
            >
              Todo lo que necesitas
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Una suite completa de herramientas para gestionar y potenciar tu
              negocio con tecnología de punta.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 transition-colors group-hover:bg-indigo-600/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-800 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
          >
            ¿Listo para empezar?
          </h2>
          <p className="mb-8 text-lg text-zinc-400">
            Inicia sesión con tu cuenta de Google y comienza a explorar todas las
            funcionalidades.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
          >
            Iniciar Sesión
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-zinc-500">
          <span>© 2026 myApp. Todos los derechos reservados.</span>
          <span>Hecho con Next.js & IA</span>
        </div>
      </footer>
    </div>
  );
}
