// ─── Formatting ──────────────────────────────────────────────────────────────

export const LINE_H = 13.5 * 1.65 // ~22.275px

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getIndentValue(indent) {
  return indent === 'tab' ? '\t' : parseInt(indent)
}

// ─── Syntax highlight (returns HTML string) ──────────────────────────────────

export function syntaxHighlight(json) {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="j-key">${match}</span>`
        return `<span class="j-str">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="j-bool">${match}</span>`
      if (/null/.test(match)) return `<span class="j-null">${match}</span>`
      return `<span class="j-num">${match}</span>`
    }
  )
}

// ─── Error line extraction ────────────────────────────────────────────────────

export function extractErrorLine(msg, source) {
  let m = msg.match(/line (\d+)/i)
  if (m) return parseInt(m[1])
  m = msg.match(/position (\d+)/i)
  if (m) {
    const pos = parseInt(m[1])
    return source.substring(0, pos).split('\n').length
  }
  return null
}

// ─── Escape HTML ─────────────────────────────────────────────────────────────

function escapeHTML(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ─── Tree builder (returns HTML string) ──────────────────────────────────────

export function buildTree(val, depth = 0) {
  const indent = '  '.repeat(depth)

  if (val === null) return `<span class="j-null">null</span>`
  if (typeof val === 'boolean') return `<span class="j-bool">${val}</span>`
  if (typeof val === 'number') return `<span class="j-num">${val}</span>`
  if (typeof val === 'string') return `<span class="j-str">"${escapeHTML(val)}"</span>`

  if (Array.isArray(val)) {
    if (val.length === 0) return `<span class="j-brace">[]</span>`
    const id = 'node-' + Math.random().toString(36).slice(2)
    const items = val
      .map((v, i) => `\n${indent}  <span class="j-num">${i}</span>: ${buildTree(v, depth + 1)}`)
      .join(',')
    return (
      `<span class="j-brace tree-toggle" onclick="window.__toggleNode('${id}')" style="cursor:pointer">▾ [</span>` +
      `<span id="${id}">${items}\n${indent}</span>` +
      `<span class="j-brace">]</span>`
    )
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val)
    if (keys.length === 0) return `<span class="j-brace">{}</span>`
    const id = 'node-' + Math.random().toString(36).slice(2)
    const items = keys
      .map((k) => `\n${indent}  <span class="j-key">"${escapeHTML(k)}"</span>: ${buildTree(val[k], depth + 1)}`)
      .join(',')
    return (
      `<span class="j-brace tree-toggle" onclick="window.__toggleNode('${id}')" style="cursor:pointer">▾ {</span>` +
      `<span id="${id}">${items}\n${indent}</span>` +
      `<span class="j-brace">}</span>`
    )
  }

  return escapeHTML(String(val))
}

// Expose toggleNode for inline onclick handlers inside tree HTML
window.__toggleNode = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const hidden = el.style.display === 'none'
  el.style.display = hidden ? 'inline' : 'none'
  const toggle = el.previousElementSibling
  if (toggle) toggle.textContent = toggle.textContent.replace(hidden ? '▸' : '▾', hidden ? '▾' : '▸')
}

// ─── Converters ──────────────────────────────────────────────────────────────

export function toXML(val, tag, depth) {
  const indent = '  '.repeat(depth)
  if (val === null) return `${indent}<${tag} nil="true"/>\n`
  if (typeof val !== 'object') return `${indent}<${tag}>${escapeHTML(String(val))}</${tag}>\n`
  if (Array.isArray(val)) return val.map((v) => toXML(v, tag.replace(/s$/, ''), depth)).join('')
  const children = Object.entries(val).map(([k, v]) => toXML(v, k, depth + 1)).join('')
  return `${indent}<${tag}>\n${children}${indent}</${tag}>\n`
}

export function toCSV(obj) {
  const arr = Array.isArray(obj) ? obj : [obj]
  const keys = [...new Set(arr.flatMap((o) => (typeof o === 'object' && o ? Object.keys(o) : [])))]
  if (!keys.length) throw new Error('Não é possível converter para CSV: sem chaves')
  const header = keys.map((k) => `"${k}"`).join(',')
  const rows = arr.map((o) =>
    keys.map((k) => {
      const v = o?.[k]
      if (v === null || v === undefined) return ''
      if (typeof v === 'object') return `"${JSON.stringify(v).replace(/"/g, '""')}"`
      return `"${String(v).replace(/"/g, '""')}"`
    }).join(',')
  )
  return [header, ...rows].join('\n')
}

export function toYAML(val, depth) {
  const indent = '  '.repeat(depth)
  if (val === null) return 'null'
  if (typeof val === 'boolean') return String(val)
  if (typeof val === 'number') return String(val)
  if (typeof val === 'string') {
    if (/[\n:#{}\[\],&*?|<>=!%@`]/.test(val) || val.trim() !== val)
      return `"${val.replace(/"/g, '\\"')}"`
    return val
  }
  if (Array.isArray(val)) {
    if (!val.length) return '[]'
    return '\n' + val.map((v) => `${indent}- ${toYAML(v, depth + 1)}`).join('\n')
  }
  if (typeof val === 'object') {
    if (!Object.keys(val).length) return '{}'
    return '\n' + Object.entries(val).map(([k, v]) => {
      const yv = toYAML(v, depth + 1)
      return `${indent}${k}:${yv.startsWith('\n') ? yv : ' ' + yv}`
    }).join('\n')
  }
  return String(val)
}

// ─── Sample data ──────────────────────────────────────────────────────────────

export const SAMPLE_JSON = {
  empresa: {
    nome: 'Tech Corp',
    fundada: 2010,
    ativa: true,
    sede: { cidade: 'São Paulo', país: 'Brasil' },
    produtos: [
      { id: 1, nome: 'API Pro', preco: 99.9 },
      { id: 2, nome: 'Dashboard', preco: 49.9 },
    ],
    contato: null,
  },
}