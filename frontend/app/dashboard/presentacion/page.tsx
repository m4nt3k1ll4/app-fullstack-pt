import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import {
  FiMail,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiDownload,
  FiExternalLink,
  FiBook,
  FiAward,
  FiBriefcase,
  FiBox,
  FiCode,
  FiCpu,
  FiDatabase,
  FiPlay,
  FiServer,
  FiGlobe,
  FiLock,
  FiInfo,
  FiLayers,
  FiMessageSquare,
} from "react-icons/fi";

/* ──────────────────────────── DATA ──────────────────────────── */

/* ─── Infraestructura ─── */

const infraestructura = [
  {
    icon: FiGlobe,
    servicio: "Vercel",
    rol: "Frontend (Next.js)",
    descripcion:
      "Hosting del frontend con despliegue automático desde GitHub. Vercel es la plataforma nativa de Next.js y ofrece edge functions, ISR (Incremental Static Regeneration) y previews por branch.",
  },
  {
    icon: FiServer,
    servicio: "Railway",
    rol: "Backend (Laravel)",
    descripcion:
      "Hosting del backend PHP/Laravel con base de datos MySQL integrada. Railway permite desplegar aplicaciones con su propia base de datos relacional, ideal para la API REST con Sanctum.",
  },
  {
    icon: FiDatabase,
    servicio: "Supabase",
    rol: "Base de datos del Frontend (PostgreSQL)",
    descripcion:
      "Base de datos PostgreSQL para el frontend con Prisma ORM. Supabase ofrece una capa gestionada de Postgres que se integra nativamente con NextAuth.js para sesiones, cuentas OAuth y datos de usuario.",
  },
];

/* ─── Decisiones Arquitectónicas ─── */

const decisiones = [
  {
    pregunta: "¿Por qué dos bases de datos?",
    respuesta:
      "El backend Laravel (Railway+Supabase) gestiona la lógica de negocio: productos, stock, ventas, roles y autenticación de la API. El frontend Next.js necesita su propia persistencia (Supabase/PostgreSQL) para NextAuth.js (sesiones, cuentas OAuth, tokens JWT) y para almacenar datos exclusivos del frontend como compras del carrito. Separar ambas permite que cada capa evolucione de forma independiente: si se cambia el backend, el frontend mantiene su autenticación intacta y viceversa.",
  },
  {
    pregunta: "¿Por qué Next.js + Laravel en lugar de un monolito?",
    respuesta:
      "La arquitectura desacoplada permite que el frontend use Server Components y Server Actions de Next.js para rendimiento óptimo (SSR, ISR, streaming), mientras que el backend Laravel se enfoca exclusivamente en la API REST, validación de negocio y generación de IA. Esto simula un entorno real de trabajo donde frontend y backend son equipos/repos independientes.",
  },
  {
    pregunta: "¿Por qué NextAuth.js + Sanctum en lugar de un solo sistema?",
    respuesta:
      "NextAuth.js maneja la autenticación del frontend (Google OAuth, sesiones JWT, refresh tokens) de forma nativa en Next.js. Sanctum protege la API Laravel con tokens que expiran en 5 minutos. La combinación permite multi-proveedor (Google para usuarios, credenciales para admin/entrevistador) sin acoplar el frontend a Laravel.",
  },
  {
    pregunta: "¿Por qué Prisma y no solo Eloquent?",
    respuesta:
      "Prisma es el ORM estándar del ecosistema Node.js/TypeScript. Nos da tipado completo end-to-end, migraciones declarativas y una API de queries type-safe que se integra perfectamente con Server Components. Eloquent sigue siendo el ORM del backend Laravel. Cada capa usa el ORM idóneo para su ecosistema.",
  },
];

/* ─── Indicaciones para el entrevistador ─── */

const indicaciones = [
  {
    titulo: "Rol de Entrevistador",
    detalle:
      "Se le ha asignado el rol 'interviewer' a sus credenciales. Este rol otorga acceso completo tanto a la vista de usuario (catálogo, carrito, historial de compras) como a la vista de administración (dashboard, productos, inventario, usuarios, ventas). Puede navegar libremente por todas las secciones de la aplicación.",
  },
  {
    titulo: "Navegación",
    detalle:
      "En el menú lateral encontrará acceso directo a esta Presentación y al Catálogo. Además, puede modificar la URL manualmente para acceder a cualquier ruta del dashboard (/dashboard, /dashboard/products, /dashboard/admin/stock, etc.) y verá el contenido completo.",
  },
  {
    titulo: "Flujo de Compra",
    detalle:
      "Puede probar el flujo completo de compra: navegar el catálogo, añadir productos al carrito, ver el modal de detalle con stock disponible y realizar una compra. Su historial se almacena en 'Mis Compras'.",
  },
  {
    titulo: "Generación IA",
    detalle:
      "Desde la vista de productos (admin), puede generar descripciones con IA usando Google Gemini. El backend Laravel envía el prompt al modelo y devuelve la descripción generada.",
  },
];

/* ─── Integraciones técnicas ─── */

const integraciones = [
  {
    icon: FiCpu,
    nombre: "Google Gemini API",
    descripcion: "Generación de descripciones de productos con IA generativa desde el backend Laravel.",
  },
  {
    icon: FiDatabase,
    nombre: "Dual Database (Prisma + Eloquent)",
    descripcion:
      "Prisma ORM → Supabase (PostgreSQL) para el frontend. Eloquent ORM → Railway (MySQL) para el backend. Sincronizados vía API REST.",
  },
  {
    icon: FiCode,
    nombre: "NextAuth.js v5 + Sanctum",
    descripcion:
      "Autenticación multi-proveedor: Google OAuth para usuarios, credenciales para admin/entrevistador, Sanctum para proteger la API.",
  },
  {
    icon: FiLock,
    nombre: "Roles y Permisos",
    descripcion:
      "Sistema de 3 roles (admin, client, interviewer) con middleware en Laravel y sesiones JWT en NextAuth. El token de admin/interviewer expira cada 5 min y se refresca automáticamente.",
  },
];

const proyectoHighlights = [
  "CRUD completo de productos con generación IA de descripciones",
  "Gestión de inventario/stock con KPIs en tiempo real",
  "Catálogo público con carrito de compras y historial",
  "Panel de administración con gestión de usuarios y ventas",
  "Rol de entrevistador con zona protegida de presentación",
  "Arquitectura dual-database (Prisma + Eloquent)",
  "Caching optimizado con Next.js ISR (revalidate 30-60s)",
  "Autenticación multi-rol con refresh automático de tokens",
  "Asignación de roles desde el panel de admin",
  "Despliegue en producción: Vercel + Railway + Supabase",
];

/* ─── Datos personales ─── */

const contacto = {
  email: "juanlorenzo.suarez@gmail.com",
  phone: "+57 310 886 0830",
  whatsapp: "https://wa.me/573108860830",
  github: "https://github.com/m4nt3k1ll4",
  linkedin: "https://www.linkedin.com/in/m4nt3k1ll4",
  cvUrl: "/CV_FULLSTACK_JUAN_SUAREZ_ES (3).pdf",
};

const sobreMi = {
  nombre: "Juan Lorenzo Suárez Jiménez",
  titulo: "Desarrollador Full-Stack",
  resumen:
    "Desarrollador Full Stack con 2 años de experiencia en el desarrollo y mantenimiento de aplicaciones web en producción, utilizando arquitecturas modernas incluyendo serverless. Experiencia práctica con Angular, React y Next.js para el frontend, Laravel y Cloudflare Workers para el backend. Implementación e integración de APIs REST, manejo de bases de datos y desarrollo de automatizaciones backend. Enfoque en calidad de código, escalabilidad y mejora continua.",
};

const experiencia = [
  {
    puesto: "Full-Stack Developer",
    empresa: "DAITECH SAS",
    periodo: "Feb 2025 — Actualidad",
    descripcion:
      "Desarrollo de aplicaciones web con React y Next.js. Implementación de funciones backend bajo arquitectura serverless utilizando Cloudflare Workers. Integración de Supabase para autenticación y persistencia de datos. Automatización de procesos backend mediante n8n.",
  },
  {
    puesto: "Desarrollador Full-Stack Freelance",
    empresa: "Freelance",
    periodo: "2024 — 2025",
    descripcion:
      "Desarrollo de un SaaS de gestión de tareas con Laravel (API RESTful) y Angular. Diseño de endpoints, lógica de negocio y persistencia de datos en MySQL. Consumo de APIs REST y manejo de estado en frontend con TypeScript.",
  },
  {
    puesto: "Analista de Marketing",
    empresa: "Crosstraining Piedecuesta",
    periodo: "Mar 2024 — Feb 2025",
    descripcion:
      "Análisis de métricas digitales y rendimiento de campañas. Comunicación con equipos multidisciplinarios. Gestión de prioridades y cumplimiento de objetivos. Enfoque en experiencia de usuario y optimización de procesos.",
  },
  {
    puesto: "Auxiliar / Líder de Rampa",
    empresa: "Menzies Aviation Colombia",
    periodo: "Mar 2022 — Jul 2023",
    descripcion:
      "Liderazgo operativo durante operaciones en plataforma. Coordinación de equipos en entornos de alta presión y tiempos críticos. Supervisión del cumplimiento de protocolos de seguridad.",
  },
];

const formacion = [
  {
    titulo: "Técnico en Programación de Software",
    centro: "Servicio Nacional de Aprendizaje (SENA)",
    periodo: "",
  },
  {
    titulo: "PCAP – Programming Essentials in Python",
    centro: "Cisco Networking Academy",
    periodo: "",
  },
];

const conocimientos = {
  frontend: ["React", "Next.js", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  backend: ["PHP", "Laravel", "Cloudflare Workers", "Supabase", "n8n"],
  databases: ["MySQL", "PostgreSQL"],
  tools: ["Git", "GitHub", "Linux", "Docker", "Insomnia"],
};

const proyectos = [
  {
    nombre: "CrossTaskManager",
    descripcion:
      "SaaS de gestión de tareas con backend en Laravel y frontend en Angular. Incluye gestión de usuarios, tareas y estados, con arquitectura RESTful y base de datos MySQL.",
  },
  {
    nombre: "Humbertoss (Producción)",
    descripcion:
      "Landing page orientada a conversión y contacto comercial.",
  },
  {
    nombre: "OfMedicalSAS (Producción)",
    descripcion:
      "Sitio web con catálogo y carrito de cotización integrado a WhatsApp para atención personalizada.",
  },
  {
    nombre: "QUIROGAABOGADOS (Producción)",
    descripcion:
      "Sitio web de presentación para la firma Quiroga Abogados Asociados con redirección a WhatsApp con mensaje precargado.",
  },
];

/** ✏️  Pon el ID de tu video de YouTube (la parte después de v=) */
const youtubeVideoId = ""; // Ej: "dQw4w9WgXcQ"

/* ──────────────────────────── PAGE ──────────────────────────── */

export default async function PresentacionPage() {
  const session = await auth();

  // Solo accesible para interviewers y admins
  if (!session?.user?.isInterviewer && !session?.user?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-10">
      {/* ─── Header ─── */}
      <div>
        <h1
          className={`${bebasNeue.className} text-4xl tracking-wider sm:text-5xl`}
        >
          Presentación del Proyecto
        </h1>
        <p className="mt-2 text-zinc-400">
          Arquitectura, decisiones técnicas, infraestructura y documentación completa.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 1: PROYECTO (lo más importante)
          ═══════════════════════════════════════════════════════════ */}

      {/* ─── Indicaciones para el Entrevistador ─── */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-amber-300">
          <FiInfo className="h-5 w-5" />
          Indicaciones para el Entrevistador
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {indicaciones.map((ind) => (
            <div
              key={ind.titulo}
              className="rounded-xl border border-amber-500/20 bg-black/20 p-5"
            >
              <h3 className="mb-1.5 text-sm font-semibold text-amber-200">{ind.titulo}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{ind.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Infraestructura / Despliegue ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiServer className="h-5 w-5 text-indigo-400" />
          Infraestructura y Despliegue
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {infraestructura.map((inf) => (
            <div
              key={inf.servicio}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <inf.icon className="mb-3 h-6 w-6 text-indigo-400" />
              <h3 className="mb-0.5 text-sm font-semibold">{inf.servicio}</h3>
              <p className="mb-2 text-xs font-medium text-indigo-400">{inf.rol}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{inf.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Decisiones Arquitectónicas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiLayers className="h-5 w-5 text-indigo-400" />
          Decisiones Arquitectónicas
        </h2>
        <div className="space-y-5">
          {decisiones.map((d) => (
            <div
              key={d.pregunta}
              className="rounded-xl border border-zinc-800 bg-black/20 p-5"
            >
              <h3 className="mb-2 text-sm font-semibold text-indigo-300">{d.pregunta}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{d.respuesta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Integraciones técnicas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiCode className="h-5 w-5 text-indigo-400" />
          Integraciones Técnicas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integraciones.map((int) => (
            <div
              key={int.nombre}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <int.icon className="mb-3 h-6 w-6 text-indigo-400" />
              <h3 className="mb-1 text-sm font-semibold">{int.nombre}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                {int.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Funcionalidades Destacadas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBook className="h-5 w-5 text-indigo-400" />
          Funcionalidades Destacadas
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {proyectoHighlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-sm text-zinc-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {h}
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Video Presentación ─── */}
      {youtubeVideoId && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FiPlay className="h-5 w-5 text-indigo-400" />
            Video Presentación
          </h2>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="Video Presentación"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 2: SOBRE EL CANDIDATO
          ═══════════════════════════════════════════════════════════ */}

      {/* ─── Separador ─── */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className={`${bebasNeue.className} text-xl tracking-wider text-zinc-500`}>
          Sobre el Candidato
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* ─── Contact Card ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{sobreMi.nombre}</h2>
            <p className="mt-1 text-sm font-medium text-indigo-400">
              {sobreMi.titulo}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {sobreMi.resumen}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <a
              href={`mailto:${contacto.email}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              <FiMail className="h-4 w-4 text-indigo-400" />
              {contacto.email}
            </a>
            <a
              href={`tel:${contacto.phone}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              <FiPhone className="h-4 w-4 text-indigo-400" />
              {contacto.phone}
            </a>
            <div className="mt-2 flex gap-2">
              <a
                href={contacto.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href={contacto.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiLinkedin className="h-4 w-4" />
              </a>
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiMessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* CV Download */}
        {contacto.cvUrl && (
          <a
            href={contacto.cvUrl}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            <FiDownload className="h-4 w-4" />
            Descargar CV (PDF)
          </a>
        )}
      </section>

      {/* ─── Experiencia ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBriefcase className="h-5 w-5 text-indigo-400" />
          Experiencia Profesional
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {experiencia.map((exp) => (
            <div
              key={exp.puesto + exp.empresa}
              className="border-l-2 border-indigo-600/30 pl-4"
            >
              <h3 className="text-sm font-semibold">{exp.puesto}</h3>
              <p className="text-xs text-indigo-400">
                {exp.empresa} · {exp.periodo}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {exp.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Conocimientos Técnicos & Formación ─── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Conocimientos */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <FiCode className="h-5 w-5 text-indigo-400" />
            Conocimientos Técnicos
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Frontend</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.frontend.map((t) => (
                  <span key={t} className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Backend / Serverless</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.backend.map((t) => (
                  <span key={t} className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Bases de Datos</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.databases.map((t) => (
                  <span key={t} className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Herramientas</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.tools.map((t) => (
                  <span key={t} className="rounded-md bg-zinc-700/50 px-2.5 py-1 text-xs font-medium text-zinc-300">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Formación */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <FiAward className="h-5 w-5 text-indigo-400" />
            Formación Académica
          </h2>
          <div className="space-y-6">
            {formacion.map((f) => (
              <div
                key={f.titulo + f.centro}
                className="border-l-2 border-indigo-600/30 pl-4"
              >
                <h3 className="text-sm font-semibold">{f.titulo}</h3>
                <p className="text-xs text-indigo-400">
                  {f.centro}{f.periodo ? ` · ${f.periodo}` : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Idiomas */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h3 className="mb-3 text-sm font-semibold">Idiomas</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Español</span>
                <span className="text-indigo-400">Nativo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Inglés</span>
                <span className="text-zinc-400">Básico – Técnico (lectura de documentación)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Otros Proyectos ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBox className="h-5 w-5 text-indigo-400" />
          Otros Proyectos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {proyectos.map((p) => (
            <div
              key={p.nombre}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <h3 className="mb-1.5 text-sm font-semibold">{p.nombre}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{p.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Links útiles ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <FiExternalLink className="h-5 w-5 text-indigo-400" />
          Recursos
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/m4nt3k1ll4/app-fullstack-pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <FiGithub className="h-4 w-4" />
            Repositorio del Proyecto
          </a>
          <a
            href={contacto.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <FiLinkedin className="h-4 w-4" />
            Perfil LinkedIn
          </a>
          {contacto.cvUrl && (
            <a
              href={contacto.cvUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <FiDownload className="h-4 w-4" />
              Descargar CV
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
