const navStyle = {
  position: 'sticky', top: 0, zIndex: 100,
  height: 56,
  background: 'rgba(13,15,20,0.92)',
  backdropFilter: 'blur(18px)',
  borderBottom: '1px solid var(--border)',
  display: 'flex', alignItems: 'center',
  padding: '0 24px',
}

const logoStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  textDecoration: 'none', marginRight: 32, flexShrink: 0,
}

const logoIconStyle = {
  width: 32, height: 32,
  background: 'var(--accent)',
  borderRadius: 8,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13,
  color: '#0d0f14',
}

const linkStyle = {
  color: 'var(--text2)', textDecoration: 'none',
  fontSize: 13, fontWeight: 600,
  padding: '6px 12px', borderRadius: 6,
  transition: 'all .15s',
  whiteSpace: 'nowrap',
}

const btnNavStyle = {
  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
  padding: '7px 16px', borderRadius: 7, cursor: 'pointer',
  border: '1px solid var(--border2)', background: 'var(--surface2)',
  color: 'var(--text2)', transition: 'all .15s',
}

const btnAccentStyle = {
  ...btnNavStyle,
  background: 'var(--accent)', color: '#0d0f14', borderColor: 'var(--accent)',
}

export function Navbar({ onSave, onUpload, onConvert, onOpenTab }) {
  const prevent = (fn) => (e) => { e.preventDefault(); fn() }

  return (
    <nav style={navStyle}>
      <a href="#" style={logoStyle}>
        <div style={logoIconStyle}>{'{}'}</div>
        <span style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.3px' }}>
          JSON<span style={{ color: 'var(--accent)' }}>Compare</span>
        </span>
      </a>

      <ul style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, listStyle: 'none' }}>
        <li><a href="#" style={linkStyle} onClick={prevent(() => onOpenTab('about'))}>Sobre</a></li>
        <li><a href="#" style={linkStyle} onClick={prevent(() => onConvert('xml'))}>JSON → XML</a></li>
        <li><a href="#" style={linkStyle} onClick={prevent(() => onConvert('csv'))}>JSON → CSV</a></li>
        <li><a href="#" style={linkStyle} onClick={prevent(() => onConvert('yaml'))}>JSON → YAML</a></li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={btnNavStyle} onClick={onSave}>Salvar</button>
        <button style={btnAccentStyle} onClick={onUpload}>Upload</button>
      </div>
    </nav>
  )
}
