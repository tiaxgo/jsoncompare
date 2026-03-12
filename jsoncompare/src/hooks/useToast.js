import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [toast, setToast] = useState({ message: '', type: '', visible: false })
  const timerRef = useRef(null)

  const showToast = useCallback((message, type = '') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type, visible: true })
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400)
  }, [])

  return { toast, showToast }
}