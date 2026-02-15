import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

/**
 * Layout protector para rutas /dashboard/products/*
 * Solo admin puede gestionar productos (CRUD).
 */
export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.isAdmin && !session?.user?.isInterviewer) {
    redirect("/dashboard/catalogo");
  }

  return <>{children}</>;
}
