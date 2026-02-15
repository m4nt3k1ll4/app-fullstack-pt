import { env } from "./env";
import type { ApiResponse } from "@/app/types";

const BASE_URL = env.API_BASE_URL;

interface FetchOptions extends RequestInit {
  apiKey?: string;
  adminToken?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { apiKey, adminToken, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
    });

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en API fetch [${endpoint}]:`, error);
    return {
      success: false,
      message: "Error de conexión con el servidor.",
      error: "NETWORK_ERROR",
    } as ApiResponse<T>;
  }
}

// ============================================================
// Auth endpoints
// ============================================================

export async function apiRegister(body: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiLogin(email: string, password: string) {
  return apiFetch<{ user: { id: number; name: string; email: string }; api_key: string; admin_token?: string }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function apiGetMe(apiKey: string) {
  return apiFetch<{ user: { id: number; name: string; email: string; is_approved: boolean } }>(
    "/api/me",
    { apiKey }
  );
}
