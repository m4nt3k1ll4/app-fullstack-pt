"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiCheck, FiX, FiRefreshCw, FiLoader } from "react-icons/fi";
import {
  approveUserAction,
  revokeUserAction,
  deleteUserAction,
  regenerateKeyAction,
} from "@/app/helpers/actions";

export function ApproveUserButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveUserAction(userId);
      if (result.success) router.refresh();
    });
  };

  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      title="Aprobar"
    >
      {isPending ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <FiCheck className="h-4 w-4" />
      )}
    </button>
  );
}

export function RevokeUserButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRevoke = () => {
    if (!confirm("¿Revocar acceso a este usuario?")) return;
    startTransition(async () => {
      const result = await revokeUserAction(userId);
      if (result.success) router.refresh();
    });
  };

  return (
    <button
      onClick={handleRevoke}
      disabled={isPending}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      title="Revocar acceso"
    >
      {isPending ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <FiX className="h-4 w-4" />
      )}
    </button>
  );
}

export function DeleteUserButton({
  userId,
  userName,
}: {
  userId: number;
  userName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`¿Eliminar al usuario "${userName}"?`)) return;
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) router.refresh();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      title="Eliminar"
    >
      {isPending ? (
        <FiLoader className="h-4 w-4 animate-spin" />
      ) : (
        <FiTrash2 className="h-4 w-4" />
      )}
    </button>
  );
}

export function RegenerateKeyButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const [newKey, setNewKey] = useState<string | null>(null);
  const router = useRouter();

  const handleRegenerate = () => {
    if (!confirm("¿Regenerar la API Key de este usuario? La anterior dejará de funcionar.")) return;
    startTransition(async () => {
      const result = await regenerateKeyAction(userId);
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRegenerate}
        disabled={isPending}
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-violet-400 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        title="Regenerar API Key"
      >
        {isPending ? (
          <FiLoader className="h-4 w-4 animate-spin" />
        ) : (
          <FiRefreshCw className="h-4 w-4" />
        )}
      </button>
      {newKey && (
        <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-violet-400 select-all">
          {newKey}
        </code>
      )}
    </div>
  );
}
