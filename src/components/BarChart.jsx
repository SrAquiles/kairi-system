import { METRICS } from '../lib/constants'

export default function BarChart({ data }) {
  return (
    <div style={{ width: '100%' }}>
      {METRICS.map(m => {
        const val = data[m.id]
        const pct = val !== undefined ? (m.invert ? ((m.max-val)/m.max)*100 : ((val-m.min)/(m.max-m.min))*100) : 0
        const capped = Math.min(100, Math.max(0, pct))
        const targetPct = m.invert ? ((m.max-m.target)/m.max)*100 : ((m.target-m.min)/(m.max-m.min))*100
        return (
          <div key={m.id} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
              <span style={{ color: '#aaa', fontSize: 12, fontFamily: "'Courier New', monospace", letterSpacing: 2 }}>{m.icon} {m.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#555', fontSize: 10, fontFamily: "'Courier New', monospace" }}>META {m.target}{m.unit}</span>
                <span style={{ color: val !== undefined ? m.color : '#555', fontSize: 13, fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{val !== undefined ? `${val}${m.unit}` : '—'}</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 10, background: '#0d0d0d', borderRadius: 5, border: '1px solid #222', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${capped}%`, background: `linear-gradient(90deg, ${m.color}66, ${m.color})`, borderRadius: 5, boxShadow: val !== undefined ? `0 0 10px ${m.color}50` : 'none', transition: 'width 0.8s ease' }} />
              <div style={{ position: 'absolute', top: 0, left: `${targetPct}%`, width: 2, height: '100%', background: '#ffffff25' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
