import { useEffect, useRef, useState } from 'react'

export function useTooltip() {
  const [tip, setTip] = useState({ text: '', x: 0, y: 0, visible: false })
  const timerRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    function show(el) {
      const text = el.getAttribute('data-tip')
      if (!text) return
      const rect = el.getBoundingClientRect()
      const tipEl = tipRef.current
      const tipH = tipEl ? tipEl.offsetHeight || 26 : 26
      const tipW = tipEl ? tipEl.offsetWidth || 140 : 140
      const top = rect.top > tipH + 14 ? rect.top - tipH - 8 : rect.bottom + 8
      let left = rect.left + rect.width / 2 - tipW / 2
      left = Math.max(6, Math.min(left, window.innerWidth - tipW - 6))
      setTip({ text, x: left, y: top, visible: true })
    }

    function hide() {
      if (timerRef.current) clearTimeout(timerRef.current)
      setTip((t) => ({ ...t, visible: false }))
    }

    function onOver(e) {
      const btn = e.target.closest('[data-tip]')
      if (!btn) { hide(); return }
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => show(btn), 420)
    }

    function onOut(e) {
      if (e.target.closest('[data-tip]')) hide()
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('scroll', hide, true)
    document.addEventListener('mousedown', hide, true)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('scroll', hide, true)
      document.removeEventListener('mousedown', hide, true)
    }
  }, [])

  return { tip, tipRef }
}