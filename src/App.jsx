import { useState, useEffect, useRef } from 'react'
import { SESSIONS, SESSION_CONFIG, QUESTIONS, DAILY_QUOTES } from './lib/constants'
import { getScore, getScoreColor, getScoreLabel, getScoreAdvice, mergeCheckinData } from './lib/logic'
import { saveCheckin, getTodayCheckins, saveAseo, getTodayAseo, getAseoStreak } from './lib/supabase'
import RadarChart from './components/RadarChart'
import BarChart from './components/BarChart'
import CheckIn from './components/CheckIn'
import AseoPanel from './components/AseoPanel'

const FONT = "'Courier New', monospace"

export default function App() {
  const [data, setData] = useState({})
  const [completed, setCompleted] = useState({})
  const [activeSession, setActiveSession] = useState(null)
  const [time, setTime] = useState(new Date())
  const [tab, setTab] = useState('DASHBOARD')
  const [aseo, setAseo] = useState({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quoteIdx] = useState(() => Math.floor(Math.random() * DAILY_QUOTES.length))
  const [showScore, setShowScore] = useState(false)
  const prevAseoRef = useRef(aseo)

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Load data from Supabase
  useEffect(() => {
    async function load() {
      try {
        const [checkins, aseoData, streakCount] = await Promise.all([
          getTodayCheckins(),
          getTodayAseo(),
          getAseoStreak(),
        ])
        if (checkins.length > 0) {
          const merged = mergeCheckinData(checkins)
          setData(merged)
          const comp = {}
          checkins.forEach(c => { comp[c.session] = true })
          setCompleted(comp)
        }
        if (aseoData?.tasks) setAseo(aseoData.tasks)
        setStreak(streakCount)
      } catch (e) {
        console.error('Load error:', e)
      } finally {
        setLoading(false)
        setTimeout(() => setShowScore(true), 400)
      }
    }
    load()
  }, [])

  // Auto-save aseo when changed
  useEffect(() => {
    if (loading) return
    const prevAll = Object.keys(aseo).filter(k => prevAseoRef.current[k]).length
    const currAll = Object.keys(aseo).filter(k => aseo[k]).length
    if (currAll !== prevAll) {
      saveAseo(aseo)
      if (currAll === 6 && prevAll < 6) setStreak(s => s + 1)
    }
    prevAseoRef.current = aseo
  }, [aseo, loading])

  async function handleCheckinComplete(session, answers) {
    const newData = { ...data, ...answers }
    setData(newData)
    setCompleted(prev => ({ ...prev, [session]: true }))
    setActiveSession(null)
    await saveCheckin(session, answers)
  }

  function toggleAseo(taskId) {
    setAseo(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const score = getScore(data)
  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)
  const quote = DAILY_QUOTES[quoteIdx]
  const filledCount = Object.keys(data).length
  const today = time.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = time.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const base = { fontFamily: FONT, minHeight: '100vh', background: '#050505', color: '#ccc', padding: 16, backgroundImage: 'radial-gradient(ellipse at 10% 10%, #00ff8806 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, #00ccff05 0%, transparent 50%)' }

  if (loading) return (
    <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ color: '#00ff88', fontSize: 11, letterSpacing: 4 }}>◈ KAIRI SYSTEM</div>
      <div style={{ color: '#333', fontSize: 11, letterSpacing: 2 }}>INICIALIZANDO...</div>
    </div>
  )

  return (
    <div style={base}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #00ff8818', paddingBottom: 14, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: '#00ff88', fontSize: 11, letterSpacing: 4, marginBottom: 4 }}>◈ KAIRI SYSTEM v2.1</div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 }}>PROYECTO MAESTRO</div>
            <div style={{ color: '#777', fontSize: 10, letterSpacing: 3, marginTop: 3 }}>{today.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#00ff88', fontSize: 16, letterSpacing: 2 }}>{timeStr}</div>
            <div style={{ color: scoreColor, fontSize: 10, letterSpacing: 2, marginTop: 5, padding: '3px 10px', border: `1px solid ${scoreColor}40`, borderRadius: 3 }}>● {scoreLabel}</div>
          </div>
        </div>
      </div>

      {/* Score + Radar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, padding: 14, border: '1px solid #00ff8812', borderRadius: 8, background: '#00ff8803' }}>
        <div style={{ textAlign: 'center', minWidth: 85 }}>
          <div style={{ fontSize: 54, fontWeight: 'bold', color: scoreColor, lineHeight: 1, textShadow: `0 0 30px ${scoreColor}80`, opacity: showScore ? 1 : 0, transition: 'opacity 0.8s ease', letterSpacing: -2 }}>{score}</div>
          <div style={{ color: '#888', fontSize: 9, letterSpacing: 2, marginTop: 5 }}>SCORE VITAL</div>
          <div style={{ color: '#666', fontSize: 9, marginTop: 2 }}>{filledCount}/8 métricas</div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><RadarChart data={data} /></div>
      </div>

      {/* Score advice */}
      {filledCount > 0 && (
        <div style={{ marginBottom: 14, padding: 12, border: `1px solid ${scoreColor}20`, borderRadius: 6, background: `${scoreColor}06` }}>
          <div style={{ color: scoreColor, fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>◆ ANÁLISIS DEL SISTEMA</div>
          <div style={{ color: '#bbb', fontSize: 13, lineHeight: 1.7 }}>{getScoreAdvice(score)}</div>
        </div>
      )}

      {/* Quote */}
      <div style={{ marginBottom: 14, padding: 12, border: '1px solid #ffffff08', borderRadius: 6, background: '#ffffff02' }}>
        <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>◎ FRASE DEL DÍA</div>
        <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic' }}>"{quote.text}"</div>
        <div style={{ color: '#777', fontSize: 11, marginTop: 8 }}>— {quote.author}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['DASHBOARD', 'CHECK-IN', 'ASEO', 'MÉTRICAS'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#00ff8812' : 'transparent', border: `1px solid ${tab === t ? '#00ff88' : '#333'}`, color: tab === t ? '#00ff88' : '#777', fontFamily: FONT, fontSize: 9, padding: '7px 8px', borderRadius: 3, cursor: 'pointer', letterSpacing: 1 }}>{t}</button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {tab === 'DASHBOARD' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 10 }}>▸ RECORDATORIOS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SESSIONS.map(s => {
                const cfg = SESSION_CONFIG[s]
                return (
                  <div key={s} onClick={() => { setActiveSession(s); setTab('CHECK-IN') }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: `1px solid ${completed[s] ? '#00ff8825' : '#222'}`, borderRadius: 6, background: completed[s] ? '#00ff8806' : '#0a0a0a', cursor: completed[s] ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                      <div>
                        <div style={{ color: completed[s] ? '#00ff88' : '#ccc', fontSize: 11, letterSpacing: 2 }}>{s}</div>
                        <div style={{ color: '#666', fontSize: 10, marginTop: 3 }}>{cfg.time} — {cfg.reminder}</div>
                      </div>
                    </div>
                    <div style={{ color: completed[s] ? '#00ff88' : '#444', fontSize: 11 }}>{completed[s] ? '✓' : '›'}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 10 }}>▸ FRENTES ACTIVOS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'ESTUDIOS', icon: '📚', status: 'EN CURSO', color: '#ffcc00', detail: 'Periodo 1 · Noche' },
                { label: 'TRABAJO', icon: '💼', status: 'ACTIVO', color: '#ffcc00', detail: '7:00 - 17:00' },
                { label: 'FINANZAS', icon: '💰', status: 'REORGANIZANDO', color: '#ff3366', detail: 'En proceso' },
                { label: 'MENTALIDAD', icon: '🧠', status: 'EN DESARROLLO', color: '#00ff88', detail: 'Build en curso' },
              ].map(f => (
                <div key={f.label} style={{ padding: 12, border: '1px solid #222', borderRadius: 6, background: '#080808' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ color: '#aaa', fontSize: 9, letterSpacing: 2 }}>{f.label}</div>
                  <div style={{ color: f.color, fontSize: 9, letterSpacing: 1, marginTop: 4 }}>● {f.status}</div>
                  <div style={{ color: '#555', fontSize: 9, marginTop: 3 }}>{f.detail}</div>
                </div>
              ))}
            </div>
          </div>
          {filledCount === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: '#555', fontSize: 11, letterSpacing: 2, border: '1px dashed #222', borderRadius: 6, marginTop: 14 }}>
              &gt; COMPLETA UN CHECK-IN PARA INICIALIZAR EL SISTEMA_
            </div>
          )}
        </div>
      )}

      {/* CHECK-IN TAB */}
      {tab === 'CHECK-IN' && (
        <div>
          {activeSession ? (
            <div style={{ padding: 16, border: '1px solid #00ff8825', borderRadius: 6, background: '#00ff8804' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ color: '#00ff88', fontSize: 11, letterSpacing: 3 }}>{SESSION_CONFIG[activeSession].icon} {activeSession}</div>
                <button onClick={() => setActiveSession(null)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
              <CheckIn session={activeSession} onComplete={(a) => handleCheckinComplete(activeSession, a)} existingData={data} onClose={() => setActiveSession(null)} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 6 }}>▸ SELECCIONA SESIÓN</div>
              {SESSIONS.map(s => {
                const cfg = SESSION_CONFIG[s]
                return (
                  <button key={s} onClick={() => setActiveSession(s)} style={{ background: completed[s] ? '#00ff8806' : '#0a0a0a', border: `1px solid ${completed[s] ? '#00ff8830' : '#222'}`, color: completed[s] ? '#00ff88' : '#bbb', fontFamily: FONT, fontSize: 12, padding: '16px', borderRadius: 6, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ letterSpacing: 2 }}>{cfg.icon} {s}</div>
                      <div style={{ color: '#666', fontSize: 10, marginTop: 5 }}>{cfg.time} · {cfg.reminder}</div>
                    </div>
                    <span style={{ fontSize: 10 }}>{completed[s] ? '✓ COMPLETADO' : `${QUESTIONS[s].length} preguntas ›`}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ASEO TAB */}
      {tab === 'ASEO' && <AseoPanel aseo={aseo} onToggle={toggleAseo} streak={streak} />}

      {/* MÉTRICAS TAB */}
      {tab === 'MÉTRICAS' && (
        <div>
          <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 16 }}>▸ BARRAS DE PROGRESO</div>
          <BarChart data={data} />
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #0f0f0f' }}>
            <div style={{ color: '#888', fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>▸ RADAR VITAL</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><RadarChart data={data} /></div>
          </div>
          {filledCount === 0 && <div style={{ textAlign: 'center', padding: 20, color: '#555', fontSize: 11 }}>&gt; SIN DATOS — COMPLETA UN CHECK-IN_</div>}
        </div>
      )}

      <div style={{ marginTop: 22, paddingTop: 10, borderTop: '1px solid #0d0d0d', color: '#444', fontSize: 9, letterSpacing: 2, display: 'flex', justifyContent: 'space-between' }}>
        <span>KAIRI v2.1</span>
        <span>{filledCount}/8 ACTIVAS</span>
      </div>
    </div>
  )
}
