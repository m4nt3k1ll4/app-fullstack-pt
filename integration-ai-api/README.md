# 🚀 API de Integración - Laravel Backend

API REST construida con Laravel 11 que proporciona:
- ✅ Sistema de autenticación con API Keys seguras
- ✅ Sistema de roles (Admin y Client)
- ✅ Panel administrativo para gestión de usuarios
- ✅ CRUD completo de productos
- ✅ Integración con servicios de IA (Gemini)
- ✅ Arquitectura limpia (Controllers → Services → Models)
- ✅ Base de datos PostgreSQL

---

## 📚 Documentación Completa

**👉 [DOCUMENTATION.md](DOCUMENTATION.md) - Documentación completa consolidada**

Incluye:
- Instalación paso a paso
- Arquitectura del proyecto
- Sistema de roles y permisos
- Todos los endpoints de la API
- Guía de integración frontend (React, Axios, Fetch)
- Ejemplos de código completos
- Autenticación y seguridad
- Testing y verificación

---

## ⚡ Quick Start

### Requisitos Previos

- PHP 8.2+
- Composer
- PostgreSQL 14+

### 1. Instalar dependencias

```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Configurar base de datos en `.env`

**PostgreSQL debe estar ejecutándose.**

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
php artisan migrate
php artisan db:seed --class=RoleSeeder
```

### 5. Crear usuario administrador

```bash
php artisan tinker

$admin = User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('admin123'),
    'is_approved' => true
]);
$admin->assignRole('admin');
```

### 6. Iniciar servidor

```bash
php artisan serve
```

**API disponible en:** `http://localhost:8000/api`

---

## 🏗️ Arquitectura

```
Controllers → Services → Models
```

- **Controllers**: Reciben peticiones, delegan a Services
- **Services**: Contienen toda la lógica de negocio
- **Models**: Interacción con base de datos
- **Form Requests**: Validación centralizada
- **Middleware**: Autenticación y autorización

---

## 📡 Endpoints Principales

### 🔓 Públicos
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login y obtener API Key

### 🔒 Protegidos (requieren API Key)

**Panel Administrativo (Solo Admin):**
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/users/pending` - Pendientes de aprobación
- `POST /api/admin/users/{id}/approve` - Aprobar usuario
- `POST /api/admin/users/{id}/regenerate-key` - Regenerar API Key
- `GET /api/admin/statistics` - Estadísticas

**Productos:**
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

**IA:**
- `POST /api/ai/prompt` - Procesar prompt
- `POST /api/ai/batch` - Procesar múltiples prompts

👉 **Ver documentación completa en [DOCUMENTATION.md](DOCUMENTATION.md)**

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren:

```
Authorization: Bearer {API_KEY}
```

**Flujo:**
1. Usuario se registra → `POST /api/auth/register`
2. Admin aprueba → `POST /api/admin/users/{id}/approve`
3. Usuario hace login → `POST /api/auth/login` (obtiene API Key)
4. Usa API Key en todas las peticiones protegidas

---

## 🎯 Sistema de Roles

- **Admin**: Acceso completo (gestión de usuarios, productos, IA)
- **Client**: Acceso a productos e IA (sin panel administrativo)

```php
// Verificar roles
$user->isAdmin();   // bool
$user->isClient();  // bool
$user->hasRole('admin'); // bool
```

---

## 🧪 Testing Rápido con cURL

```bash
# Registro
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Listar productos (con API Key)
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer sk_YOUR_API_KEY"
```

---

## 📦 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/        # AuthController, AdminController, ProductsController, AIController
│   ├── Middleware/         # ValidateApiKey, IsAdmin
│   └── Requests/           # RegisterRequest, LoginRequest, etc.
├── Models/                 # User, Role, Products
└── Services/               # AuthService, AdminService, ProductService, AIService

database/
├── migrations/             # Tablas users, roles, role_user, products
└── seeders/                # RoleSeeder

routes/
└── api.php                 # Todas las rutas de la API
```

---

## 💡 Ejemplos de Uso

### JavaScript/React

```javascript
// Login y guardar API Key
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { api_key, user } = await response.json().data;
localStorage.setItem('api_key', api_key);
localStorage.setItem('user', JSON.stringify(user));

// Usar en peticiones
const products = await fetch('http://localhost:8000/api/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('api_key')}`
  }
});
```

👉 **Más ejemplos en [DOCUMENTATION.md](DOCUMENTATION.md)**

---

## 🛠️ Comandos Útiles

```bash
# Migraciones
php artisan migrate
php artisan migrate:fresh --seed

# Crear roles
php artisan db:seed --class=RoleSeeder

# Tinker (consola interactiva)
php artisan tinker

# Ver rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 🔗 Enlaces Útiles

- **[Documentación Completa](DOCUMENTATION.md)** - Guía detallada de todo el proyecto
- [Laravel 11 Docs](https://laravel.com/docs/11.x)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

**¡Happy coding! 🚀**
