# 📖 Guía de Uso de la API

Documentación completa de todos los endpoints disponibles. Cada sección especifica el verbo HTTP, la ruta, los headers requeridos, el body y la respuesta real del servidor.

---

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Usuario Autenticado](#usuario-autenticado)
3. [Inteligencia Artificial](#inteligencia-artificial)
4. [Productos](#productos)
5. [Stock](#stock)
6. [Administración](#administración)
7. [Notas Importantes](#notas-importantes)

---

## 🔐 Autenticación

### Registrar Usuario

**Verbo:** `POST`  
**Ruta:** `/api/auth/register`  
**Requiere Autenticación:** ❌ No

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Campos:**
- `name` (requerido, string, máx. 255 caracteres)
- `email` (requerido, email único, máx. 255 caracteres)
- `password` (requerido, string, mín. 8 caracteres)
- `password_confirmation` (requerido, debe coincidir con password)

> ⚠️ **Nota de Seguridad:** Todos los usuarios se registran con rol "client" por defecto. Los roles de administrador deben ser asignados manualmente en la base de datos por otro administrador.

**Respuesta exitosa (201):**
```json
{
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
}
```

---

### Iniciar Sesión

**Verbo:** `POST`  
**Ruta:** `/api/auth/login`  
**Requiere Autenticación:** ❌ No

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Campos:**
- `email` (requerido, email válido)
- `password` (requerido, string)

**Respuesta exitosa (200) — Usuario cliente:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "api_key": "sk_base64encodedkey..."
  }
}
```

**Respuesta exitosa (200) — Usuario administrador:**

Si el usuario tiene rol admin, la respuesta incluye también un token Sanctum para el panel administrativo:

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso.",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "api_key": "sk_base64encodedkey...",
    "admin_token": "1|abc123tokenlargoaqui...",
    "admin_token_type": "Bearer",
    "admin_token_expires_in": "5 minutos"
  }
}
```

> 💡 Los administradores reciben ambas credenciales: `api_key` para endpoints de productos/IA y `admin_token` para endpoints de administración.

---

## 👤 Usuario Autenticado

### Obtener Información del Usuario Actual

**Verbo:** `GET`  
**Ruta:** `/api/me`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```
O bien:
```
X-API-Key: {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true
    }
  }
}
```

---

## 🤖 Inteligencia Artificial

> **💡 Importante sobre modelos y respuestas JSON:**
>
> **Modelos disponibles:**
> - **gemini-2.5-flash** (recomendado, mejor precio-rendimiento, rápido)
> - **gemini-2.5-pro** (modelo avanzado con razonamiento profundo)
> - gemini-2.0-flash (deprecado, se eliminará marzo 31, 2026)
>
> **Para respuestas JSON:**
> Especifica en tu prompt la estructura que deseas, por ejemplo:
> `"Devuelve JSON con: {title: string, description: string, tags: array}"`
>
> El campo `response` contendrá un string que necesitas parsear en tu frontend:
> ```javascript
> const data = JSON.parse(response.data.response);
> ```

### Procesar Prompt Individual

**Verbo:** `POST`  
**Ruta:** `/api/ai/prompt`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Genera una descripción de producto para un laptop gaming.",
  "model": "gemini-2.5-flash",
  "max_tokens": 1000,
  "temperature": 0.7
}
```

**Campos:**
- `prompt` (requerido, string, máx. 4000 caracteres)
- `model` (opcional, valores: `"gemini-2.5-flash"`, `"gemini-2.5-pro"`, `"gemini-2.0-flash"`, por defecto: `"gemini-2.5-flash"`)
- `max_tokens` (opcional, integer, rango: 1-8000, por defecto: 1000)
- `temperature` (opcional, numeric, rango: 0-1, por defecto: 0.7)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Prompt procesado exitosamente.",
  "data": {
    "response": "Experimenta el máximo rendimiento con este laptop gaming...",
    "model": "gemini-2.5-flash",
    "usage": {
      "promptTokenCount": 25,
      "candidatesTokenCount": 150,
      "totalTokenCount": 175
    }
  }
}
```

---

## 📦 Productos

### Listar Productos

**Verbo:** `GET`  
**Ruta:** `/api/products`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Query Parameters (opcionales):**
- `search` — Búsqueda por nombre
- `min_price` — Precio mínimo
- `max_price` — Precio máximo
- `per_page` — Productos por página (por defecto: 15)

**Ejemplo:**
```
GET /api/products?search=laptop&min_price=500&max_price=2000&per_page=10
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente.",
  "data": [
    {
      "id": 50,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM, RTX 4080",
      "price": "1499.99",
      "ai_description": "Laptop de alta gama para gaming profesional...",
      "images": ["https://images.unsplash.com/photo-laptop"],
      "created_at": "2026-02-14T10:00:00.000000Z",
      "updated_at": "2026-02-14T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

> **Nota:** Los productos se ordenan por ID descendente (más recientes primero). El campo `price` se devuelve como string decimal.

---

### Ver Producto Específico

**Verbo:** `GET`  
**Ruta:** `/api/products/{id}`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto obtenido exitosamente.",
  "data": {
    "id": 1,
    "name": "Laptop Gaming",
    "features": "Intel i9, 32GB RAM, RTX 4080",
    "price": "1499.99",
    "ai_description": "Laptop de alta gama...",
    "images": ["https://images.unsplash.com/photo-laptop"],
    "created_at": "2026-02-14T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:00:00.000000Z"
  }
}
```

---

### Crear Producto

**Verbo:** `POST`  
**Ruta:** `/api/products`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop Gaming Pro",
  "features": "Intel Core i9-13900K, NVIDIA RTX 4080, 32GB RAM DDR5",
  "price": 1899.99,
  "ai_description": "Descripción opcional generada por IA",
  "images": [
    "https://images.unsplash.com/photo-laptop-1",
    "https://images.unsplash.com/photo-laptop-2"
  ]
}
```

**Campos:**
- `name` (requerido, string, máx. 255 caracteres)
- `features` (opcional, string, máx. 500 caracteres)
- `price` (opcional, numeric, rango: 0-999999.99)
- `ai_description` (opcional, string)
- `images` (opcional, array de URLs, máx. 5 elementos, cada URL máx. 2048 caracteres)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente.",
  "data": {
    "id": 51,
    "name": "Laptop Gaming Pro",
    "features": "Intel Core i9-13900K, NVIDIA RTX 4080, 32GB RAM DDR5",
    "price": "1899.99",
    "ai_description": "Descripción opcional generada por IA",
    "images": [
      "https://images.unsplash.com/photo-laptop-1",
      "https://images.unsplash.com/photo-laptop-2"
    ],
    "created_at": "2026-02-14T12:00:00.000000Z",
    "updated_at": "2026-02-14T12:00:00.000000Z"
  }
}
```

---

### Actualizar Producto

**Verbo:** `PUT` o `PATCH`  
**Ruta:** `/api/products/{id}`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop Gaming Pro Plus",
  "features": "Intel Core i9-14900K, NVIDIA RTX 4090, 64GB RAM DDR5",
  "price": 2499.99,
  "images": [
    "https://images.unsplash.com/photo-laptop-new"
  ]
}
```

**Campos:**
- `name` (opcional pero requerido si se incluye, string, máx. 255 caracteres)
- `features` (opcional, string, máx. 500 caracteres)
- `price` (opcional, numeric, rango: 0-999999.99)
- `ai_description` (opcional, string)
- `images` (opcional, array de URLs, máx. 5 elementos, cada URL máx. 2048 caracteres)

**Nota:** Con `PATCH` puedes enviar solo los campos que deseas actualizar.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente.",
  "data": {
    "id": 51,
    "name": "Laptop Gaming Pro Plus",
    "features": "Intel Core i9-14900K, NVIDIA RTX 4090, 64GB RAM DDR5",
    "price": "2499.99",
    "ai_description": "Descripción actualizada...",
    "images": [
      "https://images.unsplash.com/photo-laptop-new"
    ],
    "created_at": "2026-02-14T12:00:00.000000Z",
    "updated_at": "2026-02-14T13:00:00.000000Z"
  }
}
```

---

### Eliminar Producto

**Verbo:** `DELETE`  
**Ruta:** `/api/products/{id}`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente."
}
```

---

### Buscar Productos

**Verbo:** `GET`  
**Ruta:** `/api/products/search/{term}`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Ejemplo:**
```
GET /api/products/search/laptop
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Búsqueda completada.",
  "data": [
    {
      "id": 50,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM",
      "price": "1499.99",
      "ai_description": "Laptop de alta gama...",
      "images": ["https://images.unsplash.com/photo-laptop"],
      "created_at": "2026-02-14T10:00:00.000000Z",
      "updated_at": "2026-02-14T10:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

> **Nota:** Los resultados de búsqueda se ordenan por fecha de creación descendente (más recientes primero).

---

### Generar Descripción con IA

**Verbo:** `POST`  
**Ruta:** `/api/products/{id}/generate-description`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

> **Nota:** La descripción se genera automáticamente usando el nombre, características y precio del producto. Se utiliza el modelo `gemini-2.5-flash` internamente.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Descripción generada exitosamente.",
  "data": {
    "id": 4,
    "name": "Sony WH-1000XM6",
    "features": "Cancelación de ruido adaptativa, 40h batería, LDAC",
    "price": "399.99",
    "ai_description": "Sumérgete en un mundo de sonido puro con los nuevos Sony WH-1000XM6...",
    "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
    "created_at": "2026-02-14T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:30:00.000000Z"
  }
}
```

---

## � Stock

> **Autenticación:** API Key (`X-API-Key` o `Authorization: Bearer sk_...`)

### Listar Stocks

```
GET /api/stocks
```

**Query Parameters opcionales:**

| Parámetro    | Tipo    | Descripción                    |
|--------------|---------|--------------------------------|
| `search`     | string  | Buscar por nombre del producto |
| `product_id` | integer | Filtrar por ID de producto     |
| `per_page`   | integer | Resultados por página (def: 15)|

**Response (200):**

```json
{
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
      "created_at": "2026-02-16T00:00:00.000000Z",
      "updated_at": "2026-02-16T00:00:00.000000Z",
      "product": {
        "id": 1,
        "name": "MacBook Pro 16\" M4 Max",
        "features": "Chip M4 Max, 48GB RAM, 1TB SSD...",
        "price": "3499.99",
        "ai_description": null,
        "images": ["https://..."],
        "created_at": "2026-02-14T00:00:00.000000Z",
        "updated_at": "2026-02-14T00:00:00.000000Z"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 15,
    "total": 50
  }
}
```

### Ver Stock Específico

```
GET /api/stocks/{id}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Stock obtenido exitosamente.",
  "data": {
    "id": 1,
    "product_id": 1,
    "stock": 50,
    "unit_value": "1749.99",
    "sale_value": "3499.99",
    "total_stock": "87499.50",
    "created_at": "2026-02-16T00:00:00.000000Z",
    "updated_at": "2026-02-16T00:00:00.000000Z",
    "product": {
      "id": 1,
      "name": "MacBook Pro 16\" M4 Max",
      "features": "...",
      "price": "3499.99",
      "ai_description": null,
      "images": ["https://..."],
      "created_at": "2026-02-14T00:00:00.000000Z",
      "updated_at": "2026-02-14T00:00:00.000000Z"
    }
  }
}
```

### Ver Stock por Producto

```
GET /api/stocks/product/{productId}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Stock del producto obtenido exitosamente.",
  "data": {
    "id": 1,
    "product_id": 1,
    "stock": 50,
    "unit_value": "1749.99",
    "sale_value": "3499.99",
    "total_stock": "87499.50",
    "created_at": "2026-02-16T00:00:00.000000Z",
    "updated_at": "2026-02-16T00:00:00.000000Z",
    "product": {
      "id": 1,
      "name": "MacBook Pro 16\" M4 Max",
      "features": "...",
      "price": "3499.99",
      "ai_description": null,
      "images": ["https://..."],
      "created_at": "2026-02-14T00:00:00.000000Z",
      "updated_at": "2026-02-14T00:00:00.000000Z"
    }
  }
}
```

**Response (404) — Sin stock:**

```json
{
  "success": false,
  "message": "Este producto no tiene stock registrado.",
  "error": "Stock no encontrado para el producto especificado."
}
```

### Crear Stock

```
POST /api/stocks
```

**Body:**

```json
{
  "product_id": 1,
  "stock": 100,
  "unit_value": 1500.00,
  "sale_value": 2999.99
}
```

| Campo        | Tipo    | Requerido | Descripción                        |
|--------------|---------|-----------|-------------------------------------|
| `product_id` | integer | ✅        | ID del producto (debe existir, único)|
| `stock`      | integer | ✅        | Cantidad en stock (min: 0)          |
| `unit_value` | number  | ✅        | Valor unitario de compra            |
| `sale_value` | number  | ✅        | Valor de venta                      |

> **Nota:** `total_stock` se calcula automáticamente como `stock × unit_value`.

**Response (201):**

```json
{
  "success": true,
  "message": "Stock creado exitosamente.",
  "data": {
    "id": 51,
    "product_id": 1,
    "stock": 100,
    "unit_value": "1500.00",
    "sale_value": "2999.99",
    "total_stock": "150000.00",
    "created_at": "2026-02-16T00:00:00.000000Z",
    "updated_at": "2026-02-16T00:00:00.000000Z",
    "product": {
      "id": 1,
      "name": "MacBook Pro 16\" M4 Max",
      "features": "...",
      "price": "3499.99",
      "ai_description": null,
      "images": ["https://..."],
      "created_at": "2026-02-14T00:00:00.000000Z",
      "updated_at": "2026-02-14T00:00:00.000000Z"
    }
  }
}
```

### Actualizar Stock

```
PUT /api/stocks/{id}
PATCH /api/stocks/{id}
```

**Body (todos opcionales):**

```json
{
  "stock": 75,
  "unit_value": 1600.00,
  "sale_value": 3199.99
}
```

| Campo        | Tipo    | Requerido | Descripción                |
|--------------|---------|-----------|----------------------------|
| `stock`      | integer | ❌        | Nueva cantidad en stock    |
| `unit_value` | number  | ❌        | Nuevo valor unitario       |
| `sale_value` | number  | ❌        | Nuevo valor de venta       |

> **Nota:** `total_stock` se recalcula automáticamente al actualizar.

**Response (200):**

```json
{
  "success": true,
  "message": "Stock actualizado exitosamente.",
  "data": {
    "id": 1,
    "product_id": 1,
    "stock": 75,
    "unit_value": "1600.00",
    "sale_value": "3199.99",
    "total_stock": "120000.00",
    "created_at": "2026-02-16T00:00:00.000000Z",
    "updated_at": "2026-02-16T00:00:00.000000Z",
    "product": {
      "id": 1,
      "name": "MacBook Pro 16\" M4 Max",
      "features": "...",
      "price": "3499.99",
      "ai_description": null,
      "images": ["https://..."],
      "created_at": "2026-02-14T00:00:00.000000Z",
      "updated_at": "2026-02-14T00:00:00.000000Z"
    }
  }
}
```

### Eliminar Stock

```
DELETE /api/stocks/{id}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Stock eliminado exitosamente."
}
```

---

## �👨‍💼 Administración

> **Nota:** Los endpoints administrativos usan **tokens Sanctum** (no API Keys). Los tokens expiran en **5 minutos**. Primero inicie sesión con `/api/admin/login` para obtener un token Bearer.

### Login de Administrador

**Verbo:** `POST`  
**Ruta:** `/api/admin/login`  
**Requiere Autenticación:** ❌ No

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Campos:**
- `email` (requerido, email válido)
- `password` (requerido, string)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión de administrador iniciada exitosamente.",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "token": "1|abc123tokenlargoaqui...",
    "token_type": "Bearer",
    "expires_in": "5 minutos"
  }
}
```

**Errores posibles:**
- `422` — Credenciales incorrectas o usuario no es administrador

---

### Logout de Administrador

**Verbo:** `POST`  
**Ruta:** `/api/admin/logout`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión de administrador cerrada exitosamente."
}
```

---

### Obtener Estadísticas

**Verbo:** `GET`  
**Ruta:** `/api/admin/statistics`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente.",
  "data": {
    "total_users": 150,
    "approved_users": 120,
    "pending_users": 30,
    "users_with_api_key": 118
  }
}
```

---

### Listar Todos los Usuarios

**Verbo:** `GET`  
**Ruta:** `/api/admin/users`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Query Parameters (opcionales):**
- `is_approved` — Filtrar por estado de aprobación (`true` o `false`)
- `search` — Buscar por nombre o email
- `per_page` — Usuarios por página (por defecto: 15)
- `page` — Número de página

**Ejemplo:**
```
GET /api/admin/users?is_approved=false&search=juan&per_page=10
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente.",
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "email_verified_at": null,
      "is_approved": true,
      "created_at": "2026-02-10T10:00:00.000000Z",
      "updated_at": "2026-02-10T10:00:00.000000Z",
      "roles": [
        {
          "id": 1,
          "name": "client",
          "created_at": "2026-02-10T10:00:00.000000Z",
          "updated_at": "2026-02-10T10:00:00.000000Z",
          "pivot": {
            "user_id": 1,
            "role_id": 1
          }
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  }
}
```

---

### Listar Usuarios Pendientes

**Verbo:** `GET`  
**Ruta:** `/api/admin/users/pending`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Query Parameters (opcionales):**
- `per_page` — Usuarios por página (por defecto: 15)
- `page` — Número de página

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios pendientes obtenidos exitosamente.",
  "data": [
    {
      "id": 25,
      "name": "María López",
      "email": "maria@example.com",
      "email_verified_at": null,
      "is_approved": false,
      "created_at": "2026-02-14T09:00:00.000000Z",
      "updated_at": "2026-02-14T09:00:00.000000Z",
      "roles": [
        {
          "id": 1,
          "name": "client",
          "created_at": "2026-02-10T10:00:00.000000Z",
          "updated_at": "2026-02-10T10:00:00.000000Z",
          "pivot": {
            "user_id": 25,
            "role_id": 1
          }
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 3
  }
}
```

---

### Ver Usuario Específico

**Verbo:** `GET`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente.",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "email_verified_at": null,
    "is_approved": true,
    "created_at": "2026-02-10T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:00:00.000000Z",
    "roles": [
      {
        "id": 1,
        "name": "client",
        "created_at": "2026-02-10T10:00:00.000000Z",
        "updated_at": "2026-02-10T10:00:00.000000Z",
        "pivot": {
          "user_id": 1,
          "role_id": 1
        }
      }
    ]
  }
}
```

---

### Actualizar Usuario

**Verbo:** `PUT` o `PATCH`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

**Campos:**
- `name` (opcional, string, máx. 255 caracteres)
- `email` (opcional, email único, máx. 255 caracteres)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente.",
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "is_approved": true,
    "created_at": "2026-02-10T10:00:00.000000Z",
    "updated_at": "2026-02-14T14:00:00.000000Z"
  }
}
```

---

### Eliminar Usuario

**Verbo:** `DELETE`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente."
}
```

---

### Aprobar Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/approve`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario aprobado exitosamente.",
  "data": {
    "user": {
      "id": 25,
      "name": "María López",
      "email": "maria@example.com",
      "is_approved": true,
      "created_at": "2026-02-14T09:00:00.000000Z"
    },
    "api_key": "sk_nuevakeybase64encodedaqui...",
    "already_approved": false
  }
}
```

> **Nota:** Si el usuario ya estaba aprobado, `already_approved` será `true` y el mensaje cambia a "El usuario ya estaba aprobado."

---

### Revocar Aprobación de Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/revoke`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Aprobación revocada exitosamente.",
  "data": {
    "id": 25,
    "name": "María López",
    "email": "maria@example.com",
    "is_approved": false
  }
}
```

---

### Regenerar API Key de Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/regenerate-key`  
**Requiere Token Sanctum:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_token_sanctum}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "API Key regenerada exitosamente.",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true
    },
    "api_key": "sk_nuevakeybase64encodedaqui..."
  }
}
```

> **Nota:** El usuario debe estar aprobado. Si no lo está, se devuelve un error 400.

---

## 📝 Notas Importantes

### Autenticación Dual

La API usa **dos sistemas de autenticación** independientes:

| Sistema | Uso | Expiración | Header |
|---------|-----|------------|--------|
| **API Key** | Clientes (productos, IA, stock, perfil) | Sin expiración | `Authorization: Bearer {api_key}` o `X-API-Key: {api_key}` |
| **Token Sanctum** | Administradores e Interviewers (gestión de usuarios) | **5 minutos** | `Authorization: Bearer {token}` |

Las API Keys tienen formato `sk_...` y se generan al hacer login o al ser aprobado por un admin.

### Roles del Sistema

| Rol | Descripción | API Key | Token Sanctum | Acceso Admin |
|-----|-------------|---------|---------------|--------------|
| **client** | Cliente estándar | ✅ | ❌ | ❌ |
| **interviewer** | Entrevistador con acceso completo | ✅ | ✅ | ✅ |
| **admin** | Administrador del sistema | ✅ | ✅ | ✅ |

> **Nota:** El rol `interviewer` tiene acceso completo a todo el sistema (endpoints de clientes + administración), ideal para pruebas y entrevistas técnicas.

#### Flujo de Clientes
1. `POST /api/auth/register` → Registro (pendiente aprobación)
2. Admin aprueba el usuario
3. `POST /api/auth/login` → Obtiene API Key (`sk_...`)
4. Usa API Key en todos los endpoints de productos, stock e IA

#### Flujo de Administradores / Interviewers
1. `POST /api/admin/login` → Obtiene token Sanctum (expira en 5 min)
2. Usa token en todos los endpoints de `/api/admin/*`
3. Si el token expira, hacer login de nuevo
4. `POST /api/admin/logout` → Revoca el token manualmente

> 💡 También se puede obtener el `admin_token` desde `/api/auth/login` si el usuario es admin o interviewer, evitando un segundo login.

### Content-Type

Para todas las peticiones con body (POST, PUT, PATCH), incluye:

```http
Content-Type: application/json
```

### URL Base

Todas las rutas están precedidas por la URL base de tu aplicación:

```
http://localhost:8000/api/
```

### Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| `200 OK` | Solicitud exitosa |
| `201 Created` | Recurso creado exitosamente |
| `400 Bad Request` | Datos de entrada inválidos |
| `401 Unauthorized` | API Key/Token inválido o no proporcionado |
| `403 Forbidden` | No tienes permisos (requiere rol admin) |
| `404 Not Found` | Recurso no encontrado |
| `422 Unprocessable Entity` | Error de validación |
| `500 Internal Server Error` | Error del servidor |

### Formato de Errores

**Error de validación (422):**
```json
{
  "success": false,
  "message": "Error de validación.",
  "errors": {
    "email": [
      "El correo electrónico ya está registrado."
    ],
    "password": [
      "La contraseña debe tener al menos 8 caracteres."
    ]
  }
}
```

**Error de autenticación (401):**
```json
{
  "success": false,
  "message": "API Key no proporcionada.",
  "error": "Debe incluir la API Key en el header Authorization (Bearer token) o X-API-Key."
}
```

**Error del servidor (500):**
```json
{
  "success": false,
  "message": "Error al crear producto.",
  "error": "Descripción del error..."
}
```

---

## 🚀 Ejemplo Completo de Flujo

### Flujo de Cliente

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo","email":"demo@example.com","password":"password123","password_confirmation":"password123"}'

# 2. (Admin aprueba al usuario)

# 3. Login y obtener API Key
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
# Respuesta incluye: "api_key": "sk_..."

# 4. Listar productos
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer sk_tu_api_key"

# 5. Crear producto
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer sk_tu_api_key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Producto","features":"Increíble","price":99.99,"images":["https://example.com/img.jpg"]}'

# 6. Generar descripción con IA
curl -X POST http://localhost:8000/api/products/1/generate-description \
  -H "Authorization: Bearer sk_tu_api_key"
```

### Flujo de Administrador

```bash
# 1. Login admin
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
# Respuesta: "token": "1|abc123..." (expira en 5 min)

# 2. Ver usuarios pendientes
curl http://localhost:8000/api/admin/users/pending \
  -H "Authorization: Bearer 1|abc123tokenaqui"

# 3. Aprobar usuario
curl -X POST http://localhost:8000/api/admin/users/25/approve \
  -H "Authorization: Bearer 1|abc123tokenaqui"

# 4. Logout
curl -X POST http://localhost:8000/api/admin/logout \
  -H "Authorization: Bearer 1|abc123tokenaqui"
```

---

**Fecha de actualización:** 14 de febrero de 2026  
**Versión de Laravel:** 12.x  
**Base de datos:** PostgreSQL (Supabase)
