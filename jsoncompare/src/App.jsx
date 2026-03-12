import { useState, useCallback, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { StatusBar } from './components/StatusBar'
import { InputPane } from './components/InputPane'
import { OutputPane } from './components/OutputPane'
import { ControlsPanel } from './components/ControlsPanel'
import { Sections } from './components/Sections'
import { Toast } from './components/Toast'
import { Tooltip } from './components/Tooltip'
import { UploadModal } from './components/UploadModal'
import { useToast } from './hooks/useToast'
import { useGutter } from './hooks/useGutter'
import {
  syntaxHighlight,
  formatBytes,
  getIndentValue,
  extractErrorLine,
  toXML,
  toCSV,
  toYAML,
  SAMPLE_JSON,
} from './utils/json'

export default function App() {
  // ── Core state ───────────────────────────────────────────────────────────
  const [input, setInput] = useState('')
  const [outputHTML, setOutputHTML] = useState('')
  const [outputRaw, setOutputRaw] = useState('')
  const [outputInfo, setOutputInfo] = useState({ text: '—', outType: '—' })
  const [indent, setIndent] = useState('2')
  const [cursor, setCursor] = useState({ ln: 1, col: 1 })
  const [errorMsg, setErrorMsg] = useState(null)
  const [validIndicator, setValidIndicator] = useState(null) // 'valid' | 'invalid' | null
  const [status, setStatus] = useState('Pronto · Ctrl+Enter para formatar')
  const [isStatusError, setIsStatusError] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  const [dragOver, setDragOver] = useState(false)

  const { toast, showToast } = useToast()
  const inputGutter = useGutter()
  const outputGutter = useGutter()

  // Keep input gutter line count in sync
  useEffect(() => {
    const count = (input || '\n').split('\n').length
    inputGutter.setLineCount(count)
  }, [input]) // eslint-disable-line

  // ── Helpers ──────────────────────────────────────────────────────────────
  const ok = useCallback((msg) => { setStatus(msg); setIsStatusError(false) }, [])
  const errStatus = useCallback((msg) => { setStatus('Erro: ' + msg); setIsStatusError(true) }, [])

  const renderOutput = useCallback((json, obj) => {
    setOutputHTML(syntaxHighlight(json))
    setOutputRaw(json)
    const bytes = new TextEncoder().encode(json).length
    const type = Array.isArray(obj)
      ? `Array [${obj.length}]`
      : typeof obj === 'object' && obj
        ? `Object {${Object.keys(obj).length}}`
        : typeof obj
    setOutputInfo({ text: formatBytes(bytes), outType: type })
    outputGutter.setLineCount(Math.max(1, json.split('\n').length))
  }, []) // eslint-disable-line

  const showError = useCallback((msg, source) => {
    setErrorMsg(msg)
    errStatus(msg)
    setValidIndicator('invalid')
    showToast('✗ ' + msg.slice(0, 60), 'error')
    const line = extractErrorLine(msg, source)
    if (line) inputGutter.setErrorLine(line)
  }, [errStatus, showToast]) // eslint-disable-line

  const hideError = useCallback(() => {
    setErrorMsg(null)
    setValidIndicator(null)
    inputGutter.clearError()
  }, []) // eslint-disable-line

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback((val) => {
    setInput(val)
    hideError()
    setValidIndicator(null)
  }, [hideError])

  const parseInput = useCallback(() => {
    const raw = input.trim()
    if (!raw) { showToast('Nenhum dado na entrada', ''); return null }
    return JSON.parse(raw)
  }, [input, showToast])

  const formatJSON = useCallback(() => {
    try {
      const obj = parseInput()
      if (obj === null) return
      const formatted = JSON.stringify(obj, null, getIndentValue(indent))
      setInput(formatted)
      renderOutput(formatted, obj)
      hideError()
      ok('Formatado com sucesso')
      showToast('✓ JSON formatado', 'success')
    } catch (e) {
      showError(e.message, input)
    }
  }, [parseInput, indent, renderOutput, hideError, ok, showToast, showError, input])

  const validateJSON = useCallback(() => {
    try {
      const raw = input.trim()
      if (!raw) { showToast('Nenhum dado para validar', ''); return }
      JSON.parse(raw)
      hideError()
      ok('JSON válido ✓')
      setValidIndicator('valid')
      showToast('✓ JSON válido!', 'success')
    } catch (e) {
      showError(e.message, input)
    }
  }, [input, hideError, ok, showToast, showError])

  const minifyJSON = useCallback(() => {
    try {
      const obj = parseInput()
      if (obj === null) return
      const min = JSON.stringify(obj)
      setInput(min)
      renderOutput(min, obj)
      hideError()
      ok('Minificado')
      showToast('✓ JSON minificado', 'success')
    } catch (e) {
      showError(e.message, input)
    }
  }, [parseInput, renderOutput, hideError, ok, showToast, showError, input])

  const convertTo = useCallback((format) => {
    try {
      const obj = parseInput()
      if (obj === null) return
      let result = ''
      if (format === 'xml') result = '<?xml version="1.0" encoding="UTF-8"?>\n' + toXML(obj, 'root', 0)
      else if (format === 'csv') result = toCSV(obj)
      else result = toYAML(obj, 0)

      const safe = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      setOutputHTML(`<span style="color:var(--text2);white-space:pre">${safe}</span>`)
      setOutputRaw(result)
      setOutputInfo({ text: `${format.toUpperCase()} · ${formatBytes(result.length)}`, outType: '' })
      outputGutter.setLineCount(Math.max(1, result.split('\n').length))
      ok(`Convertido para ${format.toUpperCase()}`)
      showToast(`✓ Convertido para ${format.toUpperCase()}`, 'success')
    } catch (e) {
      showError(e.message, input)
    }
  }, [parseInput, ok, showToast, showError, input]) // eslint-disable-line

  const downloadJSON = useCallback(() => {
    const content = outputRaw || input
    if (!content) { showToast('Nada para baixar', ''); return }
    const blob = new Blob([content], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'formatted.json'
    a.click()
    showToast('⤓ Download iniciado', 'success')
  }, [outputRaw, input, showToast])

  const clearAll = useCallback(() => {
    setInput('')
    setOutputHTML('')
    setOutputRaw('')
    setOutputInfo({ text: '—', outType: '—' })
    hideError()
    ok('Limpo')
  }, [hideError, ok])

  const saveOnline = useCallback(() => {
    if (!input) { showToast('Nada para salvar', ''); return }
    try {
      localStorage.setItem('jc_saved_' + Date.now(), input)
      showToast('✓ Salvo localmente', 'success')
    } catch {
      showToast('Erro ao salvar', 'error')
    }
  }, [input, showToast])

  const loadSample = useCallback(() => {
    const text = JSON.stringify(SAMPLE_JSON, null, 2)
    setInput(text)
    hideError()
  }, [hideError])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); formatJSON() }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') { e.preventDefault(); minifyJSON() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); validateJSON() }
      if (e.key === 'Escape') setUploadOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [formatJSON, minifyJSON, validateJSON])

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { handleInputChange(ev.target.result) }
    reader.readAsText(file)
  }, [handleInputChange])

  const inputSize = formatBytes(new TextEncoder().encode(input).length)
  const inputChars = input.length

  return (
    <>
      <Navbar
        onSave={saveOnline}
        onUpload={() => setUploadOpen(true)}
        onConvert={convertTo}
        onOpenTab={setActiveTab}
      />

      <StatusBar
        message={status}
        isError={isStatusError}
        ln={cursor.ln}
        col={cursor.col}
        size={inputSize}
        validIndicator={validIndicator}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 160px 1fr',
          height: 520, minHeight: 520,
          outline: dragOver ? '2px dashed var(--accent)' : 'none',
          outlineOffset: -2,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <InputPane
          value={input}
          onChange={handleInputChange}
          onCursor={(ln, col) => { setCursor({ ln, col }); inputGutter.setActiveLine(ln) }}
          gutter={inputGutter.state}
          onLineClick={inputGutter.handleLineClick}
          onJumpToLine={inputGutter.setActiveLine}
          errorLine={inputGutter.state.errorLine}
          errorMsg={errorMsg}
          ln={cursor.ln}
          col={cursor.col}
          chars={inputChars}
          onLoadSample={loadSample}
        />

        <ControlsPanel
          indent={indent}
          onIndentChange={setIndent}
          onFormat={formatJSON}
          onValidate={validateJSON}
          onMinify={minifyJSON}
          onConvert={convertTo}
          onUpload={() => setUploadOpen(true)}
          onDownload={downloadJSON}
          onClearAll={clearAll}
        />

        <OutputPane
          html={outputHTML}
          rawText={outputRaw}
          gutter={outputGutter.state}
          onLineClick={outputGutter.handleLineClick}
          onScrollActiveLine={outputGutter.setActiveLine}
          info={outputInfo.text}
          outType={outputInfo.outType}
        />
      </div>

      <Sections activeTab={activeTab} onTabChange={setActiveTab} />

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onFileLoad={(text) => { handleInputChange(text); setTimeout(formatJSON, 0) }}
        onUrlLoad={(text) => { handleInputChange(text); setTimeout(formatJSON, 0) }}
      />

      <Toast toast={toast} />
      <Tooltip />
    </>
  )
}
