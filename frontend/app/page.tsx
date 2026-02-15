import Link from "next/link";
import Header from "@/app/components/Header";
import { bebasNeue } from "@/app/ui/fonts";
import {
  FiZap,
  FiBox,
  FiShield,
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiCpu,
  FiDatabase,
  FiCode,
} from "react-icons/fi";

/* ──────────────────────────── DATA ──────────────────────────── */

/** ✏️  Cambia estos datos por los tuyos */
const profile = {
  name: "Juan Lorenzo Suarez Jimenez",
  title: "Desarrollador Full-Stack",
  city: "Piedecuesta, Colombia",
  bio: "Desarrollador apasionado por la tecnología, la inteligencia artificial y la creación de soluciones digitales modernas. Este proyecto fue construido como prueba técnica full-stack integrando un backend Laravel con un frontend Next.js y modelos de IA generativa.",
  github: "https://github.com/m4nt3k1ll4",
  linkedin: "https://www.linkedin.com/in/m4nt3k1ll4",
};

const techStack = [
  {
    icon: FiCode,
    name: "Next.js 16 + React 19 + Tailwind CSS + Prisma",
    description: "Frontend con App Router, Server Components, Server Actions y Tailwind CSS.",
  },
  {
    icon: FiDatabase,
    name: "Laravel 12 + Supabase",
    description: "Backend REST API con Sanctum, Supabase para la base de datos de nuestra API.",
  },
  {
    icon: FiShield,
    name: "NextAuth.js v6",
    description: "Autenticación con Google OAuth y credenciales, JWT, roles y permisos.",
  },
  {
    icon: FiCpu,
    name: "IA Generativa",
    description: "Generación de descripciones de productos con modelos Gemini de Google.",
  },
];

const aiTools = [
  { name: "GitHub Copilot, claude code", detail: "Asistente de código IA integrado en el IDE." },
  { name: "Google Gemini", detail: "Generación de contenido de productos desde el backend." },
  { name: " VS Code", detail: "Entorno de desarrollo con asistencia IA." },
];

const features = [
  {
    icon: FiZap,
    title: "Inteligencia Artificial",
    description:
      "Genera descripciones de productos con IA usando modelos Gemini de última generación.",
  },
  {
    icon: FiBox,
    title: "Gestión de Productos & Stock",
    description:
      "CRUD completo de productos, inventario con KPIs y control de stock en tiempo real.",
  },
  {
    icon: FiShield,
    title: "Panel de Administración",
    description:
      "Gestión de usuarios, aprobaciones, ventas y estadísticas desde un panel centralizado.",
  },
];

/* ──────────────────────────── PAGE ──────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* ─── Hero / About Me ─── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-indigo-950/30 via-black to-black" />
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <FiMapPin className="h-3.5 w-3.5" />
            {profile.city}
          </div>

          <h1
            className={`${bebasNeue.className} mb-4 text-5xl leading-tight tracking-wider sm:text-6xl md:text-8xl`}
          >
            {profile.name}
          </h1>

          <p className="mb-2 text-lg font-medium text-indigo-400 sm:text-xl">
            {profile.title}
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {profile.bio}
          </p>

          {/* Social Links + CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              Acceder a la app
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiGithub className="h-4 w-4" />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiLinkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-zinc-600 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-zinc-400" />
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section id="stack" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
            >
              Stack Tecnológico
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Las tecnologías y herramientas utilizadas para construir esta plataforma.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 transition-colors group-hover:bg-indigo-600/20">
                  <tech.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold">{tech.name}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="relative border-t border-zinc-800 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2
              className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
            >
              Funcionalidades
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Principales módulos de la aplicación.
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

      {/* ─── AI Tools ─── */}
      <section className="border-t border-zinc-800 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2
              className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
            >
              Herramientas IA utilizadas
            </h2>
            <p className="text-lg text-zinc-400">
              Inteligencia artificial integrada en el desarrollo y en la propia aplicación.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {aiTools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-5 text-center transition-all hover:border-indigo-500/30 hover:bg-zinc-900"
              >
                <FiCpu className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                <h3 className="mb-1 text-sm font-semibold">{tool.name}</h3>
                <p className="text-xs text-zinc-500">{tool.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-zinc-800 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className={`${bebasNeue.className} mb-4 text-4xl tracking-wider sm:text-5xl`}
          >
            ¿Listo para explorar?
          </h2>
          <p className="mb-8 text-lg text-zinc-400">
            Inicia sesión para acceder al catálogo, gestionar productos o revisar
            la documentación completa del proyecto.
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

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <span>© 2026 {profile.name}. Proyecto Full-Stack.</span>
          <div className="flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              <FiGithub className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              <FiLinkedin className="h-4 w-4" />
            </a>
            <span>Hecho con Next.js, Laravel & IA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
