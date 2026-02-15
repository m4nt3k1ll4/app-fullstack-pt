"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3.5 text-sm font-medium text-white transition-all hover:border-zinc-500 hover:bg-zinc-800 active:scale-[0.98]"
    >
      <FcGoogle className="h-5 w-5" />
      Continuar con Google
    </button>
  );
}
