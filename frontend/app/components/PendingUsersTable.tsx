import { fetchPendingUsers } from "@/app/helpers/api";
import { auth } from "@/app/auth";
import { formatDate } from "@/app/helpers/utils";
import { FiUserCheck } from "react-icons/fi";
import { ApproveUserButton, DeleteUserButton } from "./UserActions";

export async function PendingUsersTable({
  currentPage,
}: {
  currentPage: number;
}) {
  const session = await auth();
  const adminToken = session?.user?.adminToken ?? "";
  const res = await fetchPendingUsers(adminToken, { page: currentPage, per_page: 10 });

  if (!res.success || !res.data) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Error al cargar usuarios pendientes: {res.message}
      </div>
    );
  }

  const users = res.data;

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiUserCheck className="mb-3 h-12 w-12" />
        <p className="text-lg">No hay usuarios pendientes</p>
        <p className="mt-1 text-sm">
          Todos los usuarios han sido procesados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                Roles
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                Registro
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-zinc-200">
                    {user.name}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-zinc-400">{user.email}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-zinc-500">
                    {formatDate(user.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <ApproveUserButton userId={user.id} />
                    <DeleteUserButton userId={user.id} userName={user.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
