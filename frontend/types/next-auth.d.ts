import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      apiKey?: string;
      adminToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin?: boolean;
    apiKey?: string;
    adminToken?: string;
    backendPassword?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isAdmin?: boolean;
    apiKey?: string;
    adminToken?: string;
    adminTokenExpiry?: number;
    backendEmail?: string;
    backendPassword?: string;
  }
}
