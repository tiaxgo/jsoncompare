import { useState, useCallback } from 'react'
import { StatusBar } from './components/StatusBar'
import { Toast } from './components/Toast'
import { Tooltip } from './components/Tooltip'
import { useToast } from './hooks/useToast'
import { Column } from './components/Column'

export default function App() {
  const [status, setStatus] = useState('Pronto · Ctrl+Enter para formatar')
  const [isStatusError, setIsStatusError] = useState(false)
  const { toast, showToast } = useToast()

  const handleStatus = useCallback((msg, isError) => {
    setStatus(msg)
    setIsStatusError(isError)
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <StatusBar
        message={status}
        isError={isStatusError}
        ln="-"
        col="-"
        size="-"
        validIndicator={null}
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0, minWidth: 0 }}>
        <Column id="1" onStatus={handleStatus} showToast={showToast} />
        <Column id="2" onStatus={handleStatus} showToast={showToast} />
      </div>

      <Toast toast={toast} />
      <Tooltip />
    </div>
  )
}
