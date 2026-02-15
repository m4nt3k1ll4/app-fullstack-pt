"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Componente invisible que refresca el admin_token cada 4.5 minutos.
 * Al llamar update(), NextAuth ejecuta el JWT callback que auto-refresca
 * el token si está por expirar.
 */
export function TokenRefresher() {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (!session?.user?.isAdmin) return;

    // Refrescar cada 4.5 minutos (el token dura 5 min)
    const interval = setInterval(
      () => {
        update();
      },
      4.5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [session?.user?.isAdmin, update]);

  return null;
}
