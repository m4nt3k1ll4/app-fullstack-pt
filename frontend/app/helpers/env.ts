import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    API_BASE_URL: process.env.API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });

  if (!parsed.success) {
    console.error(
      "❌ Variables de entorno inválidas:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Variables de entorno inválidas");
  }

  return parsed.data;
}

export const env = validateEnv();
