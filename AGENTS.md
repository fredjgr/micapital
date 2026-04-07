# AGENTS.md - Mi Capital

## Comandos Personalizados del Usuario

Para push a GitHub, usar SIEMPRE:

```powershell
# Alias en PowerShell profile (~/.bashrc en Git Bash):
pushgit 'nombre-repo'  # Crea repo o sincroniza cambios existentes
getgit 'nombre-repo'  # Clona repo de GitHub
cgit                 # Muestra ayuda de comandos

# Usuario GitHub: fredjgr
# Ubicación aliases: /c/Users/FredGamerASL/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1
```

## Stack Técnico

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Email + Google)
- **Hosting**: Vercel (conectado a GitHub: fredjgr)

## Variables de Entorno

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bvvgrkfbgwrofktoknrg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dmdya2ZiZ3dyb2ZrdG9rbnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MjM0ODQsImV4cCI6MjA5MTA5OTQ4NH0.18fuG93Qtz-K2158dkSDt5InrWONd2E95wCfhPr8VCY
```

## Base de Datos (Supabase)

- **Project ID**: bvvgrkfbgwrofktoknrg
- **Dashboard**: https://supabase.com/dashboard/project/bvvgrkfbgwrofktoknrg

### Tablas SQL ya creadas:
- workspaces
- workspace_members
- categories
- transactions
- transaction_splits
- budgets

### Trigger automático:
- `handle_new_user()` - Crea workspace personal + categorías al registrarse

## Repositorio

- **GitHub**: https://github.com/fredjgr/micapital
- **Vercel**: Conectado, deploy automático en push

## Workflow de Deploy

1. `git add . && git commit -m "mensaje"`
2. `pushgit micapital` (crea repo si no existe o sincroniza)
3. Si necesita arreglar branch: `git branch -M main && git push -u origin main`
4. Vercel deploya automáticamente

## Design System "Precision Etérea"

- Dark mode base: `#0e0e10`
- Primary (personal): `#adc6ff`
- Secondary (shared): `#c180ff`
- Tipografía: Inter
- Sin bordes de 1px, usar cambios tonales
