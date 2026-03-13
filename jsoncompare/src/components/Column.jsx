import { useState, useCallback, useEffect } from 'react'
import { useToast } from '../hooks/useToast'
import { useGutter } from '../hooks/useGutter'
import { InputPane } from './InputPane'
import { OutputPane } from './OutputPane'
import { ControlsPanel } from './ControlsPanel'
import { RequestBar } from './RequestBar'
import {
  syntaxHighlight,
  formatBytes,
  getIndentValue,
  extractErrorLine,
  SAMPLE_JSON,
} from '../utils/json'

export function Column({ id, onStatus, showToast }) {
  const [input, setInput] = useState('')
  const [outputHTML, setOutputHTML] = useState('')
  const [outputRaw, setOutputRaw] = useState('')
  const [outputInfo, setOutputInfo] = useState({ text: '—', outType: '—' })
  const [indent, setIndent] = useState('2')
  const [cursor, setCursor] = useState({ ln: 1, col: 1 })
  const [errorMsg, setErrorMsg] = useState(null)
  const [validIndicator, setValidIndicator] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputGutter = useGutter()
  const outputGutter = useGutter()

  useEffect(() => {
    const count = (input || '\n').split('\n').length
    inputGutter.setLineCount(count)
  }, [input]) // eslint-disable-line

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
    onStatus('Erro: ' + msg, true)
    setValidIndicator('invalid')
    showToast('✗ ' + msg.slice(0, 60), 'error')
    const line = extractErrorLine(msg, source)
    if (line) inputGutter.setErrorLine(line)
  }, [onStatus, showToast]) // eslint-disable-line

  const hideError = useCallback(() => {
    setErrorMsg(null)
    setValidIndicator(null)
    inputGutter.clearError()
  }, []) // eslint-disable-line

  const handleInputChange = useCallback((val) => {
    setInput(val)
    hideError()
    setValidIndicator(null)
  }, [hideError])

  const parseInput = useCallback(() => {
    const raw = input.trim()
    if (!raw) { showToast('Nenhum dado na entrada (' + id + ')', ''); return null }
    try {
      return JSON.parse(raw)
    } catch (e) {
      showError(e.message, input)
      return null
    }
  }, [input, showToast, showError, id])

  const formatJSON = useCallback(() => {
    const obj = parseInput()
    if (obj === null) return
    const formatted = JSON.stringify(obj, null, getIndentValue(indent))
    setInput(formatted)
    renderOutput(formatted, obj)
    hideError()
    onStatus('Formatado com sucesso (' + id + ')', false)
    showToast('✓ JSON formatado (' + id + ')', 'success')
  }, [parseInput, indent, renderOutput, hideError, onStatus, showToast, id])

  const validateJSON = useCallback(() => {
    const raw = input.trim()
    if (!raw) { showToast('Nenhum dado para validar (' + id + ')', ''); return }
    try {
      JSON.parse(raw)
      hideError()
      onStatus('JSON válido ✓ (' + id + ')', false)
      setValidIndicator('valid')
      showToast('✓ JSON válido! (' + id + ')', 'success')
    } catch (e) {
      showError(e.message, input)
    }
  }, [input, hideError, onStatus, showToast, showError, id])

  const minifyJSON = useCallback(() => {
    const obj = parseInput()
    if (obj === null) return
    const min = JSON.stringify(obj)
    setInput(min)
    renderOutput(min, obj)
    hideError()
    onStatus('Minificado (' + id + ')', false)
    showToast('✓ JSON minificado (' + id + ')', 'success')
  }, [parseInput, renderOutput, hideError, onStatus, showToast, id])

  const loadSample = useCallback(() => {
    const text = JSON.stringify(SAMPLE_JSON, null, 2)
    setInput(text)
    hideError()
  }, [hideError])

  const handleRequest = async (method, url) => {
    setLoading(true)
    hideError()
    onStatus(`Enviando ${method} para ${url}...`, false)
    try {
      const options = {
        method,
        headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        body: method === 'POST' ? input : null,
      }
      const res = await fetch(url, options)
      const text = await res.text()
      
      handleInputChange(text)
      
      // Auto-format if it's valid JSON
      try {
        const obj = JSON.parse(text)
        const formatted = JSON.stringify(obj, null, getIndentValue(indent))
        setInput(formatted)
        renderOutput(formatted, obj)
        onStatus(`Sucesso: ${res.status}`, false)
        showToast(`✓ Request ${id} concluído`, 'success')
      } catch {
        onStatus(`Recebido (não JSON): ${res.status}`, false)
        showToast(`! Request ${id} concluído (não JSON)`, 'warning')
      }
    } catch (e) {
      showError(e.message, '')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { handleInputChange(ev.target.result) }
    reader.readAsText(file)
  }, [handleInputChange])

  const inputChars = input.length

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 140px',
        gridTemplateRows: 'auto 1fr 1fr',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        outline: dragOver ? '2px dashed var(--accent)' : 'none',
        outlineOffset: -2,
        borderRight: id === '1' ? '2px solid var(--border)' : 'none',
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Request Bar on top spanning across the column (except controls) */}
      <div style={{ gridRow: '1', gridColumn: '1', minWidth: 0 }}>
        <RequestBar onSend={handleRequest} loading={loading} />
      </div>

      <div style={{ gridRow: '2', gridColumn: '1', minHeight: 0, minWidth: 0 }}>
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
          headerLabel={`⌨ Entrada ${id}`}
        />
      </div>

      <div style={{ gridRow: '1 / span 3', gridColumn: '2', borderLeft: '1px solid var(--border)', background: 'var(--surface)', minWidth: 0 }}>
        <ControlsPanel
          indent={indent}
          onIndentChange={setIndent}
          onFormat={formatJSON}
          onValidate={validateJSON}
          onMinify={minifyJSON}
        />
      </div>

      <div style={{ gridRow: '3', gridColumn: '1', minHeight: 0, minWidth: 0, borderTop: '1px solid var(--border)' }}>
        <OutputPane
          html={outputHTML}
          rawText={outputRaw}
          gutter={outputGutter.state}
          onLineClick={outputGutter.handleLineClick}
          onScrollActiveLine={outputGutter.setActiveLine}
          info={outputInfo.text}
          outType={outputInfo.outType}
          headerLabel={`✦ Saída ${id}`}
        />
      </div>
    </div>
  )
}
