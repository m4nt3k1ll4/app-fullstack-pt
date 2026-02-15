import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/helpers/db";
import { z } from "zod";
import { apiLogin } from "@/app/helpers/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function refreshAdminToken(email: string, password: string) {
  try {
    const res = await apiLogin(email, password);
    if (res.success && res.data?.admin_token) {
      return {
        adminToken: res.data.admin_token,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
    }
  } catch (e) {
    console.error("Error refreshing admin token:", e);
  }
  return null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Autenticar contra el backend
        const res = await apiLogin(email, password);

        if (!res.success || !res.data) {
          return null;
        }

        const { user, api_key, admin_token } = res.data;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          isAdmin: !!admin_token,
          apiKey: api_key,
          adminToken: admin_token || undefined,
          backendPassword: password,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Login inicial — guardar datos del backend
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin ?? false;
        token.apiKey = user.apiKey;
        token.adminToken = user.adminToken;
        token.adminTokenExpiry = user.adminToken
          ? Date.now() + 5 * 60 * 1000
          : undefined;
        token.backendEmail = user.email ?? undefined;
        token.backendPassword = user.backendPassword;
      }

      // Refresh admin token si está por expirar (30s de buffer)
      if (
        token.isAdmin &&
        token.adminTokenExpiry &&
        token.backendEmail &&
        token.backendPassword &&
        Date.now() > (token.adminTokenExpiry as number) - 30_000
      ) {
        const refreshed = await refreshAdminToken(
          token.backendEmail as string,
          token.backendPassword as string
        );
        if (refreshed) {
          token.adminToken = refreshed.adminToken;
          token.adminTokenExpiry = refreshed.expiresAt;
        } else {
          // Token no se pudo refrescar — revocar admin
          token.isAdmin = false;
          token.adminToken = undefined;
          token.adminTokenExpiry = undefined;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
        session.user.apiKey = token.apiKey as string | undefined;
        session.user.adminToken = token.adminToken as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
