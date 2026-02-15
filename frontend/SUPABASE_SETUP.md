# Configuración de Supabase con Prisma para NextAuth

## 📋 Tablas necesarias en Supabase

El schema de Prisma crea estas **4 tablas** requeridas por NextAuth:

### 1. `users` 
Almacena usuarios del sistema
- `id` (cuid, PK)
- `name` (string, nullable)
- `email` (string, unique)
- `email_verified` (datetime, nullable)
- `image` (string, nullable)
- `password` (string, nullable) — Para Credentials Provider
- `api_key` (string, unique, nullable) — API key del backend Laravel
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. `accounts`
Vincula usuarios con providers OAuth (Google, GitHub, etc.)
- `id` (cuid, PK)
- `user_id` (FK → users.id)
- `type` (string)
- `provider` (string) — ej: "google", "credentials"
- `provider_account_id` (string)
- `refresh_token` (text, nullable)
- `access_token` (text, nullable)
- `expires_at` (int, nullable)
- `token_type` (string, nullable)
- `scope` (string, nullable)
- `id_token` (text, nullable)
- `session_state` (string, nullable)
- **Constraint:** UNIQUE(provider, provider_account_id)

### 3. `sessions`
Sesiones activas de usuarios
- `id` (cuid, PK)
- `session_token` (string, unique)
- `user_id` (FK → users.id)
- `expires` (datetime)

### 4. `verification_tokens`
Tokens de verificación (email, password reset)
- `identifier` (string)
- `token` (string, unique)
- `expires` (datetime)
- **Constraint:** UNIQUE(identifier, token)

---

## 🚀 Pasos de Configuración

### 1. Obtener DATABASE_URL de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **Settings** → **Database**
4. Copia la **Connection String** (URI mode):

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

5. Pega en tu `.env.local` y **agrega `?schema=public`** al final:

```env
DATABASE_URL=postgresql://postgres:tu-password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?schema=public
```

> **📌 Nota:** El parámetro `?schema=public` asegura que Prisma cree las tablas en el esquema público de Supabase. Esto es importante para compatibilidad con NextAuth y para que las tablas sean visibles en el Table Editor de Supabase.

### 2. Generar el cliente de Prisma

```bash
npx prisma generate
```

Esto crea el cliente TypeScript basado en tu schema.

### 3. Crear las tablas en Supabase

Ejecuta la migración de Prisma:

```bash
npx prisma db push
```

O si prefieres usar migraciones nombradas:

```bash
npx prisma migrate dev --name init
```

**¿Cuál usar?**
- `db push` → Desarrollo rápido, no crea historial de migraciones
- `migrate dev` → Producción, crea historial versionado

### 4. Verificar tablas en Supabase

1. Ve a **Table Editor** en el dashboard de Supabase
2. Deberías ver las 4 tablas: `users`, `accounts`, `sessions`, `verification_tokens`

### 5. (Opcional) Sembrar datos de prueba

Crea un usuario con contraseña hasheada para testing:

```bash
# Desde el directorio frontend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10));"
```

Luego inserta manualmente en Supabase o crea un seed:

```typescript
// prisma/seed.ts
import { prisma } from '../app/helpers/db';
import { hash } from 'bcryptjs';

async function main() {
  const hashedPassword = await hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ejecutar seed:
```bash
npx tsx prisma/seed.ts
```

---

## 🔐 Providers Configurados

### 1. **Google OAuth**
- Login social con cuenta de Google
- Crea entrada automática en `accounts` y `users`
- No requiere password

### 2. **Credentials (Email/Password)**
- Login tradicional con email y contraseña
- Password hasheado con `bcryptjs`
- Verifica contra la columna `password` en `users`

---

## 📊 Diagrama de Relaciones

```
users (1) ←→ (N) accounts
  ↓
  └─→ (N) sessions

verification_tokens (tabla independiente)
```

---

## 🛠️ Comandos útiles de Prisma

```bash
# Generar cliente después de cambios en schema
npx prisma generate

# Sincronizar schema con DB (sin migraciones)
npx prisma db push

# Crear migración nombrada
npx prisma migrate dev --name add_api_key_field

# Ver base de datos en browser
npx prisma studio

# Resetear base de datos (⚠️ BORRA TODO)
npx prisma migrate reset

# Validar schema sin aplicar
npx prisma validate
```

---

## 🔗 Row Level Security (RLS) en Supabase

**IMPORTANTE:** Supabase tiene RLS habilitado por defecto. Para que NextAuth funcione, debes:

### Opción 1: Desactivar RLS (solo desarrollo)
En cada tabla, ve a **Table Editor** → **Settings** → **Row Level Security** → **Disable**

### Opción 2: Crear políticas RLS (producción)

```sql
-- Para tabla users (permitir lectura/escritura desde service role)
CREATE POLICY "nextauth_users_policy" ON users
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Repetir para accounts, sessions, verification_tokens
```

O usa el **service_role key** en lugar del `anon key` (más seguro):

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

---

## ✅ Testing

### Probar Google OAuth:
1. Ir a `/login`
2. Click en "Continuar con Google"
3. Autorizar en Google
4. Redirige a `/dashboard`

### Probar Credentials:
1. Crear usuario en Supabase con password hasheado
2. Ir a `/login`
3. Ingresar email y contraseña
4. Click en "Iniciar Sesión"
5. Redirige a `/dashboard`

---

## 🐛 Troubleshooting

**Error: "Environment variable not found: DATABASE_URL"**
→ Verifica que `.env.local` existe en la raíz del proyecto

**Error: "Can't reach database server"**
→ Verifica el connection string y que tu IP está permitida en Supabase

**Error: "Credential sign-in failed"**
→ Verifica que el password esté hasheado correctamente con bcryptjs

**Tablas no se crean**
→ Asegúrate de ejecutar `npx prisma db push` después de configurar DATABASE_URL

---

¹ **Nota sobre Production:** En producción usa `migrate deploy` en lugar de `db push`
