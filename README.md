# Mi Capital - Gestión de Gastos

Plataforma de gestión de gastos personales y compartidos en Reales (R$).

## Stack Técnico

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google)
- **Hosting**: Vercel

## Configuración

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. En **Settings > API** copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Supabase.

### 3. Configurar Auth en Supabase

1. En **Authentication > Providers**, habilita:
   - Email (habilitado por defecto)
   - Google (opcional)

2. Para Google OAuth:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto y habilita Google+ API
   - Genera credenciales OAuth 2.0
   - Agrega en Supabase: Client ID y Client Secret

3. En **Authentication > URL Configuration**:
   - Site URL: `https://tu-dominio.vercel.app`
   - Redirect URLs: `https://tu-dominio.vercel.app/auth/callback`

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy a Vercel

### Opción 1: Desde GitHub

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio desde GitHub
4. Agrega las variables de entorno en Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy automático

### Opción 2: CLI

```bash
npm i -g vercel
vercel
```

## Funcionalidades

- [x] Login con email + contraseña
- [x] Login con Google
- [x] Registro de usuarios
- [x] Crear workspaces (personal/compartido)
- [x] Dashboard con estadísticas
- [x] CRUD de transacciones (gastos/ingresos)
- [x] Categorías de gastos
- [x] Widget de liquidación (workspaces compartidos)
- [x] Diseño responsive (desktop + mobile)
- [ ] Invitar miembros por email
- [ ] División de gastos entre miembros
- [ ] Presupuestos por categoría
- [ ] Reportes y gráficos

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/callback/    # OAuth callback
│   ├── dashboard/        # Dashboard principal
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── workspace/        # Selección de workspaces
│   └── layout.tsx       # Layout principal
├── components/           # Componentes React
│   ├── sidebar.tsx       # Sidebar (desktop)
│   ├── bottom-nav.tsx    # Navegación (mobile)
│   ├── balance-card.tsx  # Tarjeta de saldo
│   ├── stats-cards.tsx   # Estadísticas
│   ├── transaction-list.tsx
│   ├── transaction-modal.tsx
│   ├── settlement-widget.tsx
│   └── fab.tsx           # Floating action button
└── lib/
    └── supabase/         # Cliente Supabase
        ├── client.ts     # Cliente browser
        ├── server.ts     # Cliente server
        └── middleware.ts # Auth middleware
```

## Design System

El proyecto sigue el sistema de diseño "Precision Etérea":

- **Dark mode base**: `#0e0e10`
- **Paleta**: Zinc/Slate con acentos azul (#adc6ff) y púrpura (#c180ff)
- **Tipografía**: Inter
- **Glassmorphism**: 60% opacidad + blur 20px
