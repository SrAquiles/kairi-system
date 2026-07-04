import { useState } from 'react'
import { QUESTIONS } from '../lib/constants'
import { getKairiAdvice } from '../lib/logic'

export default function CheckIn({ session, onComplete, existingData, onClose }) {
  const qs = QUESTIONS[session]
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [input, setInput] = useState('')
  const [done, setDone] = useState(false)
  const [advice, setAdvice] = useState('')

  function submit() {
    const val = parseFloat(input)
    if (isNaN(val)) return
    const newAnswers = { ...answers, [qs[step].metric]: val }
    setAnswers(newAnswers)
    setInput('')
    if (step + 1 >= qs.length) {
      setAdvice(getKairiAdvice(session, { ...existingData, ...newAnswers }))
      setDone(true)
      onComplete(newAnswers)
    } else {
      setStep(step + 1)
    }
  }

  if (done) return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ color: '#00ff88', fontSize: 28, marginBottom: 8 }}>✓</div>
        <div style={{ color: '#00ff88', fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: 3 }}>
          CHECK-IN {session} COMPLETADO
        </div>
      </div>
      <div style={{ background: '#00ccff08', border: '1px solid #00ccff25', borderRadius: 6, padding: 16 }}>
        <div style={{ color: '#00ccff', fontSize: 10, letterSpacing: 3, marginBottom: 10, fontFamily: "'Courier New', monospace" }}>◎ KAIRI DICE</div>
        <div style={{ color: '#ccc', fontSize: 13, lineHeight: 1.7, fontFamily: "'Courier New', monospace" }}>{advice}</div>
      </div>
      <button onClick={onClose} style={{ marginTop: 16, width: '100%', background: 'transparent', border: '1px solid #333', color: '#777', fontFamily: "'Courier New', monospace", fontSize: 11, padding: '10px', borderRadius: 4, cursor: 'pointer', letterSpacing: 2 }}>
        VOLVER AL DASHBOARD
      </button>
    </div>
  )

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ color: '#777', fontFamily: "'Courier New', monospace", fontSize: 11, marginBottom: 10, letterSpacing: 2 }}>
        [{step+1}/{qs.length}] {session}
      </div>
      <div style={{ height: 2, background: '#111', borderRadius: 1, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ height: '100%', width: `${(step/qs.length)*100}%`, background: '#00ff88', transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ color: '#00ccff', fontFamily: "'Courier New', monospace", fontSize: 14, marginBottom: 18, lineHeight: 1.7 }}>
        &gt; {qs[step].q}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="number" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="0" autoFocus
          style={{ background: '#0a0a0a', border: '1px solid #00ff8840', color: '#00ff88', fontFamily: "'Courier New', monospace", fontSize: 18, padding: '10px 14px', borderRadius: 4, outline: 'none', width: 90 }}
        />
        <button onClick={submit} style={{ background: 'transparent', border: '1px solid #00ff88', color: '#00ff88', fontFamily: "'Courier New', monospace", fontSize: 12, padding: '10px 18px', borderRadius: 4, cursor: 'pointer', letterSpacing: 2 }}>
          ENTER ↵
        </button>
      </div>
    </div>
  )
}
