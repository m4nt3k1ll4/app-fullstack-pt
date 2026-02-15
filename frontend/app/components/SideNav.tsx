import Logo from "@/app/components/Logo";
import { NavLinks } from "@/app/components/NavLinks";
import { logOut } from "@/app/helpers/actions";
import { FiPower, FiShield, FiUser } from "react-icons/fi";
import { auth } from "@/app/auth";

export async function SideNav() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin ?? false;

  return (
    <div className="flex h-full flex-col bg-zinc-900 border-r border-zinc-800">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-800">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavLinks />
      </nav>

      {/* User & Logout */}
      <div className="border-t border-zinc-800 px-4 py-4">
        {session?.user && (
          <div className="mb-3 px-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {session.user.name}
              </p>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-400/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 uppercase">
                  <FiShield className="h-2.5 w-2.5" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 uppercase">
                  <FiUser className="h-2.5 w-2.5" />
                  Usuario
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 truncate">
              {session.user.email}
            </p>
          </div>
        )}
        <form action={logOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
          >
            <FiPower className="h-5 w-5" />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
}
