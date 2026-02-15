import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { SideNav } from "@/app/components/SideNav";
import { TokenRefresher } from "@/app/components/TokenRefresher";
import { CartWrapper } from "@/app/components/CartWrapper";

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
      {/* Refresh admin token cada 4.5 min */}
      <TokenRefresher />

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-0 h-screen">
          <SideNav />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CartWrapper>
            {children}
          </CartWrapper>
        </div>
      </main>
    </div>
  );
}
