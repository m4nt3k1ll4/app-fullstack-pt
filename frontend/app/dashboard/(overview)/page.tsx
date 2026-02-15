import { auth } from "@/app/auth";
import { bebasNeue } from "@/app/ui/fonts";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1
        className={`${bebasNeue.className} mb-6 text-4xl tracking-wider`}
      >
        Dashboard
      </h1>
      <p className="text-zinc-400">
        Bienvenido, {session?.user?.name ?? "Usuario"}.
      </p>
    </div>
  );
}
