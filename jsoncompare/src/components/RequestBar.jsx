import { useState } from 'react'

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'var(--surface)',
  borderBottom: '1px solid var(--border)',
  height: '48px',
  minWidth: 0,
}

const selectStyle = {
  background: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--border2)',
  borderRadius: '6px',
  padding: '6px 8px',
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  outline: 'none',
}

const inputStyle = {
  flex: 1,
  background: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--border2)',
  borderRadius: '6px',
  padding: '6px 12px',
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  outline: 'none',
  minWidth: 0,
}

const btnStyle = {
  background: 'var(--accent)',
  color: '#0d0f14',
  border: '1px solid var(--accent)',
  borderRadius: '6px',
  padding: '6px 16px',
  fontFamily: 'var(--sans)',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  whiteSpace: 'nowrap',
}

export function RequestBar({ onSend, loading }) {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')

  const handleSend = () => {
    if (!url.trim()) return
    onSend(method, url)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div style={containerStyle}>
      <select 
        style={selectStyle} 
        value={method} 
        onChange={(e) => setMethod(e.target.value)}
        disabled={loading}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
      </select>
      
      <input
        style={inputStyle}
        type="text"
        placeholder="https://api.exemplo.com/dados"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      
      <button 
        style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }} 
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
