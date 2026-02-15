import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import CredentialsLoginForm from "@/app/components/CredentialsLoginForm";
import Logo from "@/app/components/Logo";
import { bebasNeue } from "@/app/ui/fonts";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left panel — Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-indigo-950 via-black to-black p-12 lg:flex">
        <div className="pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full bg-indigo-600/10 blur-[120px]" />
        <Logo />
        <div className="relative z-10">
          <h2
            className={`${bebasNeue.className} mb-4 text-5xl leading-tight tracking-wider`}
          >
            Gestiona tu negocio
            <br />
            con IA
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-zinc-400">
            Accede a tu panel de control, gestiona productos y genera contenido
            inteligente en segundos.
          </p>
        </div>
        <p className="text-sm text-zinc-600">
          © 2026 myApp. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel — Login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <h1 className="mb-2 text-2xl font-bold">Iniciar Sesión</h1>
          <p className="mb-8 text-sm text-zinc-400">
            Usa tu email y contraseña, o continúa con Google.
          </p>

          {/* Credentials Login Form */}
          <CredentialsLoginForm />

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">O</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />

          <p className="mt-6 text-center text-xs text-zinc-600">
            Al continuar, aceptas nuestros términos de servicio y política de
            privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
