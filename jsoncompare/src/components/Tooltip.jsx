import { useTooltip } from '../hooks/useTooltip'

export function Tooltip() {
  const { tip, tipRef } = useTooltip()

  return (
    <div
      ref={tipRef}
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: tip.y,
        left: tip.x,
        background: 'var(--surface2)',
        border: '1px solid var(--border2)',
        color: 'var(--text)',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        padding: '5px 10px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: tip.visible ? 1 : 0,
        transition: 'opacity 0.12s',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {tip.text}
    </div>
  )
}
