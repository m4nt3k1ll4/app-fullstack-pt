import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Iniciar Sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
