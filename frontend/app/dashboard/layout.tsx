import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SideNav will go here */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
