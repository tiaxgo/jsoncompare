import { useCallback } from 'react'

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '12px',
  background: 'var(--bg)',
  height: '100%',
  overflowY: 'auto',
  minHeight: 0,
}

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 32px',
  gap: 8,
  alignItems: 'center',
}

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--border2)',
  borderRadius: 4,
  padding: '6px 10px',
  color: 'var(--text)',
  fontSize: 12,
  fontFamily: 'var(--mono)',
  width: '100%',
}

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text3)',
  cursor: 'pointer',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 4,
  borderRadius: 4,
  transition: 'all 0.1s',
}

const addBtnStyle = {
  background: 'var(--surface2)',
  border: '1px dashed var(--border)',
  borderRadius: 4,
  padding: '6px',
  color: 'var(--text2)',
  cursor: 'pointer',
  fontSize: 11,
  fontWeight: 600,
  marginTop: 4,
  textAlign: 'center',
}

export function ParamsEditor({ params, onChange }) {
  const handleParamChange = useCallback((index, field, value) => {
    const next = [...params]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }, [params, onChange])

  const addParam = useCallback(() => {
    onChange([...params, { key: '', value: '' }])
  }, [params, onChange])

  const removeParam = useCallback((index) => {
    const next = params.filter((_, i) => i !== index)
    onChange(next)
  }, [params, onChange])

  return (
    <div style={containerStyle}>
      <div style={{ ...rowStyle, marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase' }}>Key</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase' }}>Value</span>
        <div />
      </div>
      
      {params.map((param, index) => (
        <div key={index} style={rowStyle}>
          <input
            style={inputStyle}
            placeholder="Key"
            value={param.key}
            onChange={(e) => handleParamChange(index, 'key', e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Value"
            value={param.value}
            onChange={(e) => handleParamChange(index, 'value', e.target.value)}
          />
          <button 
            style={deleteBtnStyle} 
            onClick={() => removeParam(index)}
            title="Remover"
          >
            ✕
          </button>
        </div>
      ))}

      <button style={addBtnStyle} onClick={addParam}>
        + Adicionar Parâmetro
      </button>
    </div>
  )
}
