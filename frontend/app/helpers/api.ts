import type { ApiResponse, Product, Statistics, UserFull, UserBasic, UserUpdated, Purchase, Stock } from "@/app/types";

const BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
const API_KEY = process.env.API_KEY || "";

interface FetchOptions extends RequestInit {
  apiKey?: string;
  adminToken?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions & { revalidate?: number } = {}
): Promise<ApiResponse<T>> {
  const { apiKey, adminToken, headers: customHeaders, revalidate, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  } else if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const url = `${BASE_URL}${endpoint}`;

  // Use Next.js fetch cache: revalidate for GET requests, no-store for mutations
  const cacheOptions: RequestInit = rest.method && rest.method !== "GET"
    ? { cache: "no-store" as const }
    : revalidate !== undefined
      ? { next: { revalidate } }
      : { cache: "no-store" as const };

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
      ...cacheOptions,
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

export async function apiLogin(email: string, password: string) {
  return apiFetch<{ user: { id: number; name: string; email: string; role?: string }; api_key: string; admin_token?: string }>(
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

// ============================================================
// Products endpoints
// ============================================================

export async function fetchProducts(params?: {
  search?: string;
  min_price?: number;
  max_price?: number;
  per_page?: number;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.min_price) query.set("min_price", String(params.min_price));
  if (params?.max_price) query.set("max_price", String(params.max_price));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<Product[]>(`/api/products${qs ? `?${qs}` : ""}`, { apiKey: API_KEY, revalidate: 30 });
}

export async function fetchProductById(id: number) {
  return apiFetch<Product>(`/api/products/${id}`, { apiKey: API_KEY, revalidate: 60 });
}

export async function createProduct(body: {
  name: string;
  features?: string;
  price?: number;
  ai_description?: string;
  images?: string[];
}) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    apiKey: API_KEY,
    body: JSON.stringify(body),
  });
}

export async function updateProduct(id: number, body: {
  name?: string;
  features?: string;
  price?: number;
  ai_description?: string;
  images?: string[];
}) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PUT",
    apiKey: API_KEY,
    body: JSON.stringify(body),
  });
}

export async function deleteProduct(id: number) {
  return apiFetch<null>(`/api/products/${id}`, {
    method: "DELETE",
    apiKey: API_KEY,
  });
}

export async function searchProducts(term: string) {
  return apiFetch<Product[]>(`/api/products/search/${encodeURIComponent(term)}`, {
    apiKey: API_KEY,
  });
}

export async function generateProductDescription(id: number) {
  return apiFetch<Product>(`/api/products/${id}/generate-description`, {
    method: "POST",
    apiKey: API_KEY,
  });
}

// ============================================================
// AI endpoints
// ============================================================

export async function sendAIPrompt(body: {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}) {
  return apiFetch<{ response: string; model: string; usage: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number } }>(
    "/api/ai/prompt",
    {
      method: "POST",
      apiKey: API_KEY,
      body: JSON.stringify(body),
    }
  );
}

// ============================================================
// Admin endpoints (reciben el token desde la session)
// ============================================================

export async function fetchStatistics(adminToken: string) {
  return apiFetch<Statistics>("/api/admin/statistics", { adminToken });
}

export async function fetchUsers(
  adminToken: string,
  params?: {
    is_approved?: "true" | "false";
    search?: string;
    per_page?: number;
    page?: number;
  }
) {
  const query = new URLSearchParams();
  if (params?.is_approved) query.set("is_approved", params.is_approved);
  if (params?.search) query.set("search", params.search);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<UserFull[]>(`/api/admin/users${qs ? `?${qs}` : ""}`, { adminToken });
}

export async function fetchPendingUsers(
  adminToken: string,
  params?: { per_page?: number; page?: number }
) {
  const query = new URLSearchParams();
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<UserFull[]>(`/api/admin/users/pending${qs ? `?${qs}` : ""}`, { adminToken });
}

export async function fetchUserById(adminToken: string, id: number) {
  return apiFetch<UserFull>(`/api/admin/users/${id}`, { adminToken });
}

export async function adminUpdateUser(adminToken: string, id: number, body: { name?: string; email?: string; role?: string }) {
  return apiFetch<UserUpdated>(`/api/admin/users/${id}`, {
    method: "PUT",
    adminToken,
    body: JSON.stringify(body),
  });
}

export async function adminDeleteUser(adminToken: string, id: number) {
  return apiFetch<null>(`/api/admin/users/${id}`, {
    method: "DELETE",
    adminToken,
  });
}

export async function adminApproveUser(adminToken: string, id: number) {
  return apiFetch<{ user: UserBasic & { created_at: string }; api_key: string; already_approved: boolean }>(
    `/api/admin/users/${id}/approve`,
    { method: "POST", adminToken }
  );
}

export async function adminRevokeUser(adminToken: string, id: number) {
  return apiFetch<UserBasic>(`/api/admin/users/${id}/revoke`, {
    method: "POST",
    adminToken,
  });
}

export async function adminRegenerateKey(adminToken: string, id: number) {
  return apiFetch<{ user: UserBasic; api_key: string }>(
    `/api/admin/users/${id}/regenerate-key`,
    { method: "POST", adminToken }
  );
}

// ============================================================
// Stock endpoints
// ============================================================

export async function fetchStockByProduct(productId: number) {
  return apiFetch<Stock>(`/api/stocks/product/${productId}`, { apiKey: API_KEY, revalidate: 30 });
}

export async function fetchAllStocks(
  params?: {
    search?: string;
    per_page?: number;
    page?: number;
  }
) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<Stock[]>(`/api/stocks${qs ? `?${qs}` : ""}`, { apiKey: API_KEY });
}

export async function createStock(data: {
  product_id: number;
  stock: number;
  unit_value: number;
  sale_value: number;
}) {
  return apiFetch<Stock>("/api/stocks", {
    method: "POST",
    apiKey: API_KEY,
    body: JSON.stringify(data),
  });
}

export async function updateStock(
  id: number,
  data: {
    stock?: number;
    unit_value?: number;
    sale_value?: number;
  }
) {
  return apiFetch<Stock>(`/api/stocks/${id}`, {
    method: "PUT",
    apiKey: API_KEY,
    body: JSON.stringify(data),
  });
}

export async function deleteStock(id: number) {
  return apiFetch<null>(`/api/stocks/${id}`, {
    method: "DELETE",
    apiKey: API_KEY,
  });
}

// ============================================================
// Purchase endpoints (cliente — usan API_KEY global y pasan user_email)
// ============================================================

export async function createPurchase(
  userEmail: string,
  userName: string,
  items: { product_id: number; quantity: number }[]
) {
  return apiFetch<Purchase>("/api/purchases", {
    method: "POST",
    apiKey: API_KEY,
    body: JSON.stringify({ user_email: userEmail, user_name: userName, items }),
  });
}

export async function fetchMyPurchases(
  userEmail: string,
  params?: {
    status?: string;
    per_page?: number;
    page?: number;
  }
) {
  const query = new URLSearchParams();
  query.set("user_email", userEmail);
  if (params?.status) query.set("status", params.status);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<Purchase[]>(`/api/purchases/my?${qs}`, { apiKey: API_KEY });
}

export async function fetchMyPurchaseById(userEmail: string, id: number) {
  return apiFetch<Purchase>(`/api/purchases/my/${id}?user_email=${encodeURIComponent(userEmail)}`, { apiKey: API_KEY });
}

// ============================================================
// Admin Purchase/Sales endpoints
// ============================================================

export async function fetchAllPurchases(
  adminToken: string,
  params?: {
    status?: string;
    user_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }
) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.user_id) query.set("user_id", String(params.user_id));
  if (params?.search) query.set("search", params.search);
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiFetch<Purchase[]>(`/api/admin/purchases${qs ? `?${qs}` : ""}`, { adminToken });
}

export async function fetchPurchaseById(adminToken: string, id: number) {
  return apiFetch<Purchase>(`/api/admin/purchases/${id}`, { adminToken });
}
