const barStyle = {
    height: 30,
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center',
    padding: '0 24px', gap: 24,
  }
  
  const itemStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)',
  }
  
  export function StatusBar({ message, isError, ln, col, size, validIndicator }) {
    return (
      <div style={barStyle}>
        <div style={itemStyle}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: isError ? 'var(--error)' : 'var(--accent)', fontWeight: 500 }}>
            {message}
          </span>
        </div>
        <div style={itemStyle}>Ln: <span style={{ color: 'var(--text2)' }}>{ln}</span></div>
        <div style={itemStyle}>Col: <span style={{ color: 'var(--text2)' }}>{col}</span></div>
        <div style={itemStyle}>Tamanho: <span style={{ color: 'var(--text2)' }}>{size}</span></div>
        {validIndicator && (
          <div style={itemStyle}>
            <span style={{ color: validIndicator === 'valid' ? 'var(--accent)' : 'var(--error)', fontSize: 11, fontFamily: 'var(--mono)' }}>
              ● {validIndicator === 'valid' ? 'VÁLIDO' : 'INVÁLIDO'}
            </span>
          </div>
        )}
      </div>
    )
  }
  