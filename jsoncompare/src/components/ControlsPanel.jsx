const panelStyle = {
    display: 'flex', flexDirection: 'column',
    alignItems: 'stretch', gap: 6,
    padding: '16px 12px',
    background: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    overflowY: 'auto',
  }
  
  const labelStyle = {
    fontSize: 9, fontWeight: 700, letterSpacing: '.12em',
    textTransform: 'uppercase', color: 'var(--text3)',
    padding: '0 4px',
  }
  
  const btnStyle = {
    fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
    padding: '9px 10px', borderRadius: 7, cursor: 'pointer',
    border: '1px solid var(--border2)', background: 'var(--surface2)',
    color: 'var(--text2)', transition: 'all .15s', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 7,
  }
  
  const primaryStyle = {
    ...btnStyle,
    background: 'var(--accent)', color: '#0d0f14',
    borderColor: 'var(--accent)', fontWeight: 700,
    justifyContent: 'center',
  }
  
  const selectStyle = {
    fontFamily: 'var(--mono)', fontSize: 11,
    background: 'var(--surface2)', color: 'var(--text2)',
    border: '1px solid var(--border2)', borderRadius: 7,
    padding: '7px 8px', cursor: 'pointer', width: '100%',
    appearance: 'none',
  }
  
  export function ControlsPanel({ indent, onIndentChange, onFormat, onValidate, onMinify, onConvert, onUpload, onDownload, onClearAll }) {
    return (
      <div style={panelStyle}>
        <span style={labelStyle}>Ação</span>
        <button style={primaryStyle} onClick={onFormat}><span>◈</span> Formatar</button>
        <button style={btnStyle} onClick={onValidate}><span>✓</span> Validar</button>
        <button style={btnStyle} onClick={onMinify}><span>⇱</span> Minificar</button>
  
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <span style={labelStyle}>Indentação</span>
        <select style={selectStyle} value={indent} onChange={(e) => onIndentChange(e.target.value)}>
          <option value="2">2 espaços</option>
          <option value="3">3 espaços</option>
          <option value="4">4 espaços</option>
          <option value="tab">Tab</option>
        </select>
  
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <span style={labelStyle}>Converter</span>
        <button style={btnStyle} onClick={() => onConvert('xml')}><span>⇢</span> → XML</button>
        <button style={btnStyle} onClick={() => onConvert('csv')}><span>⇢</span> → CSV</button>
        <button style={btnStyle} onClick={() => onConvert('yaml')}><span>⇢</span> → YAML</button>
  
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <span style={labelStyle}>Arquivo</span>
        <button style={btnStyle} onClick={onUpload}><span>⤴</span> Upload</button>
        <button style={btnStyle} onClick={onDownload}><span>⤓</span> Download</button>
        <button style={{ ...btnStyle }} onClick={onClearAll}><span>⊘</span> Limpar tudo</button>
      </div>
    )
  }
  