import { fetchUsers } from "@/app/helpers/api";
import { auth } from "@/app/auth";
import { formatDate } from "@/app/helpers/utils";
import { FiUsers } from "react-icons/fi";
import {
  ApproveUserButton,
  RevokeUserButton,
  DeleteUserButton,
  RegenerateKeyButton,
  ChangeRoleSelect,
} from "./UserActions";

export async function UsersTable({
  search,
  currentPage,
}: {
  search: string;
  currentPage: number;
}) {
  const session = await auth();
  const adminToken = session?.user?.adminToken ?? "";
  const res = await fetchUsers(adminToken, { search, page: currentPage, per_page: 10 });

  if (!res.success || !res.data) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Error al cargar usuarios: {res.message}
      </div>
    );
  }

  const users = res.data;

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-zinc-500">
        <FiUsers className="mb-3 h-12 w-12" />
        <p className="text-lg">No se encontraron usuarios</p>
        {search && (
          <p className="mt-1 text-sm">
            No hay resultados para &quot;{search}&quot;
          </p>
        )}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                Roles
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
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
                <td className="px-4 py-3">
                  {user.is_approved ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Aprobado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <ChangeRoleSelect
                    userId={user.id}
                    currentRole={user.roles[0]?.name ?? "client"}
                  />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-zinc-500">
                    {formatDate(user.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    {!user.is_approved ? (
                      <ApproveUserButton userId={user.id} />
                    ) : (
                      <>
                        <RevokeUserButton userId={user.id} />
                        <RegenerateKeyButton userId={user.id} />
                      </>
                    )}
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
