# Estructura del Proyecto - Next.js Dashboard

## 📋 Descripción General

Este es un proyecto de **Next.js 16** que implementa un dashboard administrativo con funcionalidades de autenticación, gestión de facturas (invoices) y clientes (customers). Utiliza el **App Router** de Next.js, **TypeScript**, **Tailwind CSS** y **NextAuth** para la autenticación.

---

## 🗂️ Estructura de Archivos y Carpetas

```
proyecto-app/
├── app/                          # Directorio principal de la aplicación (App Router)
├── public/                       # Archivos estáticos
├── Archivos de configuración     # Raíz del proyecto
```

---

## 📂 Directorio `/app` (App Router)

El directorio `app/` sigue la convención del **App Router** de Next.js, donde la estructura de carpetas define las rutas de la aplicación.

### 🏠 Páginas Principales

#### `app/page.tsx`
- **Ruta:** `/` (página de inicio)
- **Propósito:** Landing page de bienvenida
- **Características:**
  - Presenta la aplicación "myApp"
  - Botón de login que redirige a `/login`
  - Imágenes responsive (hero-desktop y hero-mobile)
  - Usa el componente `Header`

#### `app/layout.tsx`
- **Propósito:** Layout raíz de la aplicación
- **Contenido típico:** Estructura HTML base, providers, metadata global

#### `app/not-found.tsx`
- **Ruta:** Página 404
- **Propósito:** Manejo de rutas no encontradas

---

### 🔐 Autenticación

#### `app/auth.ts`
- **Propósito:** Configuración de NextAuth v5
- **Contenido:**
  - Exporta `handlers`, `signIn`, `signOut`, `auth`
  - Configuración de providers de autenticación
  - Lógica de sesiones y callbacks

#### `app/login/page.tsx`
- **Ruta:** `/login`
- **Propósito:** Página de inicio de sesión
- **Características:**
  - Formulario de login
  - Integración con NextAuth

---

### 📊 Dashboard

#### `app/dashboard/layout.tsx`
- **Propósito:** Layout compartido para todas las rutas del dashboard
- **Contenido típico:**
  - Sidebar de navegación (`SideNav`)
  - Protección de rutas (middleware de autenticación)
  - Estructura de layout para páginas internas

#### `app/dashboard/(overview)/page.tsx`
- **Ruta:** `/dashboard`
- **Propósito:** Página principal del dashboard (overview)
- **Componentes:**
  - `CardWrapper`: Tarjetas con métricas
  - `ChartWrapper`: Gráfico de ingresos recientes
  - `LatestInvoicesWrapper`: Lista de últimas facturas
- **Características:**
  - Uso de `Suspense` para carga diferida
  - Skeletons para mejorar la UX durante la carga
  - Grid responsive

> **Nota:** El uso de `(overview)` es un **route group** que no afecta la URL pero permite agrupar archivos relacionados.

#### `app/dashboard/(overview)/loading.tsx`
- **Propósito:** Estado de carga para la página del dashboard
- **Contenido:** Componente Skeleton mientras se cargan los datos

---

### 👥 Gestión de Clientes

#### `app/dashboard/customers/page.tsx`
- **Ruta:** `/dashboard/customers`
- **Propósito:** Página de listado y gestión de clientes
- **Funcionalidades esperadas:**
  - Tabla de clientes
  - Búsqueda y filtrado
  - Paginación

---

### 🧾 Gestión de Facturas

#### `app/dashboard/invoices/page.tsx`
- **Ruta:** `/dashboard/invoices`
- **Propósito:** Listado de todas las facturas
- **Componentes típicos:**
  - `InvoiceTableWrapper`: Tabla de facturas
  - `Search`: Buscador
  - `PaginationWrapper`: Paginación

#### `app/dashboard/invoices/error.tsx`
- **Propósito:** Manejo de errores específico para la sección de invoices
- **Características:** Error boundary para capturar errores

#### `app/dashboard/invoices/create/page.tsx`
- **Ruta:** `/dashboard/invoices/create`
- **Propósito:** Formulario para crear una nueva factura
- **Componentes:**
  - `FormWrapper`: Formulario de creación

#### `app/dashboard/invoices/[invoiceId]/edit/page.tsx`
- **Ruta:** `/dashboard/invoices/[id]/edit`
- **Propósito:** Formulario para editar una factura existente
- **Características:**
  - Ruta dinámica usando `[invoiceId]`
  - `FormEditWrapper`: Formulario de edición precargado con datos

---

### 🧩 Componentes (`app/componentts/`)

> **Nota:** Hay un typo en el nombre de la carpeta (`componentts` en lugar de `components`)

Componentes reutilizables de la aplicación:

| Componente | Propósito |
|------------|----------|
| `CardWrapper.tsx` | Tarjetas de métricas/estadísticas en el dashboard |
| `ChartWrapper.tsx` | Wrapper para gráficos de ingresos |
| `FormEditWrapper.tsx` | Formulario de edición de facturas |
| `FormWrapper.tsx` | Formulario de creación de facturas |
| `Header.tsx` | Encabezado de la página principal |
| `InvoiceTableWrapper.tsx` | Tabla de facturas con datos |
| `LastestInvoicesWrapper.tsx` | Lista de últimas facturas |
| `Logo.tsx` | Logo de la aplicación |
| `NavLinks.tsx` | Enlaces de navegación del sidebar |
| `PaginationWrapper.tsx` | Componente de paginación |
| `Search.tsx` | Barra de búsqueda |
| `SideNav.tsx` | Navegación lateral del dashboard |
| `Skeleton.tsx` | Componentes de carga (skeletons) |

**Patrón de diseño:** Los componentes con sufijo "Wrapper" típicamente son **Server Components** que obtienen datos y los pasan a componentes de presentación.

---

### 🛠️ Helpers (`app/helpers/`)

Utilidades y funciones auxiliares:

#### `actions.ts`
- **Propósito:** Server Actions de Next.js
- **Contenido:**
  - Acciones del lado del servidor
  - Validación con Zod
  - Operaciones CRUD (crear, actualizar, eliminar facturas)
  - `revalidatePath` para actualizar cache
  - `redirect` para navegación

#### `api.ts`
- **Propósito:** Configuración y llamadas a APIs externas
- **Contenido:**
  - Headers comunes
  - Funciones de fetch
  - Endpoints de la API

#### `auth.ts`
- **Propósito:** Utilidades de autenticación
- **Contenido:**
  - Helpers para verificar sesiones
  - Middleware de autenticación

#### `env.ts`
- **Propósito:** Gestión de variables de entorno
- **Contenido:**
  - Validación de variables de entorno
  - Tipado seguro de env vars

#### `utils.ts`
- **Propósito:** Funciones de utilidad generales
- **Contenido:**
  - `mapZodTreeToFormErrors`: Mapeo de errores de validación Zod
  - Otras funciones helper

---

### 🎨 UI (`app/ui/`)

Archivos relacionados con estilos y diseño:

#### `fonts.ts`
- **Propósito:** Configuración de fuentes personalizadas
- **Contenido:**
  - Importación de fuentes (ej: `bebasNeue`)
  - Optimización con `next/font`

#### `globals.css`
- **Propósito:** Estilos globales de la aplicación
- **Contenido:**
  - Configuración de Tailwind CSS
  - Variables CSS personalizadas
  - Estilos base

---

## 📁 Directorio `/public`

Archivos estáticos accesibles públicamente:

```
public/
├── favicon.ico           # Icono de la página
├── hero-desktop.png      # Imagen hero para desktop
└── hero-mobile.png       # Imagen hero para móvil
```

---

## ⚙️ Archivos de Configuración (Raíz)

### `package.json`
Gestión de dependencias y scripts:

**Dependencias principales:**
- `next` ^16.1.6
- `react` 19.2.3
- `next-auth` ^5.0.0-beta.30 (autenticación)
- `zod` ^4.3.5 (validación de esquemas)
- `anjrot-components` ^2.1.4 (librería de componentes)
- `react-icons` ^5.5.0
- `tailwind-merge` ^3.4.0
- `use-debounce` ^10.1.0

**Scripts disponibles:**
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm start`: Servidor de producción
- `npm run lint`: Linter ESLint

### `next.config.ts`
Configuración de Next.js:
- Configuraciones de compilación
- Redirecciones
- Variables de entorno públicas

### `tsconfig.json`
Configuración de TypeScript:
- Opciones del compilador
- Alias de paths
- Configuración de tipos

### `tailwind.config.js`
Configuración de Tailwind CSS:
- Tema personalizado
- Colores
- Breakpoints
- Plugins

### `postcss.config.js`
Configuración de PostCSS:
- Plugins para procesar CSS
- Integración con Tailwind

### `eslint.config.mjs`
Configuración de ESLint:
- Reglas de linting
- Extensiones (eslint-config-next)

### `globals.d.ts` y `next-env.d.ts`
Archivos de declaración de tipos TypeScript:
- Tipos globales
- Referencias a tipos de Next.js

### `README.md`
Documentación básica del proyecto generada por `create-next-app`

---

## 🏗️ Arquitectura y Patrones

### Server Components vs Client Components
- **Por defecto:** Todos los componentes son Server Components
- **Client Components:** Se marcan con `"use client"` cuando necesitan interactividad

### Server Actions
- Funciones marcadas con `"use server"` en `helpers/actions.ts`
- Permiten ejecutar código del servidor desde componentes cliente
- Integración directa con formularios

### Validación de Datos
- **Zod** para esquemas y validación
- Validación tanto en cliente como en servidor

### Rutas Dinámicas
- `[invoiceId]` para rutas paramétricas
- Permite editar facturas específicas

### Route Groups
- `(overview)` no afecta la URL
- Sirve para organizar archivos relacionados

### Loading y Error Handling
- `loading.tsx` para estados de carga
- `error.tsx` para error boundaries
- `not-found.tsx` para 404s

---

## 🔄 Flujo de Datos

```
Usuario → Formulario (Client Component)
    ↓
Server Action (actions.ts)
    ↓
API Externa (api.ts) ← Validación con Zod
    ↓
Revalidación de Cache (revalidatePath)
    ↓
Redirección (redirect)
```

---

## 🚀 Cómo Funciona

1. **Landing Page (`/`)**: El usuario llega y se le presenta la aplicación
2. **Login (`/login`)**: Autenticación usando NextAuth
3. **Dashboard (`/dashboard`)**: Vista general con métricas y datos
4. **Gestión de Facturas**: Crear, editar, listar facturas
5. **Gestión de Clientes**: Ver y administrar clientes

---

## 📝 Convenciones de Nomenclatura

- **Componentes:** PascalCase (`CardWrapper.tsx`)
- **Helpers:** camelCase (`actions.ts`)
- **Archivos especiales de Next.js:** lowercase (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **Rutas dinámicas:** Entre corchetes (`[invoiceId]`)
- **Route groups:** Entre paréntesis (`(overview)`)

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 16.1.6 | Framework React con SSR |
| React | 19.2.3 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 3.4.x | Framework CSS utility-first |
| NextAuth | 5.0.0-beta | Autenticación |
| Zod | 4.3.5 | Validación de esquemas |
| React Icons | 5.5.0 | Iconos |

---

## 📌 Notas Importantes

1. **App Router:** Este proyecto usa el nuevo App Router de Next.js (no Pages Router)
2. **TypeScript:** Todo el código está tipado con TypeScript
3. **Server Components:** Se aprovechan los Server Components para mejor rendimiento
4. **Server Actions:** Operaciones del servidor sin necesidad de crear rutas API
5. **Suspense:** Mejora la UX con carga progresiva de componentes

---

## 🐛 Observaciones

- Hay un typo en el nombre de la carpeta: `componentts` (debería ser `components`)
- Se recomienda corregir para mantener convenciones estándar

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod Schema Validation](https://zod.dev/)

---

## 🌳 Árbol Completo del Proyecto con Comentarios

```
proyecto-app/
│
├── app/                                    # Directorio raíz del App Router de Next.js
│   ├── page.tsx                           # 🏠 Página de inicio (/) - Landing page con presentación
│   ├── layout.tsx                         # 📐 Layout raíz - HTML base, providers globales, metadata
│   ├── not-found.tsx                      # 🔍 Página 404 - Manejo de rutas no encontradas
│   ├── auth.ts                            # 🔐 Configuración de NextAuth - Handlers de autenticación
│   │
│   ├── login/                             # 🔑 Módulo de autenticación
│   │   └── page.tsx                       # Página de inicio de sesión (/login)
│   │
│   ├── dashboard/                         # 📊 Módulo principal del dashboard
│   │   ├── layout.tsx                     # Layout compartido - Sidebar, protección de rutas
│   │   │
│   │   ├── (overview)/                    # 📈 Vista general del dashboard (route group)
│   │   │   ├── page.tsx                   # Página principal (/dashboard) - Métricas y gráficos
│   │   │   └── loading.tsx                # Estado de carga con skeletons
│   │   │
│   │   ├── customers/                     # 👥 Gestión de clientes
│   │   │   └── page.tsx                   # Lista de clientes (/dashboard/customers)
│   │   │
│   │   └── invoices/                      # 🧾 Gestión de facturas
│   │       ├── page.tsx                   # Lista de todas las facturas (/dashboard/invoices)
│   │       ├── error.tsx                  # Error boundary para capturar errores
│   │       │
│   │       ├── create/                    # ➕ Crear nueva factura
│   │       │   └── page.tsx               # Formulario de creación (/dashboard/invoices/create)
│   │       │
│   │       └── [invoiceId]/               # ✏️ Ruta dinámica para factura específica
│   │           └── edit/
│   │               └── page.tsx           # Formulario de edición (/dashboard/invoices/[id]/edit)
│   │
│   ├── componentts/                       # 🧩 Componentes reutilizables (nota: typo en nombre)
│   │   ├── CardWrapper.tsx                # Tarjetas de métricas del dashboard
│   │   ├── ChartWrapper.tsx               # Wrapper de gráficos de ingresos (Server Component)
│   │   ├── FormEditWrapper.tsx            # Formulario de edición con datos precargados
│   │   ├── FormWrapper.tsx                # Formulario de creación de facturas
│   │   ├── Header.tsx                     # Encabezado de la landing page
│   │   ├── InvoiceTableWrapper.tsx        # Tabla de facturas con fetch de datos
│   │   ├── LastestInvoicesWrapper.tsx     # Lista de últimas facturas (Server Component)
│   │   ├── Logo.tsx                       # Logo de la aplicación
│   │   ├── NavLinks.tsx                   # Enlaces de navegación del sidebar
│   │   ├── PaginationWrapper.tsx          # Componente de paginación con lógica
│   │   ├── Search.tsx                     # Barra de búsqueda con debounce
│   │   ├── SideNav.tsx                    # Navegación lateral completa del dashboard
│   │   └── Skeleton.tsx                   # Componentes de loading (placeholders animados)
│   │
│   ├── helpers/                           # 🛠️ Utilidades y lógica de negocio
│   │   ├── actions.ts                     # Server Actions - CRUD, validación, revalidación
│   │   ├── api.ts                         # Configuración de API - Fetch, headers, endpoints
│   │   ├── auth.ts                        # Helpers de autenticación - Verificación de sesiones
│   │   ├── env.ts                         # Validación de variables de entorno con tipos
│   │   └── utils.ts                       # Funciones de utilidad - Formateo, conversiones
│   │
│   └── ui/                                # 🎨 Estilos y recursos de UI
│       ├── fonts.ts                       # Configuración de fuentes (next/font)
│       └── globals.css                    # Estilos globales - Tailwind, variables CSS, reset
│
├── public/                                # 📁 Archivos estáticos públicos
│   ├── favicon.ico                        # Icono del sitio
│   ├── hero-desktop.png                   # Imagen hero para pantallas grandes
│   └── hero-mobile.png                    # Imagen hero responsive para móviles
│
├── eslint.config.mjs                      # ⚙️ Configuración de ESLint - Reglas de linting
├── globals.d.ts                           # 📝 Declaraciones de tipos TypeScript globales
├── next-env.d.ts                          # 📝 Tipos generados automáticamente por Next.js
├── next.config.ts                         # ⚙️ Configuración de Next.js - Build, redirects, env
├── package.json                           # 📦 Dependencias del proyecto y scripts npm
├── postcss.config.js                      # ⚙️ Configuración de PostCSS - Plugins CSS
├── README.md                              # 📖 Documentación básica del proyecto
├── tailwind.config.js                     # 🎨 Configuración de Tailwind CSS - Tema, colores
├── tsconfig.json                          # ⚙️ Configuración de TypeScript - Compiler options
└── ESTRUCTURA.md                          # 📚 Este archivo - Documentación de la estructura
```

### 📝 Leyenda de Iconos

- 🏠 Páginas principales
- 🔐 Autenticación y seguridad
- 📊 Dashboard y visualización de datos
- 🧾 Gestión de facturas
- 👥 Gestión de usuarios/clientes
- 🧩 Componentes reutilizables
- 🛠️ Utilidades y helpers
- 🎨 Estilos y diseño
- 📁 Archivos estáticos
- ⚙️ Configuración
- 📝 Tipos y declaraciones
- 📦 Gestión de paquetes

---

## 🎯 Árbol Detallado de `/app` (App Router)

```
app/
│
├── 📄 page.tsx                            # PÁGINA RAÍZ (/)
│   └── Landing page con presentación de la app
│       • Componente Header
│       • Botón de login
│       • Imágenes hero responsive
│
├── 📄 layout.tsx                          # LAYOUT RAÍZ
│   └── Estructura HTML base de toda la aplicación
│       • Tags <html>, <body>
│       • Metadata global (SEO)
│       • Providers (SessionProvider, ThemeProvider, etc.)
│       • Fuentes globales
│
├── 📄 not-found.tsx                       # PÁGINA 404
│   └── Manejo de rutas no encontradas
│       • Mensaje de error personalizado
│       • Botón para volver al inicio
│  
│  
│
├── 📁 login/                              # RUTA: /login
│   └── 📄 page.tsx                        # Página de inicio de sesión
│       └── Formulario de login
│           • Campos de email/password
│           • Integración con NextAuth
│           • Validación de formularios
│           • Manejo de errores de autenticación
│
├── 📁 dashboard/                          # RUTA BASE: /dashboard
│   │
│   ├── 📄 layout.tsx                      # LAYOUT DEL DASHBOARD
│   │   └── Estructura compartida para todas las páginas del dashboard
│   │       • SideNav (navegación lateral)
│   │       • Protección de rutas (requiere autenticación)
│   │       • Header con usuario logueado
│   │       • Contenedor principal responsive
│   │
│   ├── 📁 (overview)/                     # ROUTE GROUP (no afecta URL)
│   │   │                                  # RUTA: /dashboard
│   │   ├── 📄 page.tsx                    # Página principal del dashboard
│   │   │   └── Vista general con métricas
│   │   │       • CardWrapper: 4 tarjetas con estadísticas
│   │   │         - Total facturas
│   │   │         - Facturas pagadas
│   │   │         - Facturas pendientes
│   │   │         - Total clientes
│   │   │       • ChartWrapper: Gráfico de ingresos (Suspense)
│   │   │       • LatestInvoicesWrapper: Últimas 5 facturas
│   │   │       • Grid responsive (sm, md, lg breakpoints)
│   │   │
│   │   └── 📄 loading.tsx                 # Estado de carga
│   │       └── Skeletons mientras cargan los datos
│   │           • RevenueChartSkeleton
│   │           • CardsSkeleton
│   │           • LatestInvoicesSkeleton
│   │
│   ├── 📁 customers/                      # RUTA: /dashboard/customers
│   │   └── 📄 page.tsx                    # Listado de clientes
│   │       └── Tabla de clientes con información
│   │           • Tabla con nombre, email, total facturas, total pendiente
│   │           • Búsqueda por nombre
│   │           • Paginación
│   │           • Filtros
│   │
│   └── 📁 invoices/                       # BASE: /dashboard/invoices
│       │
│       ├── 📄 page.tsx                    # RUTA: /dashboard/invoices
│       │   └── Listado completo de facturas
│       │       • InvoiceTableWrapper: Tabla con todas las facturas
│       │         - Nombre del cliente
│       │         - Email
│       │         - Monto
│       │         - Fecha
│       │         - Estado (Paid/Pending)
│       │         - Acciones (Editar/Eliminar)
│       │       • Search: Búsqueda con debounce
│       │       • PaginationWrapper: Navegación entre páginas
│       │       • Botón "Crear Factura"
│       │
│       ├── 📄 error.tsx                   # ERROR BOUNDARY
│       │   └── Captura errores en la sección de invoices
│       │       • Muestra mensaje de error
│       │       • Botón "Try again" para reintentar
│       │       • Evita que la app completa se rompa
│       │
│       ├── 📁 create/                     # RUTA: /dashboard/invoices/create
│       │   └── 📄 page.tsx                # Crear nueva factura
│       │       └── Formulario de creación
│       │           • FormWrapper con Server Action
│       │           • Select de clientes
│       │           • Input de monto
│       │           • Radio buttons de estado (Paid/Pending)
│       │           • Validación con Zod
│       │           • Botones Crear/Cancelar
│       │
│       └── 📁 [invoiceId]/                # RUTA DINÁMICA
│           └── 📁 edit/                   # RUTA: /dashboard/invoices/[id]/edit
│               └── 📄 page.tsx            # Editar factura existente
│                   └── Formulario de edición
│                       • FormEditWrapper precargado con datos
│                       • Obtiene invoiceId de params
│                       • Fetch de datos de la factura
│                       • Campos prellenados
│                       • Server Action para actualizar
│                       • Botones Actualizar/Cancelar
│
├── 📁 components/                        
│   │
│   ├── 📄 CardWrapper.tsx                 # Tarjetas de métricas
│   │   └── Server Component que obtiene stats y renderiza 4 cards
│   │       • Hace fetch de estadísticas
│   │       • Pasa datos a componentes Card
│   │       • Iconos personalizados por tipo
│   │
│   ├── 📄 ChartWrapper.tsx                # Gráfico de ingresos
│   │   └── Server Component que obtiene datos de revenue
│   │       • Fetch de ingresos por mes (últimos 12 meses)
│   │       • Renderiza gráfico de barras/líneas
│   │       • Usa librería de charting (Recharts/Chart.js)
│   │
│   ├── 📄 FormEditWrapper.tsx             # Form de edición
│   │   └── Server Component que carga datos de factura
│   │       • Obtiene datos de la factura por ID
│   │       • Pasa datos al Form Component (Client)
│   │       • Maneja Server Action de actualización
│   │
│   ├── 📄 FormWrapper.tsx                 # Form de creación
│   │   └── Server Component que carga lista de clientes
│   │       • Fetch de clientes para dropdown
│   │       • Pasa clientes al Form Component
│   │       • Maneja Server Action de creación
│   │
│   ├── 📄 Header.tsx                      # Header landing page
│   │   └── Encabezado con logo y navegación
│   │       • Logo de la app
│   │       • Links de navegación
│   │       • Posiblemente botón de login
│   │
│   ├── 📄 InvoiceTableWrapper.tsx         # Tabla de facturas
│   │   └── Server Component con data fetching
│   │       • Obtiene facturas con paginación y búsqueda
│   │       • Procesa query params (page, query)
│   │       • Renderiza filas de la tabla
│   │       • Botones de acción (Editar/Eliminar)
│   │
│   ├── 📄 LastestInvoicesWrapper.tsx      # Últimas facturas
│   │   └── Server Component que obtiene últimas 5 facturas
│   │       • Fetch de invoices ordenadas por fecha
│   │       • Muestra miniatura con info clave
│   │       • Avatar del cliente
│   │
│   ├── 📄 Logo.tsx                        # Logo component
│   │   └── Logo de la aplicación
│   │       • Imagen o SVG del logo
│   │       • Link a home
│   │       • Versión responsive
│   │
│   ├── 📄 NavLinks.tsx                    # Links de navegación
│   │   └── Enlaces del sidebar
│   │       • Home, Invoices, Customers
│   │       • Estado activo (usePathname)
│   │       • Iconos de cada sección
│   │       • "use client" para interactividad
│   │
│   ├── 📄 PaginationWrapper.tsx           # Paginación
│   │   └── Server Component con lógica de páginas
│   │       • Calcula total de páginas
│   │       • Genera botones Previous/Next
│   │       • Números de página
│   │       • Links con query params
│   │
│   ├── 📄 Search.tsx                      # Barra de búsqueda
│   │   └── Client Component con debounce
│   │       • Input controlado
│   │       • useDebounce (300ms)
│   │       • Actualiza URL con query param
│   │       • useSearchParams y usePathname
│   │
│   ├── 📄 SideNav.tsx                     # Navegación lateral
│   │   └── Sidebar completo del dashboard
│   │       • Logo en la parte superior
│   │       • NavLinks (rutas)
│   │       • Botón de Logout al fondo
│   │       • Responsive (oculto en móvil)
│   │
│   └── 📄 Skeleton.tsx                    # Loading skeletons
│       └── Componentes de carga (placeholders)
│           • RevenueChartSkeleton
│           • CardsSkeleton
│           • InvoiceTableSkeleton
│           • LatestInvoicesSkeleton
│           • Animaciones de shimmer
│
├── 📁 helpers/                            # UTILIDADES Y LÓGICA
│   │
│   ├── 📄 actions.ts                      # SERVER ACTIONS
│   │   └── "use server" - Acciones del lado del servidor
│   │       • createInvoice(formData)
│   │         - Validación con Zod
│   │         - Fetch POST a API
│   │         - revalidatePath('/dashboard/invoices')
│   │         - redirect a lista
│   │       • updateInvoice(id, formData)
│   │         - Validación
│   │         - Fetch PUT/PATCH
│   │         - Revalidación
│   │       • deleteInvoice(id)
│   │         - Fetch DELETE
│   │         - Revalidación
│   │       • Manejo de errores con try/catch
│   │       • Retorno de CreateFormState para feedback
│   │
│   ├── 📄 api.ts                          # CONFIGURACIÓN API
│   │   └── Setup de llamadas a API externa
│   │       • Base URL desde env variables
│   │       • headers: { 'Content-Type', 'Authorization' }
│   │       • Funciones wrapper de fetch
│   │         - fetchInvoices(query, page)
│   │         - fetchInvoiceById(id)
│   │         - fetchCustomers()
│   │         - fetchRevenue()
│   │         - fetchStats()
│   │       • Manejo de errores HTTP
│   │       • Tipos TypeScript para responses
│   │
│   ├── 📄 auth.ts                         # HELPERS AUTENTICACIÓN
│   │   └── Utilidades de auth
│   │       • getSession(): Obtiene sesión actual
│   │       • requireAuth(): Middleware para proteger rutas
│   │       • getUserFromSession(): Extrae user de sesión
│   │       • isAuthenticated(): Boolean de estado auth
│   │
│   ├── 📄 env.ts                          # VALIDACIÓN ENV VARS
│   │   └── Variables de entorno tipadas y validadas
│   │       • Esquema Zod para env vars
│   │       • export const env = { ... }
│   │       • Validación en build time
│   │       • Types seguros
│   │       • Variables:
│   │         - API_URL
│   │         - NEXTAUTH_SECRET
│   │         - NEXTAUTH_URL
│   │         - etc.
│   │
│   └── 📄 utils.ts                        # FUNCIONES UTILIDAD
│       └── Helpers generales
│           • mapZodTreeToFormErrors(errors)
│             - Convierte errores Zod a formato form
│           • formatCurrency(amount)
│             - Formatea números a moneda
│           • formatDate(date)
│             - Formatea fechas
│           • cn(...classes)
│             - Merge de clases con tailwind-merge
│           • Otras funciones helper
│
└── 📁 ui/                                 # ESTILOS Y DISEÑO
    │
    ├── 📄 fonts.ts                        # CONFIGURACIÓN FUENTES
    │   └── Importación de fuentes con next/font
    │       • import { Bebas_Neue } from 'next/font/google'
    │       • export const bebasNeue = Bebas_Neue({ ... })
    │       • Variables CSS generadas automáticamente
    │       • Optimización de carga de fuentes
    │       • Prevención de FOUT/FOIT
    │
    └── 📄 globals.css                     # ESTILOS GLOBALES
        └── CSS global de la aplicación
            • @tailwind base;
            • @tailwind components;
            • @tailwind utilities;
            • Variables CSS custom properties:
              - --foreground
              - --background
              - --primary
              - --secondary
              - etc.
            • Estilos base para body, html
            • Clases utility personalizadas
            • Animaciones @keyframes (shimmer, etc.)
            • Responsive adjustments
```

### 🔍 Explicación de Convenciones

**Archivos Especiales de Next.js:**
- `page.tsx` → Define una ruta accesible
- `layout.tsx` → UI compartida que envuelve páginas
- `loading.tsx` → UI de loading automático
- `error.tsx` → Error boundary automático
- `not-found.tsx` → Página 404 personalizada

**Convenciones de Carpetas:**
- `(overview)` → Route group (no afecta URL)
- `[invoiceId]` → Ruta dinámica (parámetro variable)
- `dashboard/` → Segmento de ruta normal

**Tipos de Componentes:**
- **Server Components** (por defecto): Componentes que se renderizan en el servidor
- **Client Components** ("use client"): Componentes con interactividad del cliente

---

**Fecha de última actualización:** Febrero 2026
