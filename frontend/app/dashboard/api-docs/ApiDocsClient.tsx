"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiLock,
  FiUnlock,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

/* ================================================================
   TYPES
   ================================================================ */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Field {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  id: string;
  method: HttpMethod | string; // allow "PUT / PATCH"
  route: string;
  title: string;
  auth: "none" | "api_key" | "sanctum";
  description?: string;
  queryParams?: Field[];
  bodyFields?: Field[];
  bodyExample?: string;
  responseStatus: number;
  responseExample: string;
  notes?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  endpoints: Endpoint[];
}

/* ================================================================
   DATA — All API endpoints from USAGE.md
   ================================================================ */

const categories: Category[] = [
  /* ────────── AUTH ────────── */
  {
    id: "auth",
    name: "Autenticación",
    icon: "🔐",
    description: "Registro e inicio de sesión de usuarios.",
    endpoints: [
      {
        id: "auth-register",
        method: "POST",
        route: "/api/auth/register",
        title: "Registrar Usuario",
        auth: "none",
        description:
          "Crea un nuevo usuario con rol 'client'. Requiere aprobación de un admin para obtener API Key.",
        bodyFields: [
          { name: "name", type: "string", required: true, description: "Nombre (máx. 255)" },
          { name: "email", type: "email", required: true, description: "Email único" },
          { name: "password", type: "string", required: true, description: "Mín. 8 caracteres" },
          { name: "password_confirmation", type: "string", required: true, description: "Debe coincidir" },
        ],
        bodyExample: `{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}`,
        responseStatus: 201,
        responseExample: `{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": false
    }
  }
}`,
        notes:
          "Todos los usuarios se registran con rol 'client'. Los roles de admin/interviewer se asignan manualmente.",
      },
      {
        id: "auth-login",
        method: "POST",
        route: "/api/auth/login",
        title: "Iniciar Sesión",
        auth: "none",
        description:
          "Devuelve api_key para clientes. Admins e interviewers reciben también admin_token (Sanctum, 5 min).",
        bodyFields: [
          { name: "email", type: "email", required: true, description: "Email válido" },
          { name: "password", type: "string", required: true, description: "Contraseña" },
        ],
        bodyExample: `{
  "email": "juan@example.com",
  "password": "password123"
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "data": {
    "user": { "id": 1, "name": "Juan Pérez", "email": "juan@example.com" },
    "api_key": "sk_base64encodedkey...",
    "admin_token": "1|abc123tokenlargoaqui...",
    "admin_token_type": "Bearer",
    "admin_token_expires_in": "5 minutos"
  }
}`,
        notes:
          "admin_token y admin_token_type solo aparecen si el usuario es admin o interviewer.",
      },
    ],
  },

  /* ────────── USER ────────── */
  {
    id: "user",
    name: "Usuario Autenticado",
    icon: "👤",
    description: "Información del usuario con sesión activa.",
    endpoints: [
      {
        id: "user-me",
        method: "GET",
        route: "/api/me",
        title: "Obtener Usuario Actual",
        auth: "api_key",
        description:
          "Devuelve los datos del usuario autenticado mediante API Key.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true
    }
  }
}`,
      },
    ],
  },

  /* ────────── AI ────────── */
  {
    id: "ai",
    name: "Inteligencia Artificial",
    icon: "🤖",
    description:
      "Procesamiento de prompts con modelos Gemini. Soporta gemini-2.5-flash (recomendado) y gemini-2.5-pro.",
    endpoints: [
      {
        id: "ai-prompt",
        method: "POST",
        route: "/api/ai/prompt",
        title: "Procesar Prompt Individual",
        auth: "api_key",
        description:
          "Envía un prompt a Gemini y recibe la respuesta. Para JSON, incluye la estructura deseada en el prompt.",
        bodyFields: [
          { name: "prompt", type: "string", required: true, description: "Máx. 4000 caracteres" },
          {
            name: "model",
            type: "string",
            required: false,
            description:
              '"gemini-2.5-flash" (def), "gemini-2.5-pro", "gemini-2.0-flash"',
          },
          { name: "max_tokens", type: "integer", required: false, description: "1-8000 (def: 1000)" },
          { name: "temperature", type: "number", required: false, description: "0-1 (def: 0.7)" },
        ],
        bodyExample: `{
  "prompt": "Genera una descripción de producto para un laptop gaming.",
  "model": "gemini-2.5-flash",
  "max_tokens": 1000,
  "temperature": 0.7
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Prompt procesado exitosamente.",
  "data": {
    "response": "Experimenta el máximo rendimiento...",
    "model": "gemini-2.5-flash",
    "usage": {
      "promptTokenCount": 25,
      "candidatesTokenCount": 150,
      "totalTokenCount": 175
    }
  }
}`,
      },
    ],
  },

  /* ────────── PRODUCTS ────────── */
  {
    id: "products",
    name: "Productos",
    icon: "📦",
    description: "CRUD completo de productos con soporte de búsqueda, paginación y generación de descripción por IA.",
    endpoints: [
      {
        id: "products-list",
        method: "GET",
        route: "/api/products",
        title: "Listar Productos",
        auth: "api_key",
        description: "Lista paginada de productos. Soporta búsqueda y filtro por precio.",
        queryParams: [
          { name: "search", type: "string", required: false, description: "Buscar por nombre" },
          { name: "min_price", type: "number", required: false, description: "Precio mínimo" },
          { name: "max_price", type: "number", required: false, description: "Precio máximo" },
          { name: "per_page", type: "integer", required: false, description: "Por página (def: 15)" },
        ],
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Productos obtenidos exitosamente.",
  "data": [
    {
      "id": 50,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM, RTX 4080",
      "price": "1499.99",
      "ai_description": "Laptop de alta gama...",
      "images": ["https://images.unsplash.com/photo-laptop"]
    }
  ],
  "meta": { "current_page": 1, "last_page": 5, "per_page": 10, "total": 50 }
}`,
        notes: "Productos ordenados por ID descendente (más recientes primero). El campo price se devuelve como string decimal.",
      },
      {
        id: "products-show",
        method: "GET",
        route: "/api/products/{id}",
        title: "Ver Producto Específico",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Producto obtenido exitosamente.",
  "data": {
    "id": 1,
    "name": "Laptop Gaming",
    "features": "Intel i9, 32GB RAM, RTX 4080",
    "price": "1499.99",
    "ai_description": "Laptop de alta gama...",
    "images": ["https://images.unsplash.com/photo-laptop"]
  }
}`,
      },
      {
        id: "products-create",
        method: "POST",
        route: "/api/products",
        title: "Crear Producto",
        auth: "api_key",
        bodyFields: [
          { name: "name", type: "string", required: true, description: "Nombre (máx. 255)" },
          { name: "features", type: "string", required: false, description: "Características (máx. 500)" },
          { name: "price", type: "number", required: false, description: "0 – 999999.99" },
          { name: "ai_description", type: "string", required: false, description: "Descripción IA" },
          { name: "images", type: "string[]", required: false, description: "Array de URLs (máx. 5)" },
        ],
        bodyExample: `{
  "name": "Laptop Gaming Pro",
  "features": "Intel Core i9-13900K, NVIDIA RTX 4080, 32GB RAM DDR5",
  "price": 1899.99,
  "ai_description": "Descripción opcional generada por IA",
  "images": ["https://images.unsplash.com/photo-laptop-1"]
}`,
        responseStatus: 201,
        responseExample: `{
  "success": true,
  "message": "Producto creado exitosamente.",
  "data": {
    "id": 51,
    "name": "Laptop Gaming Pro",
    "features": "Intel Core i9-13900K, NVIDIA RTX 4080, 32GB RAM DDR5",
    "price": "1899.99",
    "ai_description": "Descripción opcional generada por IA",
    "images": ["https://images.unsplash.com/photo-laptop-1"]
  }
}`,
      },
      {
        id: "products-update",
        method: "PUT / PATCH",
        route: "/api/products/{id}",
        title: "Actualizar Producto",
        auth: "api_key",
        description: "Con PATCH envía solo los campos que deseas actualizar.",
        bodyFields: [
          { name: "name", type: "string", required: false, description: "Nombre (máx. 255)" },
          { name: "features", type: "string", required: false, description: "Características" },
          { name: "price", type: "number", required: false, description: "0 – 999999.99" },
          { name: "ai_description", type: "string", required: false, description: "Descripción IA" },
          { name: "images", type: "string[]", required: false, description: "Array de URLs (máx. 5)" },
        ],
        bodyExample: `{
  "name": "Laptop Gaming Pro Plus",
  "price": 2499.99,
  "images": ["https://images.unsplash.com/photo-laptop-new"]
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Producto actualizado exitosamente.",
  "data": {
    "id": 51,
    "name": "Laptop Gaming Pro Plus",
    "price": "2499.99",
    "images": ["https://images.unsplash.com/photo-laptop-new"]
  }
}`,
      },
      {
        id: "products-delete",
        method: "DELETE",
        route: "/api/products/{id}",
        title: "Eliminar Producto",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Producto eliminado exitosamente."
}`,
      },
      {
        id: "products-search",
        method: "GET",
        route: "/api/products/search/{term}",
        title: "Buscar Productos",
        auth: "api_key",
        description: "Búsqueda directa por término en la URL.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Búsqueda completada.",
  "data": [
    {
      "id": 50,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM",
      "price": "1499.99"
    }
  ],
  "meta": { "total": 3 }
}`,
        notes: "Resultados ordenados por fecha de creación descendente.",
      },
      {
        id: "products-ai-desc",
        method: "POST",
        route: "/api/products/{id}/generate-description",
        title: "Generar Descripción con IA",
        auth: "api_key",
        description:
          "Genera automáticamente la descripción usando nombre, características y precio del producto. Usa gemini-2.5-flash.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Descripción generada exitosamente.",
  "data": {
    "id": 4,
    "name": "Sony WH-1000XM6",
    "features": "Cancelación de ruido, 40h batería, LDAC",
    "price": "399.99",
    "ai_description": "Sumérgete en un mundo de sonido puro..."
  }
}`,
      },
    ],
  },

  /* ────────── STOCK ────────── */
  {
    id: "stock",
    name: "Stock / Inventario",
    icon: "📊",
    description: "Gestión de inventario. El campo total_stock se calcula automáticamente (stock × unit_value).",
    endpoints: [
      {
        id: "stock-list",
        method: "GET",
        route: "/api/stocks",
        title: "Listar Stocks",
        auth: "api_key",
        queryParams: [
          { name: "search", type: "string", required: false, description: "Buscar por nombre del producto" },
          { name: "product_id", type: "integer", required: false, description: "Filtrar por ID de producto" },
          { name: "per_page", type: "integer", required: false, description: "Resultados por página (def: 15)" },
        ],
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Stocks obtenidos exitosamente.",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "stock": 50,
      "unit_value": "1749.99",
      "sale_value": "3499.99",
      "total_stock": "87499.50",
      "product": { "id": 1, "name": "MacBook Pro 16\\" M4 Max", "price": "3499.99" }
    }
  ],
  "meta": { "current_page": 1, "last_page": 4, "per_page": 15, "total": 50 }
}`,
      },
      {
        id: "stock-show",
        method: "GET",
        route: "/api/stocks/{id}",
        title: "Ver Stock Específico",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Stock obtenido exitosamente.",
  "data": {
    "id": 1,
    "product_id": 1,
    "stock": 50,
    "unit_value": "1749.99",
    "sale_value": "3499.99",
    "total_stock": "87499.50",
    "product": { "id": 1, "name": "MacBook Pro 16\\" M4 Max" }
  }
}`,
      },
      {
        id: "stock-by-product",
        method: "GET",
        route: "/api/stocks/product/{productId}",
        title: "Ver Stock por Producto",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Stock del producto obtenido exitosamente.",
  "data": {
    "id": 1,
    "product_id": 1,
    "stock": 50,
    "unit_value": "1749.99",
    "sale_value": "3499.99",
    "total_stock": "87499.50"
  }
}`,
        notes: "Devuelve 404 si el producto no tiene stock registrado.",
      },
      {
        id: "stock-create",
        method: "POST",
        route: "/api/stocks",
        title: "Crear Stock",
        auth: "api_key",
        bodyFields: [
          { name: "product_id", type: "integer", required: true, description: "ID del producto (debe existir, único)" },
          { name: "stock", type: "integer", required: true, description: "Cantidad (min: 0)" },
          { name: "unit_value", type: "number", required: true, description: "Valor unitario de compra" },
          { name: "sale_value", type: "number", required: true, description: "Valor de venta" },
        ],
        bodyExample: `{
  "product_id": 1,
  "stock": 100,
  "unit_value": 1500.00,
  "sale_value": 2999.99
}`,
        responseStatus: 201,
        responseExample: `{
  "success": true,
  "message": "Stock creado exitosamente.",
  "data": {
    "id": 51,
    "product_id": 1,
    "stock": 100,
    "unit_value": "1500.00",
    "sale_value": "2999.99",
    "total_stock": "150000.00"
  }
}`,
        notes: "total_stock se calcula automáticamente como stock × unit_value.",
      },
      {
        id: "stock-update",
        method: "PUT / PATCH",
        route: "/api/stocks/{id}",
        title: "Actualizar Stock",
        auth: "api_key",
        bodyFields: [
          { name: "stock", type: "integer", required: false, description: "Nueva cantidad" },
          { name: "unit_value", type: "number", required: false, description: "Nuevo valor unitario" },
          { name: "sale_value", type: "number", required: false, description: "Nuevo valor de venta" },
        ],
        bodyExample: `{
  "stock": 75,
  "unit_value": 1600.00,
  "sale_value": 3199.99
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Stock actualizado exitosamente.",
  "data": {
    "id": 1,
    "stock": 75,
    "unit_value": "1600.00",
    "sale_value": "3199.99",
    "total_stock": "120000.00"
  }
}`,
        notes: "total_stock se recalcula automáticamente.",
      },
      {
        id: "stock-delete",
        method: "DELETE",
        route: "/api/stocks/{id}",
        title: "Eliminar Stock",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Stock eliminado exitosamente."
}`,
      },
    ],
  },

  /* ────────── ADMIN ────────── */
  {
    id: "admin",
    name: "Administración",
    icon: "👨‍💼",
    description:
      "Gestión de usuarios y estadísticas. Token Sanctum requerido (expira en 5 min). Usar /api/admin/login para obtenerlo.",
    endpoints: [
      {
        id: "admin-login",
        method: "POST",
        route: "/api/admin/login",
        title: "Login de Administrador",
        auth: "none",
        description: "Obtiene token Sanctum con expiración de 5 minutos.",
        bodyFields: [
          { name: "email", type: "email", required: true, description: "Email válido" },
          { name: "password", type: "string", required: true, description: "Contraseña" },
        ],
        bodyExample: `{
  "email": "admin@example.com",
  "password": "password123"
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Sesión de administrador iniciada exitosamente.",
  "data": {
    "user": { "id": 1, "name": "Admin", "email": "admin@example.com" },
    "token": "1|abc123tokenlargoaqui...",
    "token_type": "Bearer",
    "expires_in": "5 minutos"
  }
}`,
        notes: "Error 422 si las credenciales son incorrectas o el usuario no es admin/interviewer.",
      },
      {
        id: "admin-logout",
        method: "POST",
        route: "/api/admin/logout",
        title: "Logout de Administrador",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Sesión de administrador cerrada exitosamente."
}`,
      },
      {
        id: "admin-stats",
        method: "GET",
        route: "/api/admin/statistics",
        title: "Obtener Estadísticas",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente.",
  "data": {
    "total_users": 150,
    "approved_users": 120,
    "pending_users": 30,
    "users_with_api_key": 118
  }
}`,
      },
      {
        id: "admin-users-list",
        method: "GET",
        route: "/api/admin/users",
        title: "Listar Todos los Usuarios",
        auth: "sanctum",
        queryParams: [
          { name: "is_approved", type: "boolean", required: false, description: "Filtrar por aprobación" },
          { name: "search", type: "string", required: false, description: "Buscar por nombre o email" },
          { name: "per_page", type: "integer", required: false, description: "Usuarios por página (def: 15)" },
          { name: "page", type: "integer", required: false, description: "Número de página" },
        ],
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuarios obtenidos exitosamente.",
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true,
      "roles": [{ "id": 1, "name": "client" }]
    }
  ],
  "meta": { "current_page": 1, "last_page": 10, "per_page": 15, "total": 150 }
}`,
      },
      {
        id: "admin-users-pending",
        method: "GET",
        route: "/api/admin/users/pending",
        title: "Listar Usuarios Pendientes",
        auth: "sanctum",
        queryParams: [
          { name: "per_page", type: "integer", required: false, description: "Usuarios por página (def: 15)" },
          { name: "page", type: "integer", required: false, description: "Número de página" },
        ],
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuarios pendientes obtenidos exitosamente.",
  "data": [
    {
      "id": 25,
      "name": "María López",
      "email": "maria@example.com",
      "is_approved": false,
      "roles": [{ "id": 1, "name": "client" }]
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 3 }
}`,
      },
      {
        id: "admin-user-show",
        method: "GET",
        route: "/api/admin/users/{id}",
        title: "Ver Usuario Específico",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuario obtenido exitosamente.",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "is_approved": true,
    "roles": [{ "id": 1, "name": "client" }]
  }
}`,
      },
      {
        id: "admin-user-update",
        method: "PUT / PATCH",
        route: "/api/admin/users/{id}",
        title: "Actualizar Usuario",
        auth: "sanctum",
        bodyFields: [
          { name: "name", type: "string", required: false, description: "Nombre (máx. 255)" },
          { name: "email", type: "email", required: false, description: "Email único" },
          { name: "role", type: "string", required: false, description: "admin, client o interviewer" },
        ],
        bodyExample: `{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}`,
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuario actualizado exitosamente.",
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "is_approved": true
  }
}`,
      },
      {
        id: "admin-user-delete",
        method: "DELETE",
        route: "/api/admin/users/{id}",
        title: "Eliminar Usuario",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuario eliminado exitosamente."
}`,
      },
      {
        id: "admin-user-approve",
        method: "POST",
        route: "/api/admin/users/{id}/approve",
        title: "Aprobar Usuario",
        auth: "sanctum",
        description: "Aprueba al usuario y le genera una API Key.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Usuario aprobado exitosamente.",
  "data": {
    "user": { "id": 25, "name": "María López", "email": "maria@example.com", "is_approved": true },
    "api_key": "sk_nuevakeybase64encodedaqui...",
    "already_approved": false
  }
}`,
        notes: "Si ya estaba aprobado, already_approved será true.",
      },
      {
        id: "admin-user-revoke",
        method: "POST",
        route: "/api/admin/users/{id}/revoke",
        title: "Revocar Aprobación",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Aprobación revocada exitosamente.",
  "data": {
    "id": 25,
    "name": "María López",
    "email": "maria@example.com",
    "is_approved": false
  }
}`,
      },
      {
        id: "admin-user-regen",
        method: "POST",
        route: "/api/admin/users/{id}/regenerate-key",
        title: "Regenerar API Key",
        auth: "sanctum",
        description: "Genera una nueva API Key para un usuario aprobado.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "API Key regenerada exitosamente.",
  "data": {
    "user": { "id": 1, "name": "Juan Pérez", "is_approved": true },
    "api_key": "sk_nuevakeybase64encodedaqui..."
  }
}`,
        notes: "El usuario debe estar aprobado. Devuelve error 400 si no lo está.",
      },
    ],
  },

  /* ────────── PURCHASES ────────── */
  {
    id: "purchases",
    name: "Compras",
    icon: "🛒",
    description:
      "Gestión de compras para clientes (API Key) y administradores (Sanctum).",
    endpoints: [
      {
        id: "purchases-create",
        method: "POST",
        route: "/api/purchases",
        title: "Crear Compra",
        auth: "api_key",
        description: "Crea una nueva compra con los items del carrito.",
        bodyFields: [
          {
            name: "items",
            type: "array",
            required: true,
            description:
              "Array de objetos con product_id (int), quantity (int, min:1) y price (number)",
          },
        ],
        bodyExample: `{
  "items": [
    { "product_id": 1, "quantity": 2, "price": 1499.99 },
    { "product_id": 5, "quantity": 1, "price": 299.99 }
  ]
}`,
        responseStatus: 201,
        responseExample: `{
  "success": true,
  "message": "Compra realizada exitosamente.",
  "data": {
    "id": 1,
    "user_id": 1,
    "total": "3299.97",
    "items": [
      { "product_id": 1, "product_name": "Laptop Gaming", "quantity": 2, "price": "1499.99", "subtotal": "2999.98" },
      { "product_id": 5, "product_name": "Mouse RGB", "quantity": 1, "price": "299.99", "subtotal": "299.99" }
    ]
  }
}`,
      },
      {
        id: "purchases-my",
        method: "GET",
        route: "/api/purchases/my",
        title: "Mis Compras",
        auth: "api_key",
        description: "Lista todas las compras del usuario autenticado.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Compras obtenidas exitosamente.",
  "data": [
    {
      "id": 1,
      "total": "3299.97",
      "created_at": "2026-02-14T10:00:00.000000Z",
      "items_count": 2
    }
  ]
}`,
      },
      {
        id: "purchases-my-detail",
        method: "GET",
        route: "/api/purchases/my/{id}",
        title: "Detalle de Mi Compra",
        auth: "api_key",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "data": {
    "id": 1,
    "total": "3299.97",
    "items": [
      { "product_id": 1, "product_name": "Laptop Gaming", "quantity": 2, "price": "1499.99", "subtotal": "2999.98" }
    ]
  }
}`,
      },
      {
        id: "purchases-admin-list",
        method: "GET",
        route: "/api/admin/purchases",
        title: "Listar Todas las Compras (Admin)",
        auth: "sanctum",
        description: "Lista todas las compras de todos los usuarios.",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "message": "Compras obtenidas exitosamente.",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "Juan Pérez",
      "total": "3299.97",
      "items_count": 2,
      "created_at": "2026-02-14T10:00:00.000000Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 5 }
}`,
      },
      {
        id: "purchases-admin-detail",
        method: "GET",
        route: "/api/admin/purchases/{id}",
        title: "Detalle de Compra (Admin)",
        auth: "sanctum",
        responseStatus: 200,
        responseExample: `{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "user_name": "Juan Pérez",
    "total": "3299.97",
    "items": [
      { "product_id": 1, "product_name": "Laptop Gaming", "quantity": 2, "price": "1499.99", "subtotal": "2999.98" }
    ]
  }
}`,
      },
    ],
  },
];

/* ================================================================
   HELPERS
   ================================================================ */

const methodColor: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PATCH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  "PUT / PATCH": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const authLabel: Record<string, { text: string; color: string }> = {
  none: { text: "Sin auth", color: "text-zinc-500" },
  api_key: { text: "API Key", color: "text-indigo-400" },
  sanctum: { text: "Sanctum Token", color: "text-amber-400" },
};

/* ================================================================
   COMPONENTS
   ================================================================ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
      title="Copiar"
    >
      {copied ? <FiCheck className="h-3.5 w-3.5 text-emerald-400" /> : <FiCopy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative">
      {label && (
        <div className="mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="relative rounded-lg border border-zinc-700/50 bg-zinc-900/80 p-3">
        <CopyButton text={code} />
        <pre className="overflow-x-auto pr-8 text-xs leading-relaxed text-zinc-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function FieldsTable({ fields, title }: { fields: Field[]; title: string }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {title}
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-700/50">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-700/50 bg-zinc-800/50">
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                Campo
              </th>
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                Tipo
              </th>
              <th className="px-3 py-2 text-center font-medium text-zinc-400">
                Req.
              </th>
              <th className="px-3 py-2 text-left font-medium text-zinc-400">
                Descripción
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr
                key={f.name}
                className="border-b border-zinc-800/50 last:border-none"
              >
                <td className="px-3 py-1.5 font-mono text-indigo-300">
                  {f.name}
                </td>
                <td className="px-3 py-1.5 text-zinc-500">{f.type}</td>
                <td className="px-3 py-1.5 text-center">
                  {f.required ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-zinc-400">{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const auth = authLabel[endpoint.auth];

  return (
    <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 transition-colors hover:border-zinc-600/50">
      {/* ── header row ── */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-zinc-500">
          {open ? <FiChevronDown className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}
        </span>

        <span
          className={`inline-flex min-w-[80px] items-center justify-center rounded border px-2 py-0.5 text-[11px] font-bold tracking-wide ${
            methodColor[endpoint.method] ?? "bg-zinc-700 text-zinc-300 border-zinc-600"
          }`}
        >
          {endpoint.method}
        </span>

        <code className="flex-1 truncate text-sm text-zinc-200">
          {endpoint.route}
        </code>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs">
          {endpoint.auth === "none" ? (
            <FiUnlock className={`h-3 w-3 ${auth.color}`} />
          ) : (
            <FiLock className={`h-3 w-3 ${auth.color}`} />
          )}
          <span className={auth.color}>{auth.text}</span>
        </span>

        <span className="rounded bg-zinc-700/50 px-1.5 py-0.5 text-[10px] text-zinc-400">
          {endpoint.responseStatus}
        </span>
      </button>

      {/* ── expandable body ── */}
      {open && (
        <div className="space-y-4 border-t border-zinc-700/50 px-4 py-4">
          {/* title + description */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">
              {endpoint.title}
            </h4>
            {endpoint.description && (
              <p className="mt-1 text-xs text-zinc-400">
                {endpoint.description}
              </p>
            )}
          </div>

          {/* auth info (mobile) */}
          <div className="flex items-center gap-1 text-xs sm:hidden">
            {endpoint.auth === "none" ? (
              <FiUnlock className={`h-3 w-3 ${auth.color}`} />
            ) : (
              <FiLock className={`h-3 w-3 ${auth.color}`} />
            )}
            <span className={auth.color}>{auth.text}</span>
          </div>

          {/* query params */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <FieldsTable fields={endpoint.queryParams} title="Query Parameters" />
          )}

          {/* body fields */}
          {endpoint.bodyFields && endpoint.bodyFields.length > 0 && (
            <FieldsTable fields={endpoint.bodyFields} title="Body (JSON)" />
          )}

          {/* body example */}
          {endpoint.bodyExample && (
            <CodeBlock code={endpoint.bodyExample} label="Ejemplo de Body" />
          )}

          {/* response */}
          <CodeBlock
            code={endpoint.responseExample}
            label={`Respuesta (${endpoint.responseStatus})`}
          />

          {/* notes */}
          {endpoint.notes && (
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-300/80">
              💡 {endpoint.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/20">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="text-xl">{category.icon}</span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-100">
            {category.name}
          </h2>
          <p className="text-xs text-zinc-500">{category.description}</p>
        </div>
        <span className="rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-400">
          {category.endpoints.length}
        </span>
        <span className="text-zinc-500">
          {open ? <FiChevronDown className="h-5 w-5" /> : <FiChevronRight className="h-5 w-5" />}
        </span>
      </button>

      {open && (
        <div className="space-y-2 px-5 pb-5">
          {category.endpoints.map((ep) => (
            <EndpointCard key={ep.id} endpoint={ep} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */

export function ApiDocsClient() {
  const [filter, setFilter] = useState<string>("");

  const filtered = filter
    ? categories
        .map((cat) => ({
          ...cat,
          endpoints: cat.endpoints.filter(
            (ep) =>
              ep.route.toLowerCase().includes(filter.toLowerCase()) ||
              ep.title.toLowerCase().includes(filter.toLowerCase()) ||
              ep.method.toLowerCase().includes(filter.toLowerCase())
          ),
        }))
        .filter((cat) => cat.endpoints.length > 0)
    : categories;

  const totalEndpoints = categories.reduce(
    (acc, c) => acc + c.endpoints.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* ── search + stats bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar endpoint... (ruta, nombre o método)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none ring-indigo-500/40 transition focus:border-indigo-500/50 focus:ring-2 sm:max-w-sm"
        />
        <div className="flex gap-3 text-xs text-zinc-500">
          <span>{totalEndpoints} endpoints</span>
          <span>•</span>
          <span>{categories.length} categorías</span>
          {filter && (
            <>
              <span>•</span>
              <span className="text-indigo-400">
                {filtered.reduce((a, c) => a + c.endpoints.length, 0)}{" "}
                resultados
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── method legend ── */}
      <div className="flex flex-wrap gap-2">
        {["GET", "POST", "PUT / PATCH", "DELETE"].map((m) => (
          <span
            key={m}
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide ${methodColor[m]}`}
          >
            {m}
          </span>
        ))}
        <span className="ml-2 flex items-center gap-1 text-[10px] text-zinc-500">
          <FiUnlock className="h-3 w-3" /> Sin auth
        </span>
        <span className="flex items-center gap-1 text-[10px] text-indigo-400">
          <FiLock className="h-3 w-3" /> API Key
        </span>
        <span className="flex items-center gap-1 text-[10px] text-amber-400">
          <FiLock className="h-3 w-3" /> Sanctum
        </span>
      </div>

      {/* ── categories ── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/20 p-8 text-center text-zinc-500">
          No se encontraron endpoints para &quot;{filter}&quot;
        </div>
      ) : (
        filtered.map((cat) => <CategorySection key={cat.id} category={cat} />)
      )}

      {/* ── HTTP status reference ── */}
      <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">
          Códigos de Estado HTTP
        </h3>
        <div className="grid gap-1.5 text-xs sm:grid-cols-2 lg:grid-cols-4">
          {[
            { code: "200", label: "OK", color: "text-emerald-400" },
            { code: "201", label: "Created", color: "text-emerald-400" },
            { code: "400", label: "Bad Request", color: "text-amber-400" },
            { code: "401", label: "Unauthorized", color: "text-red-400" },
            { code: "403", label: "Forbidden", color: "text-red-400" },
            { code: "404", label: "Not Found", color: "text-amber-400" },
            { code: "422", label: "Validation Error", color: "text-orange-400" },
            { code: "500", label: "Server Error", color: "text-red-400" },
          ].map((s) => (
            <div key={s.code} className="flex items-center gap-2">
              <span className={`font-mono font-bold ${s.color}`}>
                {s.code}
              </span>
              <span className="text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
