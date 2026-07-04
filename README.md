# KAIRI SYSTEM v2.1

Dashboard personal de vida — Proyecto Maestro

## Stack
- **Frontend:** React + Vite + PWA
- **Base de datos:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Notificaciones:** Telegram Bot

## Setup en Supabase

1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Copia y ejecuta el contenido de `supabase-schema.sql`

## Variables de entorno en Vercel

Agrega estas variables en Vercel → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://ntiobbmtzkvqketiamrj.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_URL=https://ntiobbmtzkvqketiamrj.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
TELEGRAM_BOT_TOKEN=tu_bot_token
TELEGRAM_CHAT_ID=tu_chat_id
```

## Instalar como app en iPhone

1. Abre la URL en Safari
2. Toca el ícono de compartir
3. "Agregar a pantalla de inicio"
4. Listo — tienes la app instalada
