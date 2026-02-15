"use client";

import { useState, type ReactNode } from "react";
import { FiBriefcase, FiUsers } from "react-icons/fi";

type Tab = "corporativo" | "usuarios";

interface LoginTabsProps {
  corporativeForm: ReactNode;
  userButton: ReactNode;
}

export default function LoginTabs({
  corporativeForm,
  userButton,
}: LoginTabsProps) {
  const [active, setActive] = useState<Tab>("corporativo");

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-6 flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
        <button
          type="button"
          onClick={() => setActive("corporativo")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
            active === "corporativo"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiBriefcase className="h-4 w-4" />
          Acceso Corporativo
        </button>
        <button
          type="button"
          onClick={() => setActive("usuarios")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
            active === "usuarios"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FiUsers className="h-4 w-4" />
          Acceso Usuarios
        </button>
      </div>

      {/* Tab content */}
      {active === "corporativo" ? (
        <div>
          <p className="mb-4 text-xs text-zinc-500">
            Ingresa con tus credenciales corporativas para acceder al panel de
            administración.
          </p>
          {corporativeForm}
        </div>
      ) : (
        <div>
          <p className="mb-4 text-xs text-zinc-500">
            Usa tu cuenta de Google para explorar el catálogo de productos.
          </p>
          {userButton}
        </div>
      )}
    </div>
  );
}
