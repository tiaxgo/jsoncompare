import { useState, useCallback } from 'react'

const INITIAL = { lineCount: 1, activeLine: 1, selectedLines: new Set(), errorLine: null }

export function useGutter() {
  const [state, setState] = useState(INITIAL)

  const setLineCount = useCallback((lineCount) => {
    setState((s) => ({ ...s, lineCount }))
  }, [])

  const setActiveLine = useCallback((activeLine) => {
    setState((s) => ({ ...s, activeLine }))
  }, [])

  const setErrorLine = useCallback((errorLine) => {
    setState((s) => ({ ...s, errorLine, selectedLines: new Set() }))
  }, [])

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, errorLine: null }))
  }, [])

  const handleLineClick = useCallback((ln, shiftKey, ctrlKey, metaKey) => {
    setState((s) => {
      let selectedLines
      if (shiftKey && s.selectedLines.size > 0) {
        const last = Math.max(...s.selectedLines)
        const min = Math.min(ln, last), max = Math.max(ln, last)
        selectedLines = new Set(Array.from({ length: max - min + 1 }, (_, i) => min + i))
      } else if (ctrlKey || metaKey) {
        selectedLines = new Set(s.selectedLines)
        if (selectedLines.has(ln)) selectedLines.delete(ln)
        else selectedLines.add(ln)
      } else {
        selectedLines = new Set([ln])
      }
      return { ...s, activeLine: ln, selectedLines, errorLine: null }
    })
  }, [])

  return { state, setLineCount, setActiveLine, setErrorLine, clearError, handleLineClick }
}