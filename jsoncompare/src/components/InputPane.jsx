import { useRef, useCallback, useEffect, useState } from 'react'
import { Gutter } from './Gutter'
import { LINE_H } from '../utils/json'

const paneBtn = {
  background: 'none', border: '1px solid transparent', color: 'var(--text3)',
  borderRadius: 5, cursor: 'pointer', padding: '3px 7px',
  fontSize: 11, fontFamily: 'var(--mono)', transition: 'all .12s',
}

export function InputPane({
  value, onChange, onCursor,
  gutter, onLineClick, onJumpToLine,
  errorLine, errorMsg,
  ln, col, chars,
  onLoadSample,
}) {
  const taRef = useRef(null)
  const [gutterScroll, setGutterScroll] = useState(0)

  const handleScroll = useCallback(() => {
    if (taRef.current) setGutterScroll(taRef.current.scrollTop)
  }, [])

  // Jump to error line when it changes
  useEffect(() => {
    if (errorLine == null || !taRef.current) return
    const ta = taRef.current
    const lines = ta.value.split('\n')
    let pos = 0
    for (let i = 0; i < errorLine - 1 && i < lines.length; i++) pos += lines[i].length + 1
    ta.focus()
    ta.setSelectionRange(pos, pos + (lines[errorLine - 1]?.length ?? 0))
    const scrollTo = (errorLine - 1) * LINE_H - ta.clientHeight / 2
    ta.scrollTop = Math.max(0, scrollTo)
  }, [errorLine])

  const handleLineClick = useCallback((lineNum, shift, ctrl, meta) => {
    onLineClick(lineNum, shift, ctrl, meta)
    // jump cursor in textarea
    if (!taRef.current) return
    const ta = taRef.current
    const lines = ta.value.split('\n')
    let pos = 0
    for (let i = 0; i < lineNum - 1 && i < lines.length; i++) pos += lines[i].length + 1
    ta.focus()
    ta.setSelectionRange(pos, pos + (lines[lineNum - 1]?.length ?? 0))
    const scrollTo = (lineNum - 1) * LINE_H - ta.clientHeight / 2
    ta.scrollTop = Math.max(0, scrollTo)
  }, [onLineClick])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const s = ta.selectionStart, end = ta.selectionEnd
      const next = ta.value.substring(0, s) + '  ' + ta.value.substring(end)
      onChange(next)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2 })
    }
  }, [onChange])

  const updateCursor = useCallback(() => {
    if (!taRef.current) return
    const ta = taRef.current
    const before = ta.value.substring(0, ta.selectionStart)
    const ls = before.split('\n')
    onCursor(ls.length, ls[ls.length - 1].length + 1)
  }, [onCursor])

  const errorTop = errorLine != null ? 16 + (errorLine - 1) * LINE_H : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ height: 40, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>⌨ Entrada</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={paneBtn} data-tip="Limpar entrada" onClick={() => onChange('')}>✕</button>
          <button style={paneBtn} data-tip="Copiar conteúdo da entrada" onClick={() => value && navigator.clipboard.writeText(value)}>⎘ Copy</button>
          <button style={paneBtn} data-tip="Carregar JSON de exemplo" onClick={onLoadSample}>※ Exemplo</button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, height: '100%', position: 'relative' }}>
        <Gutter state={gutter} scrollTop={gutterScroll} onLineClick={handleLineClick} />

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Error highlight bar */}
          {errorLine != null && (
            <div style={{
              position: 'absolute', left: 0, right: 0,
              top: errorTop, height: LINE_H,
              background: 'var(--error-dim)',
              borderLeft: '3px solid var(--error)',
              pointerEvents: 'none', zIndex: 1,
              transition: 'top .15s',
            }} />
          )}
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={updateCursor}
            onClick={updateCursor}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder="Cole seu JSON aqui, ou arraste um arquivo..."
            spellCheck={false}
            autoComplete="off"
            style={{
              width: '100%', height: '100%',
              background: 'var(--bg)', color: 'var(--text)',
              fontFamily: 'var(--mono)', fontSize: 13.5, lineHeight: 1.65,
              border: 'none', outline: 'none', resize: 'none',
              padding: '16px 10px',
              tabSize: 2, whiteSpace: 'pre',
              overflow: 'auto', caretColor: 'var(--accent)',
              display: 'block', position: 'absolute', inset: 0,
            }}
          />
        </div>

        {/* Error panel */}
        {errorMsg && (
          <div style={{
            position: 'absolute', bottom: 24, left: 0, right: 0,
            margin: '0 12px',
            background: 'var(--error-dim)', border: '1px solid var(--error)',
            borderRadius: 8, padding: '10px 14px',
            fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--error)',
            zIndex: 10,
          }}>
            <strong>Erro:</strong> {errorMsg}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ height: 24, flexShrink: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 16 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
          Ln <span style={{ color: 'var(--text2)' }}>{ln}</span> · Col <span style={{ color: 'var(--text2)' }}>{col}</span>
        </span>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{chars} chars</span>
      </div>
    </div>
  )
}
