import { METRICS } from '../lib/constants'

export default function RadarChart({ data }) {
  const size = 160, cx = 80, cy = 80, r = 58, n = METRICS.length
  const points = METRICS.map((m, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    const val = data[m.id] !== undefined ? data[m.id] : 0
    const pct = m.invert ? (m.max - val) / m.max : (val - m.min) / (m.max - m.min)
    const rr = r * Math.max(0.04, pct)
    return {
      x: cx + rr * Math.cos(angle), y: cy + rr * Math.sin(angle),
      lx: cx + (r + 18) * Math.cos(angle), ly: cy + (r + 18) * Math.sin(angle),
      label: m.label,
    }
  })
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {[0.25,0.5,0.75,1].map((lv,li) => (
        <polygon key={li}
          points={METRICS.map((_,i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return `${cx+r*lv*Math.cos(a)},${cy+r*lv*Math.sin(a)}` }).join(' ')}
          fill="none" stroke="#00ff8818" strokeWidth="1" />
      ))}
      {METRICS.map((_,i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="#00ff8812" strokeWidth="1"/> })}
      <polygon points={points.map(p=>`${p.x},${p.y}`).join(' ')} fill="#00ff8818" stroke="#00ff88" strokeWidth="1.5" style={{filter:'drop-shadow(0 0 6px #00ff8880)'}}/>
      {points.map((p,i) => <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="#00ff88aa" fontFamily="'Courier New', monospace">{p.label}</text>)}
    </svg>
  )
}
