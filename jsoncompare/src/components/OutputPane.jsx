import { useRef, useCallback, useState } from 'react'
import { Gutter } from './Gutter'
import { LINE_H, buildTree } from '../utils/json'

const paneBtn = (active) => ({
  background: active ? 'var(--accent-dim)' : 'none',
  border: `1px solid ${active ? 'var(--accent-dim)' : 'transparent'}`,
  color: active ? 'var(--accent)' : 'var(--text3)',
  borderRadius: 5, cursor: 'pointer', padding: '3px 7px',
  fontSize: 11, fontFamily: 'var(--mono)', transition: 'all .12s',
})

export function OutputPane({ html, rawText, gutter, onLineClick, onScrollActiveLine, info, outType, headerLabel = '✦ Saída' }) {
  const scrollRef = useRef(null)
  const [gutterScroll, setGutterScroll] = useState(0)
  const [treeMode, setTreeMode] = useState(false)
  const [treeHTML, setTreeHTML] = useState('')

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const top = scrollRef.current.scrollTop
    setGutterScroll(top)
    const ln = Math.floor(top / LINE_H) + 1
    onScrollActiveLine(ln)
  }, [onScrollActiveLine])

  const toggleView = useCallback(() => {
    setTreeMode((prev) => {
      const next = !prev
      if (next) {
        try {
          setTreeHTML(buildTree(JSON.parse(rawText)))
        } catch {
          setTreeHTML('<span style="color:var(--error)">JSON inválido para tree view</span>')
        }
      }
      return next
    })
  }, [rawText])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', overflow: 'hidden', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ height: 40, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>{headerLabel}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={paneBtn(treeMode)} data-tip={treeMode ? 'Voltar para visualização de código' : 'Visualização em árvore'} onClick={toggleView}>
            {treeMode ? '⊟ Code' : '⊞ Tree'}
          </button>
          <button style={paneBtn(false)} data-tip="Copiar conteúdo da saída" onClick={() => rawText && navigator.clipboard.writeText(rawText)}>⎘ Copy</button>
          <button style={paneBtn(false)} data-tip="Limpar saída" onClick={() => {}}>✕</button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, height: '100%' }}>
        {!treeMode && (
          <Gutter state={gutter} scrollTop={gutterScroll} onLineClick={onLineClick} />
        )}

        {!treeMode && (
          <div ref={scrollRef} onScroll={handleScroll} style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                minHeight: '100%',
                background: 'var(--bg)',
                fontFamily: 'var(--mono)', fontSize: 13.5, lineHeight: 1.65,
                padding: '16px 10px',
                whiteSpace: 'pre', color: 'var(--text)', cursor: 'text',
              }}
            />
          </div>
        )}

        {treeMode && (
          <div
            dangerouslySetInnerHTML={{ __html: treeHTML }}
            style={{
              flex: 1, overflow: 'auto',
              padding: '16px 18px',
              fontFamily: 'var(--mono)', fontSize: 13,
              background: 'var(--bg)',
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div style={{ height: 24, flexShrink: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 16 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{info || '—'}</span>
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{outType || '—'}</span>
      </div>
    </div>
  )
}
