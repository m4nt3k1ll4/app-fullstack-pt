# 📖 Guía de Uso de la API

Esta guía documenta todos los endpoints disponibles en la API, especificando el verbo HTTP, la ruta y el body requerido para cada solicitud.

---

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Usuario Autenticado](#usuario-autenticado)
3. [Inteligencia Artificial](#inteligencia-artificial)
4. [Productos](#productos)
5. [Administración](#administración)

---

## 🔐 Autenticación

### Registrar Usuario

**Verbo:** `POST`  
**Ruta:** `/api/auth/register`  
**Requiere API Key:** ❌ No

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
  "message": "Usuario registrado exitosamente",
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
**Requiere API Key:** ❌ No

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

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true,
      "roles": ["client"]
    },
    "api_key": "base64encodedkey..."
  }
}
```

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
  "message": "Usuario autenticado",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true,
      "created_at": "2026-02-14T10:00:00.000000Z",
      "roles": ["client"]
    }
  }
}
```

---

## 🤖 Inteligencia Artificial

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
  "prompt": "Escribe una descripción para un laptop gaming",
  "model": "gemini-pro",
  "max_tokens": 1000,
  "temperature": 0.7
}
```

**Campos:**
- `prompt` (requerido, string, máx. 4000 caracteres)
- `model` (opcional, valores: "gemini-pro", "gemini-pro-vision", por defecto: "gemini-pro")
- `max_tokens` (opcional, integer, rango: 1-8000, por defecto: 1000)
- `temperature` (opcional, numeric, rango: 0-1, por defecto: 0.7)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Prompt procesado exitosamente",
  "data": {
    "prompt": "Escribe una descripción para un laptop gaming",
    "response": "Un laptop gaming de alta gama con procesador Intel Core i9...",
    "model": "gemini-pro",
    "tokens_used": 150
  }
}
```

---

### Procesar Múltiples Prompts (Batch)

**Verbo:** `POST`  
**Ruta:** `/api/ai/batch`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "prompts": [
    {
      "prompt": "Describe un smartphone premium",
      "model": "gemini-pro"
    },
    {
      "prompt": "Características de unos auriculares inalámbricos",
      "model": "gemini-pro",
      "max_tokens": 500
    }
  ]
}
```

**Campos:**
- `prompts` (requerido, array de objetos)
  - Cada objeto tiene los mismos campos que `/api/ai/prompt`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Batch procesado exitosamente",
  "data": {
    "results": [
      {
        "prompt": "Describe un smartphone premium",
        "response": "Un smartphone de última generación...",
        "model": "gemini-pro"
      },
      {
        "prompt": "Características de unos auriculares inalámbricos",
        "response": "Auriculares con cancelación de ruido...",
        "model": "gemini-pro"
      }
    ],
    "total_processed": 2
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
- `search` - Búsqueda por nombre o características
- `min_price` - Precio mínimo
- `max_price` - Precio máximo
- `per_page` - Productos por página (por defecto: 15)

**Ejemplo:**
```
GET /api/products?search=laptop&min_price=500&max_price=2000&per_page=10
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM, RTX 4080",
      "price": 1499.99,
      "ai_description": "Laptop de alta gama para gaming profesional..."
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 47
  }
}
```

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
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Laptop Gaming",
    "features": "Intel i9, 32GB RAM, RTX 4080",
    "price": 1499.99,
    "ai_description": "Laptop de alta gama...",
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
  "ai_description": "Descripción opcional generada por IA"
}
```

**Campos:**
- `name` (requerido, string, máx. 255 caracteres)
- `features` (opcional, string, máx. 500 caracteres)
- `price` (opcional, numeric, rango: 0-999999.99)
- `ai_description` (opcional, string)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 5,
    "name": "Laptop Gaming Pro",
    "features": "Intel Core i9-13900K, NVIDIA RTX 4080, 32GB RAM DDR5",
    "price": 1899.99,
    "ai_description": "Descripción opcional generada por IA",
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
  "price": 2499.99
}
```

**Campos:**
- `name` (opcional pero requerido si se incluye, string, máx. 255 caracteres)
- `features` (opcional, string, máx. 500 caracteres)
- `price` (opcional, numeric, rango: 0-999999.99)
- `ai_description` (opcional, string)

**Nota:** Con `PATCH` puedes enviar solo los campos que deseas actualizar.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 5,
    "name": "Laptop Gaming Pro Plus",
    "features": "Intel Core i9-14900K, NVIDIA RTX 4090, 64GB RAM DDR5",
    "price": 2499.99,
    "ai_description": "Descripción actualizada...",
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
  "message": "Producto eliminado exitosamente",
  "data": null
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
  "message": "Búsqueda completada",
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM",
      "price": 1499.99
    },
    {
      "id": 3,
      "name": "Laptop Ultrabook",
      "features": "Intel i7, 16GB RAM",
      "price": 999.99
    }
  ]
}
```

---

### Generar Descripción con IA

**Verbo:** `POST`  
**Ruta:** `/api/products/{id}/generate-description`  
**Requiere API Key:** ✅ Sí

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Crea una descripción atractiva para este producto enfocada en gamers profesionales",
  "model": "gemini-pro"
}
```

**Campos:**
- `prompt` (opcional, string) - Instrucciones personalizadas para la IA
- `model` (opcional, valores: "gemini-pro", "gemini-pro-vision")

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Descripción generada exitosamente",
  "data": {
    "product": {
      "id": 1,
      "name": "Laptop Gaming",
      "features": "Intel i9, 32GB RAM, RTX 4080",
      "price": 1499.99,
      "ai_description": "Sumérgete en la experiencia gaming definitiva..."
    },
    "ai_response": "Sumérgete en la experiencia gaming definitiva..."
  }
}
```

---

## 👨‍💼 Administración

**Nota:** Todos estos endpoints requieren que el usuario tenga rol de **administrador**.

### Obtener Estadísticas

**Verbo:** `GET`  
**Ruta:** `/api/admin/statistics`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total_users": 150,
    "approved_users": 120,
    "pending_users": 30,
    "total_products": 75,
    "users_by_role": {
      "admin": 5,
      "client": 145
    }
  }
}
```

---

### Listar Todos los Usuarios

**Verbo:** `GET`  
**Ruta:** `/api/admin/users`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Query Parameters (opcionales):**
- `per_page` - Usuarios por página (por defecto: 15)
- `page` - Número de página

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "is_approved": true,
      "roles": ["client"],
      "created_at": "2026-02-10T10:00:00.000000Z"
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
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios pendientes obtenidos exitosamente",
  "data": [
    {
      "id": 25,
      "name": "María López",
      "email": "maria@example.com",
      "is_approved": false,
      "roles": ["client"],
      "created_at": "2026-02-14T09:00:00.000000Z"
    }
  ]
}
```

---

### Ver Usuario Específico

**Verbo:** `GET`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "is_approved": true,
    "roles": ["client"],
    "api_keys_count": 1,
    "created_at": "2026-02-10T10:00:00.000000Z",
    "updated_at": "2026-02-14T10:00:00.000000Z"
  }
}
```

---

### Actualizar Usuario

**Verbo:** `PUT` o `PATCH`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "is_approved": true
}
```

**Campos:**
- `name` (opcional, string, máx. 255 caracteres)
- `email` (opcional, email único, máx. 255 caracteres)
- `is_approved` (opcional, boolean)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "is_approved": true,
    "updated_at": "2026-02-14T14:00:00.000000Z"
  }
}
```

---

### Eliminar Usuario

**Verbo:** `DELETE`  
**Ruta:** `/api/admin/users/{id}`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": null
}
```

---

### Aprobar Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/approve`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario aprobado exitosamente",
  "data": {
    "id": 25,
    "name": "María López",
    "email": "maria@example.com",
    "is_approved": true,
    "updated_at": "2026-02-14T15:00:00.000000Z"
  }
}
```

---

### Revocar Aprobación de Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/revoke`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Aprobación revocada exitosamente",
  "data": {
    "id": 25,
    "name": "María López",
    "email": "maria@example.com",
    "is_approved": false,
    "updated_at": "2026-02-14T15:30:00.000000Z"
  }
}
```

---

### Regenerar API Key de Usuario

**Verbo:** `POST`  
**Ruta:** `/api/admin/users/{id}/regenerate-key`  
**Requiere API Key:** ✅ Sí (Admin)

**Headers:**
```
Authorization: Bearer {tu_api_key}
```

**Body:** ❌ No requiere body

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "API Key regenerada exitosamente",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "new_api_key": "nuevakeybase64encodedaqui..."
  }
}
```

---

## 📝 Notas Importantes

### Headers Requeridos

Para todas las rutas protegidas, debes incluir uno de estos headers:

```http
Authorization: Bearer {tu_api_key}
```

O bien:

```http
X-API-Key: {tu_api_key}
```

### Content-Type

Para todas las peticiones con body (POST, PUT, PATCH), incluye:

```http
Content-Type: application/json
```

### URL Base

Todas las rutas están precedidas por la URL base de tu aplicación. Ejemplo:

```
http://localhost:8000/api/auth/register
```

O en producción:

```
https://tudominio.com/api/auth/register
```

### Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos de entrada inválidos
- `401 Unauthorized` - API Key inválida o no proporcionada
- `403 Forbidden` - No tienes permisos (requiere rol admin)
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Error de validación
- `500 Internal Server Error` - Error del servidor

### Formato de Errores de Validación

```json
{
  "success": false,
  "message": "Los datos proporcionados son inválidos",
  "errors": {
    "email": [
      "El correo electrónico ya está registrado"
    ],
    "password": [
      "La contraseña debe tener al menos 8 caracteres"
    ]
  }
}
```

---

## 🚀 Ejemplo Completo de Flujo

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Demo",
    "email": "demo@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Nota: El usuario se crea automáticamente con rol "client"
# Los administradores deben asignarse manualmente en la base de datos
```

### 2. Iniciar sesión y obtener API Key

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

### 3. Usar la API Key para acceder a rutas protegidas

```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer tu_api_key_aqui"
```

### 4. Crear un producto

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer tu_api_key_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Producto",
    "features": "Características increíbles",
    "price": 99.99
  }'
```

---

## 🔗 Enlaces Útiles

- **Documentación Completa:** Ver `DOCUMENTATION.md`
- **README:** Ver `README.md`
- **Postman Collection:** Importa esta documentación en Postman para pruebas rápidas

---

**Fecha de actualización:** 14 de febrero de 2026  
**Versión de Laravel:** 11.x / 12.x  
**Base de datos:** PostgreSQL
