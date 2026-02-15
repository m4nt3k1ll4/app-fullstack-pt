"use client";

import { CartProvider } from "@/app/components/CartContext";
import { CartDrawer } from "@/app/components/CartDrawer";
import { CartButton } from "@/app/components/CartButton";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

export function CartWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;

  // Solo usuarios normales (no admin) ven el carrito
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {/* Floating cart button */}
      <div className="fixed bottom-6 right-6 z-30 md:bottom-8 md:right-8">
        <CartButton />
      </div>

      {children}

      {/* Cart drawer */}
      <CartDrawer />
    </CartProvider>
  );
}
