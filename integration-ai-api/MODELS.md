# 📐 Modelos e Interfaces — Referencia de Tipos

Interfaces TypeScript que representan las estructuras de datos de la API. Usar como referencia para tipar el frontend.

---

## 📋 Tabla de Contenidos

1. [Respuesta Base](#respuesta-base)
2. [Autenticación](#autenticación)
3. [Usuario](#usuario)
4. [Productos](#productos)
5. [Inteligencia Artificial](#inteligencia-artificial)
6. [Administración](#administración)
7. [Paginación](#paginación)
8. [Errores](#errores)

---

## Respuesta Base

Todas las respuestas de la API siguen esta estructura:

```typescript
interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
  errors?: Record<string, string[]>;
}
```

---

## Autenticación

### Registro

```typescript
// POST /api/auth/register — Body
interface RegisterRequest {
  name: string;                    // máx. 255
  email: string;                   // email único, máx. 255
  password: string;                // mín. 8
  password_confirmation: string;   // debe coincidir con password
}

// POST /api/auth/register — Response 201
interface RegisterResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic;
  };
}
```

### Login

```typescript
// POST /api/auth/login — Body
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/login — Response 200 (cliente)
interface LoginResponse {
  success: true;
  message: string;
  data: LoginData;
}

interface LoginData {
  user: UserMinimal;
  api_key: string;                       // formato: "sk_..."
  admin_token?: string;                  // solo si es admin: "1|abc..."
  admin_token_type?: "Bearer";           // solo si es admin
  admin_token_expires_in?: string;       // solo si es admin: "5 minutos"
}
```

---

## Usuario

```typescript
// Campos mínimos (login, approve, regenerate-key)
interface UserMinimal {
  id: number;
  name: string;
  email: string;
}

// Campos básicos (register, /api/me)
interface UserBasic {
  id: number;
  name: string;
  email: string;
  is_approved: boolean;
}

// Usuario completo con roles (admin endpoints: list, show, pending)
interface UserFull {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;   // ISO 8601
  is_approved: boolean;
  created_at: string;                 // ISO 8601
  updated_at: string;                 // ISO 8601
  roles: RoleWithPivot[];
}

// Usuario en respuesta de update admin
interface UserUpdated {
  id: number;
  name: string;
  email: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## Productos

```typescript
// Producto completo (show, create, update, generate-description)
interface Product {
  id: number;
  name: string;
  features: string | null;
  price: string;                      // string decimal: "1499.99"
  ai_description: string | null;
  images: string[] | null;            // array de URLs, máx. 5
  created_at: string;                 // ISO 8601
  updated_at: string;                 // ISO 8601
}

// POST /api/products — Body
interface CreateProductRequest {
  name: string;                       // requerido, máx. 255
  features?: string;                  // máx. 500
  price?: number;                     // 0 - 999999.99
  ai_description?: string;
  images?: string[];                  // máx. 5 URLs, cada URL máx. 2048
}

// PUT|PATCH /api/products/{id} — Body
interface UpdateProductRequest {
  name?: string;                      // máx. 255
  features?: string;                  // máx. 500
  price?: number;                     // 0 - 999999.99
  ai_description?: string;
  images?: string[];                  // máx. 5 URLs, cada URL máx. 2048
}

// GET /api/products — Response 200
interface ProductListResponse {
  success: true;
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

// GET /api/products/{id} — Response 200
interface ProductShowResponse {
  success: true;
  message: string;
  data: Product;
}

// POST /api/products — Response 201
interface ProductCreateResponse {
  success: true;
  message: string;
  data: Product;
}

// PUT|PATCH /api/products/{id} — Response 200
interface ProductUpdateResponse {
  success: true;
  message: string;
  data: Product;
}

// DELETE /api/products/{id} — Response 200
interface ProductDeleteResponse {
  success: true;
  message: string;
}

// GET /api/products/search/{term} — Response 200
interface ProductSearchResponse {
  success: true;
  message: string;
  data: Product[];
  meta: {
    total: number;
  };
}

// POST /api/products/{id}/generate-description — Response 200
interface ProductGenerateDescriptionResponse {
  success: true;
  message: string;
  data: Product;
}
```

---

## Inteligencia Artificial

```typescript
// POST /api/ai/prompt — Body
interface AIPromptRequest {
  prompt: string;                     // requerido, máx. 4000
  model?: AIModel;                    // por defecto: "gemini-2.5-flash"
  max_tokens?: number;                // 1-8000, por defecto: 1000
  temperature?: number;               // 0-1, por defecto: 0.7
}

type AIModel = "gemini-2.5-flash" | "gemini-2.5-pro" | "gemini-2.0-flash";

// POST /api/ai/prompt — Response 200
interface AIPromptResponse {
  success: true;
  message: string;
  data: {
    response: string;                 // texto generado por la IA
    model: AIModel;
    usage: AIUsage;
  };
}

interface AIUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}
```

---

## Administración

### Login / Logout Admin

```typescript
// POST /api/admin/login — Body
// Usa el mismo LoginRequest de autenticación

// POST /api/admin/login — Response 200
interface AdminLoginResponse {
  success: true;
  message: string;
  data: {
    user: UserMinimal;
    token: string;                    // "1|abc123..."
    token_type: "Bearer";
    expires_in: string;               // "5 minutos"
  };
}

// POST /api/admin/logout — Response 200
interface AdminLogoutResponse {
  success: true;
  message: string;
}
```

### Estadísticas

```typescript
// GET /api/admin/statistics — Response 200
interface StatisticsResponse {
  success: true;
  message: string;
  data: Statistics;
}

interface Statistics {
  total_users: number;
  approved_users: number;
  pending_users: number;
  users_with_api_key: number;
}
```

### Gestión de Usuarios

```typescript
// GET /api/admin/users — Query Params
interface UserListParams {
  is_approved?: "true" | "false";
  search?: string;
  per_page?: number;                  // por defecto: 15
  page?: number;
}

// GET /api/admin/users — Response 200
interface UserListResponse {
  success: true;
  message: string;
  data: UserFull[];
  meta: PaginationMeta;
}

// GET /api/admin/users/pending — Query Params
interface PendingUsersParams {
  per_page?: number;
  page?: number;
}

// GET /api/admin/users/pending — Response 200
interface PendingUsersResponse {
  success: true;
  message: string;
  data: UserFull[];
  meta: PaginationMeta;
}

// GET /api/admin/users/{id} — Response 200
interface UserShowResponse {
  success: true;
  message: string;
  data: UserFull;
}

// PUT|PATCH /api/admin/users/{id} — Body
interface UpdateUserRequest {
  name?: string;                      // máx. 255
  email?: string;                     // email único, máx. 255
}

// PUT|PATCH /api/admin/users/{id} — Response 200
interface UserUpdateResponse {
  success: true;
  message: string;
  data: UserUpdated;
}

// DELETE /api/admin/users/{id} — Response 200
interface UserDeleteResponse {
  success: true;
  message: string;
}

// POST /api/admin/users/{id}/approve — Response 200
interface ApproveUserResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic & { created_at: string };
    api_key: string;                  // "sk_..."
    already_approved: boolean;
  };
}

// POST /api/admin/users/{id}/revoke — Response 200
interface RevokeUserResponse {
  success: true;
  message: string;
  data: UserBasic;                    // is_approved será false
}

// POST /api/admin/users/{id}/regenerate-key — Response 200
interface RegenerateKeyResponse {
  success: true;
  message: string;
  data: {
    user: UserBasic;
    api_key: string;                  // "sk_..."
  };
}
```

---

## Paginación

```typescript
interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
```

---

## Errores

```typescript
// Error de validación — 422
interface ValidationError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

// Error de autenticación — 401
interface AuthenticationError {
  success: false;
  message: string;
  error: string;
}

// Error del servidor — 500
interface ServerError {
  success: false;
  message: string;
  error: string;
}

// Error genérico (400, 403, 404)
interface GenericError {
  success: false;
  message: string;
  error?: string;
}
```

---

## Roles

```typescript
interface Role {
  id: number;
  name: "admin" | "client";
  created_at: string;
  updated_at: string;
}

interface RoleWithPivot extends Role {
  pivot: {
    user_id: number;
    role_id: number;
  };
}
```

---

## 🗂️ Resumen de Endpoints

| Método | Ruta | Request Body | Response Data |
|--------|------|-------------|---------------|
| `POST` | `/api/auth/register` | `RegisterRequest` | `{ user: UserBasic }` |
| `POST` | `/api/auth/login` | `LoginRequest` | `LoginData` |
| `GET` | `/api/me` | — | `{ user: UserBasic }` |
| `POST` | `/api/ai/prompt` | `AIPromptRequest` | `{ response, model, usage }` |
| `GET` | `/api/products` | — | `Product[]` + `PaginationMeta` |
| `GET` | `/api/products/{id}` | — | `Product` |
| `POST` | `/api/products` | `CreateProductRequest` | `Product` |
| `PUT\|PATCH` | `/api/products/{id}` | `UpdateProductRequest` | `Product` |
| `DELETE` | `/api/products/{id}` | — | — |
| `GET` | `/api/products/search/{term}` | — | `Product[]` + `{ total }` |
| `POST` | `/api/products/{id}/generate-description` | — | `Product` |
| `POST` | `/api/admin/login` | `LoginRequest` | `{ user, token, token_type, expires_in }` |
| `POST` | `/api/admin/logout` | — | — |
| `GET` | `/api/admin/statistics` | — | `Statistics` |
| `GET` | `/api/admin/users` | — | `UserFull[]` + `PaginationMeta` |
| `GET` | `/api/admin/users/pending` | — | `UserFull[]` + `PaginationMeta` |
| `GET` | `/api/admin/users/{id}` | — | `UserFull` |
| `PUT\|PATCH` | `/api/admin/users/{id}` | `UpdateUserRequest` | `UserUpdated` |
| `DELETE` | `/api/admin/users/{id}` | — | — |
| `POST` | `/api/admin/users/{id}/approve` | — | `{ user, api_key, already_approved }` |
| `POST` | `/api/admin/users/{id}/revoke` | — | `UserBasic` |
| `POST` | `/api/admin/users/{id}/regenerate-key` | — | `{ user, api_key }` |

---

**Fecha de actualización:** 14 de febrero de 2026
