const panelStyle = {
    display: 'flex', flexDirection: 'row',
    alignItems: 'center', gap: 12,
    padding: '8px 12px',
    background: 'var(--surface2)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    overflowX: 'auto',
  }
  
  const labelStyle = {
    fontSize: 9, fontWeight: 700, letterSpacing: '.12em',
    textTransform: 'uppercase', color: 'var(--text3)',
    whiteSpace: 'nowrap',
  }
  
  const btnStyle = {
    fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
    padding: '6px 10px', borderRadius: 7, cursor: 'pointer',
    border: '1px solid var(--border2)', background: 'var(--surface)',
    color: 'var(--text2)', transition: 'all .15s',
    display: 'flex', alignItems: 'center', gap: 6,
    whiteSpace: 'nowrap',
  }
  
  const primaryStyle = {
    ...btnStyle,
    background: 'var(--accent)', color: '#0d0f14',
    borderColor: 'var(--accent)', fontWeight: 700,
  }
  
  const selectStyle = {
    fontFamily: 'var(--mono)', fontSize: 11,
    background: 'var(--surface)', color: 'var(--text2)',
    border: '1px solid var(--border2)', borderRadius: 7,
    padding: '5px 8px', cursor: 'pointer', minWidth: '100px',
    appearance: 'none',
  }
  
  export function ControlsPanel({ indent, onIndentChange, onFormat, onValidate, onMinify }) {
    return (
      <div style={panelStyle}>
        <span style={labelStyle}>Ação:</span>
        <button style={primaryStyle} onClick={onFormat}><span>◈</span> Formatar</button>
        <button style={btnStyle} onClick={onValidate}><span>✓</span> Validar</button>
        <button style={btnStyle} onClick={onMinify}><span>⇱</span> Minificar</button>
  
        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
        
        <span style={labelStyle}>Indentação:</span>
        <select style={selectStyle} value={indent} onChange={(e) => onIndentChange(e.target.value)}>
          <option value="2">2 espaços</option>
          <option value="3">3 espaços</option>
          <option value="4">4 espaços</option>
          <option value="tab">Tab</option>
        </select>
      </div>
    )
  }
  