// ============================================================
// API Response Base
// ============================================================

export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
  errors?: Record<string, string[]>;
}

// ============================================================
// Paginación
// ============================================================

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============================================================
// Usuarios
// ============================================================

export interface UserMinimal {
  id: number;
  name: string;
  email: string;
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
  is_approved: boolean;
}

export interface UserFull {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  roles: RoleWithPivot[];
}

export interface UserUpdated {
  id: number;
  name: string;
  email: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Roles
// ============================================================

export interface Role {
  id: number;
  name: "admin" | "client";
  created_at: string;
  updated_at: string;
}

export interface RoleWithPivot extends Role {
  pivot: {
    user_id: number;
    role_id: number;
  };
}

// ============================================================
// Autenticación
// ============================================================

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  user: UserMinimal;
  api_key: string;
  admin_token?: string;
  admin_token_type?: "Bearer";
  admin_token_expires_in?: string;
}

export interface LoginResponse {
  success: true;
  message: string;
  data: LoginData;
}

// ============================================================
// Productos
// ============================================================

export interface Product {
  id: number;
  name: string;
  features: string | null;
  price: string;
  ai_description: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  features?: string;
  price?: number;
  ai_description?: string;
  images?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  features?: string;
  price?: number;
  ai_description?: string;
  images?: string[];
}

export interface ProductListResponse {
  success: true;
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductShowResponse {
  success: true;
  message: string;
  data: Product;
}

export interface ProductCreateResponse {
  success: true;
  message: string;
  data: Product;
}

export interface ProductUpdateResponse {
  success: true;
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  success: true;
  message: string;
}

export interface ProductSearchResponse {
  success: true;
  message: string;
  data: Product[];
  meta: {
    total: number;
  };
}

export interface ProductGenerateDescriptionResponse {
  success: true;
  message: string;
  data: Product;
}

// ============================================================
// Inteligencia Artificial
// ============================================================

export type AIModel = "gemini-2.5-flash" | "gemini-2.5-pro" | "gemini-2.0-flash";

export interface AIPromptRequest {
  prompt: string;
  model?: AIModel;
  max_tokens?: number;
  temperature?: number;
}

export interface AIUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

export interface AIPromptResponse {
  success: true;
  message: string;
  data: {
    response: string;
    model: AIModel;
    usage: AIUsage;
  };
}

// ============================================================
// Administración
// ============================================================

export interface AdminLoginResponse {
  success: true;
  message: string;
  data: {
    user: UserMinimal;
    token: string;
    token_type: "Bearer";
    expires_in: string;
  };
}

export interface AdminLogoutResponse {
  success: true;
  message: string;
}

export interface Statistics {
  total_users: number;
  approved_users: number;
  pending_users: number;
  users_with_api_key: number;
}

export interface StatisticsResponse {
  success: true;
  message: string;
  data: Statistics;
}

export interface UserListParams {
  is_approved?: "true" | "false";
  search?: string;
  per_page?: number;
  page?: number;
}

export interface UserListResponse {
  success: true;
  message: string;
  data: UserFull[];
  meta: PaginationMeta;
}

export interface PendingUsersParams {
  per_page?: number;
  page?: number;
}

export interface PendingUsersResponse {
  success: true;
  message: string;
  data: UserFull[];
  meta: PaginationMeta;
}

export interface UserShowResponse {
  success: true;
  message: string;
  data: UserFull;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserUpdateResponse {
  success: true;
  message: string;
  data: UserUpdated;
}

export interface UserDeleteResponse {
  success: true;
  message: string;
}

export interface ApproveUserResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic & { created_at: string };
    api_key: string;
    already_approved: boolean;
  };
}

export interface RevokeUserResponse {
  success: true;
  message: string;
  data: UserBasic;
}

export interface RegenerateKeyResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic;
    api_key: string;
  };
}

// ============================================================
// Errores
// ============================================================

export interface ValidationError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export interface AuthenticationError {
  success: false;
  message: string;
  error: string;
}

export interface ServerError {
  success: false;
  message: string;
  error: string;
}

export interface GenericError {
  success: false;
  message: string;
  error?: string;
}

// ============================================================
// Stock
// ============================================================

export interface Stock {
  id: number;
  product_id: number;
  stock: number;
  unit_value: string;
  sale_value: string;
  total_stock: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// ============================================================
// Compras / Ventas
// ============================================================

export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Purchase {
  id: number;
  user_id: number;
  total: string;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  items?: PurchaseItem[];
  user?: UserMinimal;
}

export interface CreatePurchaseRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface PurchaseListResponse {
  success: true;
  message: string;
  data: Purchase[];
  meta: PaginationMeta;
}

export interface PurchaseShowResponse {
  success: true;
  message: string;
  data: Purchase;
}

export interface PurchaseCreateResponse {
  success: true;
  message: string;
  data: Purchase;
}

// ============================================================
// Carrito (solo frontend)
// ============================================================

export interface CartItem {
  product: Product;
  quantity: number;
  stock?: Stock;
}
