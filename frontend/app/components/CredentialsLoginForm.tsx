"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function CredentialsLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contraseña incorrectos");
        setIsLoading(false);
        return;
      }

      // Fetch updated session to check role
      const { getSession } = await import("next-auth/react");
      const session = await getSession();

      if (session?.user?.isInterviewer) {
        router.push("/dashboard/presentacion");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-zinc-400">
          Email
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 py-3 pl-10 pr-4 text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-zinc-400">
          Contraseña
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 py-3 pl-10 pr-4 text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none"
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
