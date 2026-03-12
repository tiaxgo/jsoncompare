import { useRef, useEffect } from 'react'
import { LINE_H } from '../utils/json'

export function Gutter({ state, scrollTop, onLineClick }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = scrollTop
  }, [scrollTop])

  const lines = Array.from({ length: state.lineCount }, (_, i) => i + 1)

  return (
    <div
      ref={ref}
      style={{
        width: 44, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        paddingTop: 16,
        userSelect: 'none',
        height: '100%',
      }}
    >
      {lines.map((ln) => {
        const isError = ln === state.errorLine
        const isActive = ln === state.activeLine && !isError
        const isSelected = state.selectedLines.has(ln)

        return (
          <div
            key={ln}
            onClick={(e) => onLineClick(ln, e.shiftKey, e.ctrlKey, e.metaKey)}
            style={{
              height: LINE_H,
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 8,
              fontFamily: 'var(--mono)', fontSize: 11,
              cursor: 'pointer',
              transition: 'all .1s',
              borderRight: `2px solid ${isError ? 'var(--error)' : isActive ? 'var(--accent)' : 'transparent'}`,
              color: isError ? 'var(--error)' : isActive ? 'var(--accent)' : isSelected ? 'var(--accent)' : 'var(--text3)',
              background: isError ? 'var(--error-dim)' : isActive ? 'var(--accent-dim)' : isSelected ? 'rgba(0,229,160,0.07)' : 'transparent',
              fontWeight: isError ? 700 : 400,
              animation: isError ? 'errPulse 1.2s ease-in-out 3' : 'none',
            }}
          >
            {ln}
          </div>
        )
      })}
    </div>
  )
}
