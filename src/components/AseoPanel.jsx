import { ASEO_TASKS } from '../lib/constants'

const REWARDS = [
  "Casa limpia = mente clara. Esta noche estudias mejor.",
  "Racha activa. Tu espacio refleja quién estás siendo.",
  "Ambiente limpio, código limpio. Así funciona el sistema.",
  "Disciplina en lo pequeño = disciplina en lo grande.",
]
const PUNISHMENTS = [
  "Casa sin asear. Mañana lo haces antes de abrir cualquier app.",
  "El desorden drena energía sin que lo notes. Mañana sin falta.",
  "Incompleto hoy. Mañana es obligatorio — sin negociación.",
]

export default function AseoPanel({ aseo, onToggle, streak }) {
  const completed = ASEO_TASKS.filter(t => aseo[t.id]).length
  const total = ASEO_TASKS.length
  const allDone = completed === total
  const pct = Math.round((completed / total) * 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ color: '#ddd', fontSize: 12, fontFamily: "'Courier New', monospace", letterSpacing: 3 }}>🏠 ASEO DIARIO</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ color: '#ffcc00', fontSize: 12 }}>🔥 {streak} días</div>
          <div style={{ color: allDone ? '#00ff88' : '#ffcc00', fontSize: 12, fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{completed}/{total}</div>
        </div>
      </div>

      <div style={{ height: 8, background: '#0d0d0d', borderRadius: 4, border: '1px solid #222', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: allDone ? 'linear-gradient(90deg,#00ff8866,#00ff88)' : 'linear-gradient(90deg,#ffcc0066,#ffcc00)', borderRadius: 4, transition: 'width 0.5s ease', boxShadow: allDone ? '0 0 10px #00ff8860' : '0 0 8px #ffcc0050' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {ASEO_TASKS.map(task => (
          <button key={task.id} onClick={() => onToggle(task.id)}
            style={{ background: aseo[task.id] ? '#00ff8810' : '#080808', border: `1px solid ${aseo[task.id] ? '#00ff8840' : '#222'}`, borderRadius: 6, padding: '10px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{task.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: aseo[task.id] ? '#00ff88' : '#aaa', fontSize: 12, fontFamily: "'Courier New', monospace" }}>{task.label}</div>
              <div style={{ color: aseo[task.id] ? '#00ff8860' : '#555', fontSize: 9, fontFamily: "'Courier New', monospace", marginTop: 2 }}>{aseo[task.id] ? '✓ DONE' : 'pendiente'}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: 12, borderRadius: 6, border: `1px solid ${allDone ? '#00ff8825' : '#ff336620'}`, background: allDone ? '#00ff8806' : '#ff336606' }}>
        {allDone ? (
          <>
            <div style={{ color: '#00ff88', fontSize: 10, letterSpacing: 3, fontFamily: "'Courier New', monospace", marginBottom: 8 }}>◆ RECOMPENSA DESBLOQUEADA</div>
            <div style={{ color: '#ccc', fontSize: 13, fontFamily: "'Courier New', monospace", lineHeight: 1.6 }}>✅ {REWARDS[streak % REWARDS.length]}</div>
            <div style={{ marginTop: 10, color: '#00ff88', fontSize: 11, fontFamily: "'Courier New', monospace" }}>🔓 Permiso desbloqueado: 30 min de ocio sin culpa esta noche.</div>
          </>
        ) : completed >= 4 ? (
          <>
            <div style={{ color: '#ffcc00', fontSize: 10, letterSpacing: 3, fontFamily: "'Courier New', monospace", marginBottom: 8 }}>◉ CASI COMPLETO</div>
            <div style={{ color: '#ccc', fontSize: 13, fontFamily: "'Courier New', monospace", lineHeight: 1.6 }}>Faltan {total - completed} tareas. Termínalas antes de dormir.</div>
          </>
        ) : (
          <>
            <div style={{ color: '#ff3366', fontSize: 10, letterSpacing: 3, fontFamily: "'Courier New', monospace", marginBottom: 8 }}>⚠ CONSECUENCIA ACTIVA</div>
            <div style={{ color: '#ccc', fontSize: 13, fontFamily: "'Courier New', monospace", lineHeight: 1.6 }}>⚠️ {PUNISHMENTS[streak % PUNISHMENTS.length]}</div>
            <div style={{ marginTop: 10, color: '#ff336688', fontSize: 11, fontFamily: "'Courier New', monospace" }}>🔒 Ocio bloqueado hasta completar mínimo 4 tareas.</div>
          </>
        )}
      </div>

      <div style={{ marginTop: 10, padding: '8px 12px', background: '#0a0a0a', borderRadius: 4, border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 2 }}>RACHA ACTUAL</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i < (streak % 8) ? '#00ff88' : '#1a1a1a', boxShadow: i < (streak % 8) ? '0 0 6px #00ff8860' : 'none' }} />
          ))}
        </div>
        <span style={{ color: '#ffcc00', fontSize: 13, fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>🔥 {streak}</span>
      </div>
    </div>
  )
}
