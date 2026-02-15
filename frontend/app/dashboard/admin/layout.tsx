import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

/**
 * Layout protector para rutas /dashboard/admin/*
 * Solo permite acceso a usuarios con admin_token.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/dashboard/catalogo");
  }

  return <>{children}</>;
}
