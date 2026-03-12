import { useRef, useState } from 'react'

const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 200,
  background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const modalStyle = {
  position: 'relative',
  background: 'var(--surface)', border: '1px solid var(--border2)',
  borderRadius: 14, padding: 28, width: 480, maxWidth: '95vw',
  animation: 'slideUp .2s ease',
}

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
  borderRadius: 8, padding: '10px 14px',
  fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)',
  marginBottom: 12, outline: 'none',
}

const btnStyle = {
  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
  padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
  border: '1px solid var(--border2)', background: 'var(--surface2)',
  color: 'var(--text2)', transition: 'all .15s',
  display: 'flex', alignItems: 'center', gap: 6,
  width: '100%', justifyContent: 'center', marginBottom: 8,
}

const primaryBtnStyle = {
  ...btnStyle, background: 'var(--accent)', color: '#0d0f14', borderColor: 'var(--accent)',
}

export function UploadModal({ open, onClose, onFileLoad, onUrlLoad }) {
  const fileRef = useRef(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [urlError, setUrlError] = useState('')

  if (!open) return null

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { onFileLoad(ev.target.result); onClose() }
    reader.readAsText(file)
  }

  const handleUrl = async () => {
    if (!url.trim()) return
    setLoading(true); setUrlError('')
    try {
      console.log('Enviando requisição para:', url)
      const res = await fetch(url)
      console.log('Status da resposta:', res.status)
      const text = await res.text()
      console.log('Dados recebidos:', text)
      onUrlLoad(text)
      onClose()
    } catch (e) {
      console.error('Erro na requisição:', e)
      setUrlError('Erro ao carregar URL: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20, position: 'absolute', right: 20, top: 18 }}>×</button>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Carregar Dados</h3>

        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>URL do JSON</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="https://api.exemplo.com/dados.json"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUrl()}
        />
        {urlError && <p style={{ color: 'var(--error)', fontFamily: 'var(--mono)', fontSize: 12, marginBottom: 8 }}>{urlError}</p>}
        <button style={primaryBtnStyle} onClick={handleUrl} disabled={loading}>
          {loading ? 'Carregando...' : 'Carregar URL'}
        </button>

        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--mono)', margin: '8px 0 12px' }}>— ou —</div>

        <input ref={fileRef} type="file" accept=".json,.txt" style={{ display: 'none' }} onChange={handleFile} />
        <button style={btnStyle} onClick={() => fileRef.current?.click()}><span>⤴</span> Selecionar Arquivo</button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button style={btnStyle} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
