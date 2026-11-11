// PROTOTYPE — throwaway.
// Question: what should the whiteboard look like? Four token-based design directions on a
// real React Flow canvas, switchable via `?direction=<id>|all` and `&mode=light|dark`.
// Bottom bar or ←/→ cycles directions, `D` toggles dark mode.
import { useEffect, useState } from 'react'
import '@xyflow/react/dist/style.css'
import './directions.css'
import { WhiteboardCanvas } from './WhiteboardCanvas'
import { graphite } from './graphite'
import { sketchbook } from './sketchbook'
import { blueprint } from './blueprint'
import { pop } from './pop'

const directions = [graphite, sketchbook, blueprint, pop]
const keys = [...directions.map((d) => d.id), 'all']
type Mode = 'light' | 'dark'

// Load every direction's Google Fonts once.
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = `https://fonts.googleapis.com/css2?${directions.map((d) => d.googleFonts).join('&')}&display=swap`
document.head.appendChild(fontLink)

function readParams(): { key: string; mode: Mode } {
  const p = new URLSearchParams(window.location.search)
  const key = p.get('direction') ?? ''
  return {
    key: keys.includes(key) ? key : keys[0],
    mode: p.get('mode') === 'dark' ? 'dark' : 'light',
  }
}

export default function DesignDirections() {
  const [{ key, mode }, setState] = useState(readParams)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    p.set('direction', key)
    p.set('mode', mode)
    window.history.replaceState(null, '', `?${p}`)
  }, [key, mode])

  const cycle = (step: number) =>
    setState((s) => ({ ...s, key: keys[(keys.indexOf(s.key) + step + keys.length) % keys.length] }))
  const toggleMode = () => setState((s) => ({ ...s, mode: s.mode === 'light' ? 'dark' : 'light' }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') cycle(-1)
      else if (e.key === 'ArrowRight') cycle(1)
      else if (e.key.toLowerCase() === 'd') toggleMode()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current = directions.find((d) => d.id === key)
  const index = keys.indexOf(key)
  const label = current ? `${String.fromCharCode(65 + index)} · ${current.name}` : 'Compare all'

  return (
    <>
      {current ? (
        <div style={{ width: '100vw', height: '100vh' }}>
          <WhiteboardCanvas key={`${key}-${mode}`} direction={current} mode={mode} />
        </div>
      ) : (
        <div className="wb-grid">
          {directions.map((d) => (
            <WhiteboardCanvas key={`${d.id}-${mode}`} direction={d} mode={mode} compact />
          ))}
        </div>
      )}
      <div className="proto-switcher">
        <button onClick={() => cycle(-1)} aria-label="Previous direction">
          ←
        </button>
        <span className="label">{label}</span>
        <button onClick={() => cycle(1)} aria-label="Next direction">
          →
        </button>
        <button onClick={toggleMode}>{mode === 'light' ? '☾ dark' : '☀ light'}</button>
      </div>
    </>
  )
}
