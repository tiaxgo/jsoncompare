import { useState, useCallback, useEffect } from 'react'
import { StatusBar } from './components/StatusBar'
import { Toast } from './components/Toast'
import { Tooltip } from './components/Tooltip'
import { UploadModal } from './components/UploadModal'
import { useToast } from './hooks/useToast'
import { Column } from './components/Column'

export default function App() {
  const [status, setStatus] = useState('Pronto · Ctrl+Enter para formatar')
  const [isStatusError, setIsStatusError] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState(null)
  const [loadCallback, setLoadCallback] = useState(null)
  const { toast, showToast } = useToast()

  const handleStatus = useCallback((msg, isError) => {
    setStatus(msg)
    setIsStatusError(isError)
  }, [])

  const handleOpenRequest = useCallback((id, callback) => {
    setActiveColumn(id)
    setLoadCallback(() => callback)
    setUploadOpen(true)
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

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        <Column id="1" onStatus={handleStatus} showToast={showToast} onOpenRequest={handleOpenRequest} />
        <Column id="2" onStatus={handleStatus} showToast={showToast} onOpenRequest={handleOpenRequest} />
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onFileLoad={(text) => { if (loadCallback) loadCallback(text); setUploadOpen(false) }}
        onUrlLoad={(text) => { if (loadCallback) loadCallback(text); setUploadOpen(false) }}
      />

      <Toast toast={toast} />
      <Tooltip />
    </div>
  )
}
