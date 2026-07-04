import { METRICS } from './constants'

export function getScore(data) {
  let total = 0, count = 0
  METRICS.forEach(m => {
    if (data[m.id] !== undefined) {
      const val = data[m.id]
      const pct = m.invert ? ((m.max - val) / m.max) * 100 : ((val - m.min) / (m.max - m.min)) * 100
      total += Math.min(100, Math.max(0, pct))
      count++
    }
  })
  return count ? Math.round(total / count) : 0
}

export function getScoreColor(s) {
  if (s >= 75) return "#00ff88"
  if (s >= 50) return "#ffcc00"
  if (s >= 25) return "#ff8800"
  return "#ff3366"
}

export function getScoreLabel(s) {
  if (s >= 75) return "SISTEMA ÓPTIMO"
  if (s >= 50) return "OPERACIONAL"
  if (s >= 25) return "DEGRADADO"
  return "CRÍTICO"
}

export function getScoreAdvice(score) {
  if (score >= 75) return "Sistema en verde. Estás operando en tu mejor nivel — mantén la consistencia y capitaliza este momentum."
  if (score >= 50) return "Sistema estable. Identifica cuál métrica está más baja y enfócate en subirla mañana."
  if (score >= 25) return "Sistema degradado. Prioriza sueño y agua hoy como base mínima."
  return "Sistema en rojo. Esta noche: dormir temprano, sin pantallas. Mañana empezamos de nuevo."
}

export function getKairiAdvice(session, data) {
  const { sleep, stress, energy, focus, study, mood, water } = data
  if (session === "MAÑANA") {
    if (sleep !== undefined && sleep < 5) return "Dormiste poco. Prioriza tareas críticas temprano. Considera una pausa de 10 min al mediodía."
    if (energy !== undefined && energy < 5) return "Energía baja. Empieza con una tarea simple para ganar momentum. Hidratación ahora."
    if (stress !== undefined && stress > 6) return "Estrés alto al despertar. Tómate 5 min de silencio antes del trabajo. Enfócate en lo que puedes controlar."
    return "Buen inicio. Define las 3 cosas más importantes del día antes de abrir cualquier app."
  }
  if (session === "POST-TRABAJO") {
    if (stress !== undefined && stress > 7) return "Saliste con estrés alto. Date 30 min de transición antes de estudiar. Estudiar estresado no retiene."
    if (focus !== undefined && focus < 5) return "Foco bajo hoy. Esta noche prueba Pomodoro: 25 min de estudio, 5 de descanso."
    if (water !== undefined && water < 1) return "Poca hidratación. Toma agua antes de empezar a estudiar esta noche."
    return "Buen trabajo hoy. Define qué materia específica vas a atacar esta noche."
  }
  if (session === "PRE-SUEÑO") {
    if (study !== undefined && study === 0) return "No estudiaste esta noche. Identifica qué lo bloqueó y ajusta mañana. La consistencia a largo plazo es lo que importa."
    if (study !== undefined && study >= 2) return `Excelente — ${study}h de estudio. Antes de dormir repasa mentalmente 3 conceptos clave de hoy.`
    if (mood !== undefined && mood < 5) return "Día difícil. El sistema no falla por un mal día, falla si te rindes. Duerme bien."
    return "Cerrando bien el día. Aleja el teléfono 30 min antes de dormir — mejora la calidad del sueño."
  }
  return "Cada check-in completado es una señal de que el sistema está funcionando."
}

export function mergeCheckinData(checkins) {
  const merged = {}
  checkins.forEach(c => {
    if (c.data) Object.assign(merged, c.data)
  })
  return merged
}
