const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY

async function sendMessage(text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
  })
}

async function saveCheckin(session, data) {
  const today = new Date().toISOString().split('T')[0]
  await fetch(`${SUPABASE_URL}/rest/v1/checkins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ date: today, session, data, updated_at: new Date().toISOString() })
  })
}

// Simple state machine stored in memory (per-request, Telegram handles state via chat)
// For production you'd store state in Supabase
const QUESTIONS = {
  'MAÑANA': [
    { metric: 'sleep', q: '¿Cuántas horas dormiste?' },
    { metric: 'energy', q: '¿Cuánta energía tienes ahora? (1-10)' },
    { metric: 'mood', q: '¿Cómo está tu ánimo? (1-10)' },
    { metric: 'stress', q: '¿Nivel de estrés al despertar? (1-10)' },
  ],
  'POST-TRABAJO': [
    { metric: 'focus', q: '¿Qué tan enfocado estuviste hoy? (1-10)' },
    { metric: 'tasks', q: '¿Cuántas tareas completaste?' },
    { metric: 'stress', q: '¿Nivel de estrés al salir? (1-10)' },
    { metric: 'water', q: '¿Litros de agua hasta ahora?' },
  ],
  'PRE-SUEÑO': [
    { metric: 'study', q: '¿Cuántas horas estudiaste esta noche?' },
    { metric: 'mood', q: '¿Cómo terminas el día? (1-10)' },
    { metric: 'water', q: '¿Total de litros de agua hoy?' },
    { metric: 'tasks', q: '¿Total de tareas completadas hoy?' },
  ],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true })

  const { message } = req.body
  if (!message) return res.status(200).json({ ok: true })

  const text = message.text || ''
  const chatId = message.chat.id.toString()

  if (chatId !== CHAT_ID) return res.status(200).json({ ok: true })

  // Commands
  if (text === '/start' || text === '/menu') {
    await sendMessage(`◈ <b>KAIRI SYSTEM v2.1</b>

Comandos disponibles:
/manana — Check-in de la mañana
/trabajo — Check-in post-trabajo
/sueno — Check-in pre-sueño
/score — Ver tu score del día
/dashboard — Link al dashboard`)
    return res.status(200).json({ ok: true })
  }

  if (text === '/dashboard') {
    await sendMessage('🔗 <b>Tu dashboard:</b>\nhttps://kairi-system.vercel.app')
    return res.status(200).json({ ok: true })
  }

  return res.status(200).json({ ok: true })
}
