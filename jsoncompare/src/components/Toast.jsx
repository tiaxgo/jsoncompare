export function Toast({ toast }) {
    const borderColor = toast.type === 'success' ? 'var(--accent)' : toast.type === 'error' ? 'var(--error)' : 'var(--border2)'
    const color = toast.type === 'success' ? 'var(--accent)' : toast.type === 'error' ? 'var(--error)' : 'var(--text)'
  
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: toast.visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
          background: 'var(--surface2)',
          border: `1px solid ${borderColor}`,
          color,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          padding: '10px 20px',
          borderRadius: 8,
          opacity: toast.visible ? 1 : 0,
          transition: 'all 0.25s',
          zIndex: 9998,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {toast.message}
      </div>
    )
  }
  