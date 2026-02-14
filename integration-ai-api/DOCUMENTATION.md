# 🚀 Documentación Completa - API de Integración Laravel

**API REST construida con Laravel 11 + PostgreSQL**

---

## 📚 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Instalación](#-instalación)
3. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
4. [Sistema de Roles](#-sistema-de-roles)
5. [Endpoints de la API](#-endpoints-de-la-api)
6. [Guía de Integración Frontend](#-guía-de-integración-frontend)
7. [Autenticación y Seguridad](#-autenticación-y-seguridad)
8. [Ejemplos de Código](#-ejemplos-de-código)

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Registro de usuarios con aprobación manual
- Login con generación de API Key segura (Base64, SHA-256)
- Middleware de validación de API Key
- Sistema de roles: Admin y Client

### 👨‍💼 Panel Administrativo
- Listar todos los usuarios
- Ver usuarios pendientes de aprobación
- Aprobar/Revocar acceso de usuarios
- Regenerar API Keys
- Estadísticas del sistema
- Gestión de usuarios completa (CRUD)

### 📦 Gestión de Productos
- CRUD completo (Create, Read, Update, Delete)
- Búsqueda y filtros avanzados
- Generación automática de descripciones con IA
- Paginación

### 🤖 Integración con IA
- Procesamiento de prompts individuales
- Procesamiento en lote
- Configuración de modelos y parámetros (Gemini)

### 🛠️ Stack Tecnológico
- **Backend**: Laravel 12
- **Base de Datos**: PostgreSQL
- **Autenticación**: API Keys (Base64 + SHA-256)
- **IA**: Google Gemini API
- **Arquitectura**: Clean Architecture (Controllers → Services → Models)

---

## 🔧 Instalación

### Requisitos Previos

- PHP 8.2 o superior
- Composer
- PostgreSQL 14 o superior
- Extensión PHP pgsql habilitada

### 1. Clonar y configurar

```bash
cd integration-ai-api
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Configurar base de datos

**Asegúrate de tener PostgreSQL instalado y ejecutándose.**

Edita `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 3. Configurar Gemini (opcional)

Obtén tu API Key desde [Google AI Studio](https://makersuite.google.com/app/apikey)

```env
GEMINI_API_KEY=your-api-key-here
```

### 4. Ejecutar migraciones y seeders

```bash
# Ejecutar migraciones
php artisan migrate

# Crear roles admin y client
php artisan db:seed --class=RoleSeeder

# O ejecutar todo junto
php artisan migrate:fresh --seed
```

### 5. Crear primer usuario administrador

```bash
php artisan tinker

use App\Models\User;

$admin = User::create([
    'name' => 'Super Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('admin123'),
    'is_approved' => true,
]);

$admin->assignRole('admin');
$admin->isAdmin(); // true
```

### 6. Iniciar servidor

```bash
php artisan serve
```

API disponible en: `http://localhost:8000/api`

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
integration-ai-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php       # Autenticación (registro, login)
│   │   │   ├── AdminController.php      # Panel administrativo
│   │   │   ├── ProductsController.php   # CRUD de productos
│   │   │   └── AIController.php         # Integración con IA
│   │   ├── Middleware/
│   │   │   ├── ValidateApiKey.php       # Autenticación por API Key
│   │   │   └── IsAdmin.php              # Verificación de rol admin
│   │   └── Requests/
│   │       ├── RegisterRequest.php      # Validación de registro
│   │       ├── LoginRequest.php         # Validación de login
│   │       ├── CreateProductRequest.php # Validación crear producto
│   │       ├── UpdateProductRequest.php # Validación actualizar producto
│   │       └── AIPromptRequest.php      # Validación de prompts IA
│   ├── Models/
│   │   ├── User.php                     # Usuario con relación roles
│   │   ├── Role.php                     # Roles del sistema
│   │   └── Products.php                 # Productos
│   └── Services/
│       ├── ApiKeyService.php            # Generación y validación API Keys
│       ├── AuthService.php              # Lógica de autenticación
│       ├── AdminService.php             # Lógica administrativa
│       ├── ProductService.php           # Lógica de productos
│       └── AIService.php                # Integración con Gemini
├── database/
│   ├── migrations/
│   │   ├── *_create_users_table.php
│   │   ├── *_create_roles_table.php     # Tabla de roles
│   │   ├── *_create_role_user_table.php # Tabla pivote roles-usuarios
│   │   ├── *_create_products_table.php
│   │   └── *_add_api_key_and_approval_to_users_table.php
│   └── seeders/
│       ├── RoleSeeder.php               # Crea roles admin y client
│       └── DatabaseSeeder.php
├── routes/
│   └── api.php                          # Todas las rutas API
└── bootstrap/
    └── app.php                          # Middleware configurado
```

### Principios de Diseño

**Arquitectura Limpia - Separación de Responsabilidades:**

```
┌─────────────────┐
│   HTTP Request  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controllers   │  ← Delgados: reciben peticiones y retornan respuestas
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Form Requests  │  ← Validación centralizada de datos
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Toda la lógica de negocio (NO queries en controllers)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Models      │  ← Interacción con la base de datos
└─────────────────┘
```

**Reglas:**
- ✅ Controllers: Solo reciben requests y retornan respuestas
- ✅ Services: Contienen toda la lógica de negocio
- ✅ No queries directas en controllers
- ✅ Validación centralizada en Form Requests
- ✅ Middleware para autenticación y autorización

---

## 🔐 Sistema de Roles

### Roles Disponibles

#### 1. **Admin** (Administrador)
- Acceso completo al sistema
- Gestión de usuarios
- Aprobar/revocar usuarios
- Acceso a endpoints administrativos
- Acceso a productos e IA

#### 2. **Client** (Cliente)
- Acceso a productos
- Acceso a IA
- NO acceso a endpoints administrativos

### Estructura de Base de Datos

**Relación Many-to-Many:**

```sql
-- Tabla roles
CREATE TABLE roles (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tabla pivote role_user
CREATE TABLE role_user (
    id BIGINT PRIMARY KEY,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(role_id, user_id)
);
```

**Ventajas:**
- ✅ Un usuario puede tener múltiples roles
- ✅ Fácil agregar nuevos roles sin modificar estructura
- ✅ Historial de asignación (timestamps)
- ✅ Prevención de duplicados con índice único

### Métodos del Modelo User

```php
// Relación con roles
$user->roles(); // BelongsToMany

// Verificar rol
$user->isAdmin();           // bool
$user->isClient();          // bool
$user->hasRole('admin');    // bool

// Asignar rol
$user->assignRole('admin');
$user->assignRole('client');
```

### Middleware de Autorización

**IsAdmin Middleware:**
- Protege rutas administrativas
- Valida que el usuario tenga rol 'admin'
- Responde con 403 si no es administrador

```php
// En routes/api.php
Route::middleware(['api.key', 'is.admin'])->group(function () {
    Route::prefix('admin')->group(function () {
        // Rutas solo para administradores
    });
});
```

---

## 📡 Endpoints de la API

### Base URL

```
http://localhost:8000/api
```

### 🔓 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión y obtener API Key |

### 🔒 Endpoints Protegidos (Requieren API Key)

#### Usuario Actual

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/me` | Información del usuario autenticado |

#### Panel Administrativo (Solo Admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/users` | Listar todos los usuarios |
| GET | `/api/admin/users/pending` | Usuarios pendientes de aprobación |
| GET | `/api/admin/users/{id}` | Ver detalles de un usuario |
| PUT | `/api/admin/users/{id}` | Actualizar usuario |
| DELETE | `/api/admin/users/{id}` | Eliminar usuario |
| POST | `/api/admin/users/{id}/approve` | Aprobar usuario |
| POST | `/api/admin/users/{id}/revoke` | Revocar aprobación |
| POST | `/api/admin/users/{id}/regenerate-key` | Regenerar API Key |
| GET | `/api/admin/statistics` | Estadísticas de usuarios |

#### Productos (Todos los usuarios autenticados)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos (con filtros) |
| POST | `/api/products` | Crear producto |
| GET | `/api/products/{id}` | Ver producto específico |
| PUT | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |
| GET | `/api/products/search/{term}` | Buscar productos |
| POST | `/api/products/{id}/generate-description` | Generar descripción con IA |

#### Integración con IA

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ai/prompt` | Procesar un prompt |
| POST | `/api/ai/batch` | Procesar múltiples prompts |

### Filtros Disponibles

**Usuarios (`/api/admin/users`):**
- `is_approved`: boolean - Filtrar por estado de aprobación
- `search`: string - Buscar por nombre o email
- `per_page`: number - Resultados por página (default: 15)

**Productos (`/api/products`):**
- `search`: string - Buscar por nombre
- `min_price`: number - Precio mínimo
- `max_price`: number - Precio máximo
- `per_page`: number - Resultados por página (default: 15)

---

## 🌐 Guía de Integración Frontend

### Autenticación

#### 1. Configurar Cliente HTTP

**Con Axios:**

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el API Key automáticamente
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key');
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

export default api;
```

**Con Fetch:**

```javascript
// api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const apiKey = localStorage.getItem('api_key');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
};
```

#### 2. Registro de Usuario

```javascript
// authService.js
import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.passwordConfirmation,
      // Nota: El rol 'client' se asigna automáticamente en el backend
      // Los roles de admin deben ser asignados manualmente por otro administrador
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

**Respuesta Exitosa:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente. Pendiente de aprobación por administrador.",
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

#### 3. Login y Almacenamiento de API Key

```javascript
// authService.js
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const { api_key, user } = response.data.data;

    // Guardar en localStorage
    localStorage.setItem('api_key', api_key);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

**Respuesta Exitosa:**

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
    "api_key": "sk_abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx"
  }
}
```

**Error - Usuario no aprobado:**

```json
{
  "success": false,
  "message": "Error de validación.",
  "errors": {
    "email": [
      "Tu cuenta está pendiente de aprobación por un administrador."
    ]
  }
}
```

#### 4. Verificar Rol del Usuario

```javascript
// utils/auth.js
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.roles?.some(role => role.name === 'admin') || false;
};

export const isClient = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.roles?.some(role => role.name === 'client') || false;
};

export const hasRole = (roleName) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.roles?.some(role => role.name === roleName) || false;
};
```

#### 5. Protección de Rutas en React

```jsx
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const apiKey = localStorage.getItem('api_key');
  const user = JSON.parse(localStorage.getItem('user'));

  // No autenticado
  if (!apiKey || !user) {
    return <Navigate to="/login" />;
  }

  // Requiere admin pero no lo es
  if (requireAdmin && !user.roles?.some(r => r.name === 'admin')) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Uso en rutas
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Panel Administrativo

#### 1. Listar Todos los Usuarios

```javascript
// adminService.js
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.is_approved !== undefined) {
      params.append('is_approved', filters.is_approved);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.per_page) {
      params.append('per_page', filters.per_page);
    }

    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "users": {
      "data": [
        {
          "id": 1,
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "is_approved": true,
          "roles": [
            {
              "id": 2,
              "name": "client",
              "description": "Cliente con acceso limitado"
            }
          ],
          "created_at": "2026-02-14T10:30:00.000000Z"
        }
      ],
      "current_page": 1,
      "per_page": 15,
      "total": 25
    }
  }
}
```

#### 2. Aprobar Usuario

```javascript
// adminService.js
export const approveUser = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### 3. Regenerar API Key

```javascript
// adminService.js
export const regenerateApiKey = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/regenerate-key`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

**Respuesta:**

```json
{
  "success": true,
  "message": "API Key regenerada exitosamente.",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "api_key": "sk_new1234efgh5678ijkl9012mnop3456qrst7890xyz"
  }
}
```

### Gestión de Productos

#### 1. Listar Productos

```javascript
// productService.js
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const response = await api.get(`/products?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### 2. Crear Producto

```javascript
// productService.js
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', {
      name: productData.name,
      features: productData.features,
      price: productData.price,
      ai_description: productData.aiDescription, // opcional
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### 3. Generar Descripción con IA

```javascript
// productService.js
export const generateDescription = async (productId) => {
  try {
    const response = await api.post(`/products/${productId}/generate-description`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### Integración con IA

#### Procesar Prompt

```javascript
// aiService.js
export const processPrompt = async (prompt, options = {}) => {
  try {
    const response = await api.post('/ai/prompt', {
      prompt: prompt,
      model: options.model || 'gemini-pro',
      max_tokens: options.maxTokens || 150,
      temperature: options.temperature || 0.7,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

---

## 🔐 Autenticación y Seguridad

### API Keys Seguras

**Características:**
- Generadas con `random_bytes(32)` (criptográficamente seguro)
- Codificación Base64 URL-safe
- Prefijo `sk_` para identificación
- Almacenadas con hash SHA-256 en base de datos
- 50+ caracteres de longitud

**Formato:**
```
sk_abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

**Proceso de Generación:**

```php
// En ApiKeyService.php
public function generate(): string
{
    $randomBytes = random_bytes(32);
    $base64 = base64_encode($randomBytes);
    $urlSafe = strtr($base64, '+/', '-_');
    return 'sk_' . rtrim($urlSafe, '=');
}
```

### Middleware de Validación

**ValidateApiKey Middleware:**

```php
// Acepta dos formatos:
Authorization: Bearer {API_KEY}
// O
X-API-Key: {API_KEY}
```

**Flujo de Validación:**

1. ✅ Extrae la API Key del header
2. ✅ Valida el formato (prefijo `sk_` y longitud)
3. ✅ Hashea la key con SHA-256
4. ✅ Busca usuario con ese hash
5. ✅ Verifica que el usuario esté aprobado
6. ✅ Inyecta el usuario en el request

**Respuestas de Error:**

```json
// API Key inválida o no proporcionada
{
  "success": false,
  "message": "No autenticado.",
  "error": "API Key inválida o no proporcionada."
}

// Usuario no aprobado
{
  "success": false,
  "message": "Acceso denegado.",
  "error": "Tu cuenta está pendiente de aprobación."
}
```

### Middleware IsAdmin

**Protección de Rutas Administrativas:**

```php
// Verifica que el usuario tenga rol 'admin'
if (!$user->isAdmin()) {
    return response()->json([
        'success' => false,
        'message' => 'Acceso denegado.',
        'error' => 'No tiene permisos de administrador.',
    ], 403);
}
```

### Flujo de Autenticación Completo

```
1. Usuario se registra
   POST /api/auth/register
   → Usuario creado con is_approved = false
   → Se asigna rol 'client' por defecto
   ↓

2. Admin aprueba usuario
   POST /api/admin/users/{id}/approve
   → is_approved = true
   → Se genera API Key
   → API Key hasheada (SHA-256) se guarda en BD
   ↓

3. Usuario hace login
   POST /api/auth/login
   → Valida credenciales
   → Verifica que is_approved = true
   → Retorna API Key (sin hashear)
   → Frontend guarda API Key
   ↓

4. Usuario accede a recursos protegidos
   GET /api/products (Authorization: Bearer {API_KEY})
   → Middleware valida formato de API Key
   → Hashea la API Key recibida
   → Busca usuario con ese hash
   → Verifica is_approved = true
   → Inyecta usuario en request
   → Controller procesa la petición
   ↓

5. Si intenta acceder a ruta admin
   GET /api/admin/users
   → Middleware ValidateApiKey (paso 4)
   → Middleware IsAdmin verifica $user->isAdmin()
   → Si no es admin: responde 403
   → Si es admin: continúa la petición
```

---

## 💡 Ejemplos de Código

### Ejemplo Completo: Componente React de Login

```jsx
// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { api_key, user } = response.data.data;

      // Guardar en localStorage
      localStorage.setItem('api_key', api_key);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirigir según rol
      const isAdmin = user.roles?.some(r => r.name === 'admin');
      navigate(isAdmin ? '/admin' : '/dashboard');

    } catch (err) {
      const errorMessage = err.response?.data?.errors?.email?.[0]
        || err.response?.data?.message
        || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### Ejemplo: Panel de Administración - Lista de Usuarios

```jsx
// AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = filter === 'pending'
        ? 'is_approved=false'
        : filter === 'approved'
        ? 'is_approved=true'
        : '';

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.data.users.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/approve`);
      alert('Usuario aprobado exitosamente');
      fetchUsers(); // Recargar lista
    } catch (error) {
      alert('Error al aprobar usuario');
    }
  };

  const handleRevoke = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/revoke`);
      alert('Acceso revocado exitosamente');
      fetchUsers();
    } catch (error) {
      alert('Error al revocar acceso');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="admin-users">
      <h2>Gestión de Usuarios</h2>

      <div className="filters">
        <button onClick={() => setFilter('all')}>Todos</button>
        <button onClick={() => setFilter('pending')}>Pendientes</button>
        <button onClick={() => setFilter('approved')}>Aprobados</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={user.is_approved ? 'approved' : 'pending'}>
                  {user.is_approved ? 'Aprobado' : 'Pendiente'}
                </span>
              </td>
              <td>
                {user.roles?.map(r => r.name).join(', ')}
              </td>
              <td>
                {!user.is_approved ? (
                  <button onClick={() => handleApprove(user.id)}>
                    Aprobar
                  </button>
                ) : (
                  <button onClick={() => handleRevoke(user.id)}>
                    Revocar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
```

### Ejemplo: Gestión de Productos con IA

```jsx
// ProductForm.jsx
import React, { useState } from 'react';
import api from '../services/api';

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    features: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/products', formData);
      alert('Producto creado exitosamente');
      onSuccess?.(response.data.data.product);

      // Limpiar formulario
      setFormData({ name: '', features: '', price: '' });
    } catch (error) {
      alert('Error al crear producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIDescription = async () => {
    if (!formData.name || !formData.features) {
      alert('Completa nombre y características primero');
      return;
    }

    setGeneratingAI(true);

    try {
      const response = await api.post('/ai/prompt', {
        prompt: `Genera una descripción de producto para: ${formData.name}. Características: ${formData.features}`,
        max_tokens: 150,
      });

      const description = response.data.data.response;
      setFormData({ ...formData, ai_description: description });
      alert('Descripción generada con IA');
    } catch (error) {
      alert('Error al generar descripción');
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>Crear Producto</h3>

      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Características:</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label>Precio:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción IA:</label>
        <textarea
          name="ai_description"
          value={formData.ai_description || ''}
          onChange={handleChange}
          rows="4"
          placeholder="Genera automáticamente con IA..."
        />
        <button
          type="button"
          onClick={generateAIDescription}
          disabled={generatingAI}
        >
          {generatingAI ? 'Generando...' : 'Generar con IA'}
        </button>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
};

export default ProductForm;
```

---

## 🧪 Testing y Verificación

### Comandos Útiles

```bash
# Ejecutar migraciones
php artisan migrate

# Crear roles
php artisan db:seed --class=RoleSeeder

# Limpiar y recrear BD
php artisan migrate:fresh --seed

# Verificar roles en BD
php artisan tinker
App\Models\Role::all();

# Ver usuarios con roles
php artisan tinker
use App\Models\User;
$user = User::find(1);
$user->roles;
$user->isAdmin();
```

### Probar Endpoints con cURL

**Registro:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Acceso con API Key:**
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer sk_your_api_key_here"
```

---

## ❓ Preguntas Frecuentes

### ¿Cómo agrego más roles?

```php
// En tinker o un seeder
use App\Models\Role;

Role::create([
    'name' => 'moderator',
    'description' => 'Moderador con permisos intermedios',
]);
```

### ¿Puedo asignar múltiples roles a un usuario?

Sí, la relación many-to-many lo permite:

```php
$user->assignRole('admin');
$user->assignRole('client');
```

### ¿Cómo elimino un rol de un usuario?

```php
$adminRole = Role::where('name', 'admin')->first();
$user->roles()->detach($adminRole->id);
```

### ¿La API Key expira?

No, las API Keys no expiran automáticamente. Puedes:
- Regenerarlas manualmente desde el panel admin
- Revocar acceso al usuario
- Implementar expiración personalizada si lo necesitas

### ¿Cómo manejo errores 401 y 403 en el frontend?

```javascript
// Interceptor de respuestas Axios
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // API Key inválida o expirada
      localStorage.removeItem('api_key');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Sin permisos
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);
```

---

## 📞 Soporte y Contacto

Para más información, consulta los archivos de configuración del proyecto o contacta al equipo de desarrollo.

**Archivos importantes:**
- `.env` - Configuración de entorno
- `routes/api.php` - Todas las rutas de la API
- `config/services.php` - Configuración de servicios externos (Gemini)
- `database/migrations/` - Esquema de base de datos

---

**Última actualización:** Febrero 2026
