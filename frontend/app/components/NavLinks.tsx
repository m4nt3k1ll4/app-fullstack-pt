"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/app/helpers/utils";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiUserCheck,
  FiShoppingBag,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi";

const adminLinks = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Productos", href: "/dashboard/products", icon: FiBox },
  { name: "Inventario", href: "/dashboard/admin/stock", icon: FiPackage },
  { name: "Usuarios", href: "/dashboard/admin/users", icon: FiUsers },
  { name: "Pendientes", href: "/dashboard/admin/users/pending", icon: FiUserCheck },
  { name: "Ventas", href: "/dashboard/admin/ventas", icon: FiDollarSign },
];

const interviewerLinks = [
  { name: "Presentación", href: "/dashboard/presentacion", icon: FiBriefcase },
  { name: "API Docs", href: "/dashboard/api-docs", icon: FiFileText },
  // — Admin —
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Productos", href: "/dashboard/products", icon: FiBox },
  { name: "Inventario", href: "/dashboard/admin/stock", icon: FiPackage },
  { name: "Usuarios", href: "/dashboard/admin/users", icon: FiUsers },
  { name: "Pendientes", href: "/dashboard/admin/users/pending", icon: FiUserCheck },
  { name: "Ventas", href: "/dashboard/admin/ventas", icon: FiDollarSign },
  // — Usuario —
  { name: "Catálogo", href: "/dashboard/catalogo", icon: FiShoppingBag },
  { name: "Mis Compras", href: "/dashboard/mis-compras", icon: FiShoppingCart },
];

const userLinks = [
  { name: "Catálogo", href: "/dashboard/catalogo", icon: FiShoppingBag },
  { name: "Mis Compras", href: "/dashboard/mis-compras", icon: FiShoppingCart },
];

export function NavLinks() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.isAdmin ?? false;
  const isInterviewer = session?.user?.isInterviewer ?? false;
  const links = isAdmin ? adminLinks : isInterviewer ? interviewerLinks : userLinks;

  return (
    <ul className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(link.href);

        return (
          <li key={link.name}>
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{link.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
