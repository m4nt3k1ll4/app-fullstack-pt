import { FiUsers, FiUserCheck, FiUserX, FiKey } from "react-icons/fi";
import { fetchStatistics } from "@/app/helpers/api";
import { auth } from "@/app/auth";
import { cn } from "@/app/helpers/utils";

const iconMap = {
  total_users: FiUsers,
  approved_users: FiUserCheck,
  pending_users: FiUserX,
  users_with_api_key: FiKey,
};

export async function CardWrapper() {
  const session = await auth();
  const adminToken = session?.user?.adminToken;

  if (!adminToken) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Acceso denegado: se requiere token de administrador.
      </div>
    );
  }

  const res = await fetchStatistics(adminToken);

  if (!res.success || !res.data) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Error al cargar estadísticas: {res.message}
      </div>
    );
  }

  const stats = res.data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Usuarios"
        value={stats.total_users}
        type="total_users"
      />
      <StatCard
        title="Aprobados"
        value={stats.approved_users}
        type="approved_users"
      />
      <StatCard
        title="Pendientes"
        value={stats.pending_users}
        type="pending_users"
      />
      <StatCard
        title="Con API Key"
        value={stats.users_with_api_key}
        type="users_with_api_key"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: keyof typeof iconMap;
}) {
  const Icon = iconMap[type];

  const colorMap = {
    total_users: "text-blue-400 bg-blue-400/10",
    approved_users: "text-emerald-400 bg-emerald-400/10",
    pending_users: "text-amber-400 bg-amber-400/10",
    users_with_api_key: "text-violet-400 bg-violet-400/10",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2.5", colorMap[type])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}
