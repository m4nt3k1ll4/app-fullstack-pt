# 🚀 Frontend - myApp NextAuth + Prisma + Supabase

Aplicación Next.js 16 con NextAuth v5, autenticación dual (Google OAuth + Credentials), Prisma ORM y Supabase PostgreSQL.

---

## 📦 Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Autenticación:** NextAuth v5 (Google OAuth + Credentials)
- **Base de datos:** Supabase PostgreSQL
- **ORM:** Prisma
- **Validación:** Zod + React Hook Form
- **Estilos:** Tailwind CSS v4
- **Iconos:** React Icons
- **TypeScript:** 5.x

---

## ⚙️ Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# API Backend Laravel
API_BASE_URL=http://localhost:8000

# Supabase PostgreSQL (incluye ?schema=public al final)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public

# NextAuth
AUTH_SECRET=genera-con-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (https://console.cloud.google.com/apis/credentials)
AUTH_GOOGLE_ID=tu-google-client-id
AUTH_GOOGLE_SECRET=tu-google-client-secret
```

#### Generar AUTH_SECRET:

```bash
npx auth secret
```

O manualmente:

```bash
openssl rand -base64 32
```

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea un proyecto nuevo (o selecciona uno existente)
3. Ve a **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth Client ID**
5. Tipo: **Web application**
6. **Authorized JavaScript origins:**
   - `http://localhost:3000`
7. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
8. Copia el **Client ID** y **Client Secret** a tu `.env.local`

### 4. Configurar Supabase

Ver guía completa en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Resumen rápido:**

```bash
# 1. Obtener DATABASE_URL de Supabase Dashboard
# Settings → Database → Connection String

# 2. Generar cliente Prisma
npm run db:generate

# 3. Crear tablas en Supabase
npm run db:push

# 4. (Opcional) Sembrar datos de prueba
npm run db:seed
```

---

## 🏃 Ejecutar proyecto

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Producción

```bash
npm run build
npm start
```

---

## 🔐 Autenticación

### Providers Configurados

1. **Google OAuth** — Login social con cuenta de Google
2. **Credentials** — Email y contraseña (bcryptjs)

### Probar autenticación

Usuario de prueba (después de ejecutar `npm run db:seed`):
- **Email:** test@example.com
- **Password:** password123

---

## 🗄️ Base de Datos (Prisma + Supabase)

### Comandos útiles

```bash
# Generar cliente después de cambios en schema
npm run db:generate

# Sincronizar schema con Supabase (sin migraciones)
npm run db:push

# Crear migración nombrada
npm run db:migrate

# Abrir Prisma Studio (GUI para ver datos)
npm run db:studio

# Ejecutar seeder
npm run db:seed
```

### Tablas creadas

- `users` — Usuarios del sistema
- `accounts` — Providers OAuth vinculados
- `sessions` — Sesiones activas
- `verification_tokens` — Tokens de verificación

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint

# Prisma
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema con DB
npm run db:migrate   # Crear migración
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Ejecutar seeder
```

---

## 🔗 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth v5 Docs](https://authjs.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — Guía completa de Supabase
