export const METRICS = [
  { id: "sleep", label: "SUEÑO", unit: "h", min: 0, max: 12, target: 7, icon: "◈", color: "#00ff88" },
  { id: "stress", label: "ESTRÉS", unit: "/10", min: 0, max: 10, target: 4, icon: "◉", color: "#ff3366", invert: true },
  { id: "focus", label: "FOCO", unit: "/10", min: 0, max: 10, target: 8, icon: "◎", color: "#00ccff" },
  { id: "energy", label: "ENERGÍA", unit: "/10", min: 0, max: 10, target: 7, icon: "◆", color: "#ffcc00" },
  { id: "tasks", label: "TAREAS", unit: " ✓", min: 0, max: 20, target: 5, icon: "◇", color: "#aa44ff" },
  { id: "study", label: "ESTUDIO", unit: "h", min: 0, max: 4, target: 2, icon: "◈", color: "#00ff88" },
  { id: "water", label: "AGUA", unit: "L", min: 0, max: 4, target: 2, icon: "◉", color: "#00ccff" },
  { id: "mood", label: "ÁNIMO", unit: "/10", min: 0, max: 10, target: 7, icon: "◎", color: "#ff8800" },
]

export const ASEO_TASKS = [
  { id: "habitacion", label: "Habitación", icon: "🛏️" },
  { id: "cocina", label: "Cocina", icon: "🍳" },
  { id: "bano", label: "Baño", icon: "🚿" },
  { id: "barrer", label: "Barrer", icon: "🧹" },
  { id: "trapear", label: "Trapear", icon: "🪣" },
  { id: "olor", label: "Olor rico", icon: "🌸" },
]

export const SESSIONS = ["MAÑANA", "POST-TRABAJO", "PRE-SUEÑO"]

export const SESSION_CONFIG = {
  "MAÑANA": { icon: "🌅", time: "6:00 AM", reminder: "Al despertar" },
  "POST-TRABAJO": { icon: "🖥️", time: "5:00 PM", reminder: "Al salir del trabajo" },
  "PRE-SUEÑO": { icon: "🌙", time: "11:00 PM", reminder: "Antes de dormir" },
}

export const QUESTIONS = {
  "MAÑANA": [
    { metric: "sleep", q: "¿Cuántas horas dormiste?" },
    { metric: "energy", q: "¿Cuánta energía tienes ahora? (1-10)" },
    { metric: "mood", q: "¿Cómo está tu ánimo? (1-10)" },
    { metric: "stress", q: "¿Nivel de estrés al despertar? (1-10)" },
  ],
  "POST-TRABAJO": [
    { metric: "focus", q: "¿Qué tan enfocado estuviste hoy? (1-10)" },
    { metric: "tasks", q: "¿Cuántas tareas completaste?" },
    { metric: "stress", q: "¿Nivel de estrés al salir? (1-10)" },
    { metric: "water", q: "¿Litros de agua hasta ahora?" },
  ],
  "PRE-SUEÑO": [
    { metric: "study", q: "¿Cuántas horas estudiaste esta noche?" },
    { metric: "mood", q: "¿Cómo terminas el día? (1-10)" },
    { metric: "water", q: "¿Total de litros de agua hoy?" },
    { metric: "tasks", q: "¿Total de tareas completadas hoy?" },
  ],
}

export const DAILY_QUOTES = [
  { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
  { text: "Muévete rápido y rompe cosas.", author: "Mark Zuckerberg" },
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "Tu tiempo es limitado. No lo desperdicies viviendo la vida de alguien más.", author: "Steve Jobs" },
  { text: "La mejor inversión que puedes hacer es en ti mismo.", author: "Warren Buffett" },
  { text: "No te preocupes por el fracaso. Te preocupas por las posibilidades que pierdes cuando no lo intentas.", author: "Jack Ma" },
  { text: "El software es una gran combinación entre arte e ingeniería.", author: "Bill Gates" },
  { text: "Los sistemas funcionan. La motivación es para los amateurs.", author: "Scott Adams" },
  { text: "Primero resuelve el problema, luego escribe el código.", author: "John Johnson" },
  { text: "La consistencia es lo que transforma lo ordinario en extraordinario.", author: "Tony Robbins" },
  { text: "Un entorno limpio produce una mente limpia.", author: "Naval Ravikant" },
  { text: "El orden externo crea espacio para el pensamiento interno.", author: "Cal Newport" },
]
