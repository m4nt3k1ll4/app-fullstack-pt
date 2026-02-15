"use server";

import { signIn, signOut } from "@/app/auth";

export async function authenticate() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}
