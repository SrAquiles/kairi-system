const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendMessage(text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
  })
}

export default async function handler(req, res) {
  const { session } = req.query

  const messages = {
    morning: `🌅 <b>KAIRI — Check-in Mañana</b>

Son las 6:00 AM. Nuevo día, nuevo ciclo.

Abre tu dashboard para el check-in:
👉 https://kairi-system.vercel.app

O escribe /manana aquí para responder.`,

    afternoon: `🖥️ <b>KAIRI — Check-in Post-Trabajo</b>

Saliste del trabajo. Antes de estudiar, evalúa el día.

Abre tu dashboard:
👉 https://kairi-system.vercel.app

O escribe /trabajo aquí.`,

    night: `🌙 <b>KAIRI — Check-in Pre-Sueño</b>

Son las 11:00 PM. Cierra el día antes de dormir.

Abre tu dashboard:
👉 https://kairi-system.vercel.app

O escribe /sueno aquí.`,
  }

  const msg = messages[session]
  if (!msg) return res.status(400).json({ error: 'Invalid session' })

  await sendMessage(msg)
  return res.status(200).json({ ok: true })
}
