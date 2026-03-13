import { useState } from 'react'

const FAQ_ITEMS = [
  { q: 'Por que usar o JSONCompare?', a: 'É uma ferramenta única para formatar, validar, converter e visualizar JSON. Funciona 100% no navegador, sem enviar dados para servidores externos.' },
  { q: 'Como formatar um arquivo JSON?', a: 'Clique em "Upload", selecione seu arquivo .json, depois clique em "Formatar". O resultado aparece no painel direito com realce de sintaxe.' },
  { q: 'Meus dados são enviados para algum servidor?', a: 'Não. Todo o processamento acontece localmente no seu navegador. Nenhum dado é transmitido para servidores externos.' },
  { q: 'O que é Tree View?', a: 'É uma visualização hierárquica expansível do JSON formatado, útil para explorar estruturas complexas.' },
]

const tabBtnStyle = (active) => ({
  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
  padding: '12px 18px', cursor: 'pointer',
  border: 'none', borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
  background: 'none', color: active ? 'var(--accent)' : 'var(--text3)',
  transition: 'all .15s',
})

export function Sections({ activeTab, onTabChange }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        {['about', 'faq'].map((t) => (
          <button key={t} style={tabBtnStyle(activeTab === t)} onClick={() => onTabChange(t)}>
            {t === 'about' ? 'Sobre' : 'FAQ'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px 24px' }}>
        {activeTab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Exemplo JSON</h3>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 12 }}>
                Experimente com dados reais. Clique em <strong>※ Exemplo</strong> para carregar.
              </p>
              <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, marginTop: 16, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', overflowX: 'auto' }}>
{`{
  "empresa": {
    "nome": "Tech Corp",
    "fundada": 2010,
    "ativa": true,
    "produtos": [
      { "id": 1, "nome": "API Pro" },
      { "id": 2, "nome": "Dashboard" }
    ],
    "contato": null
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 800 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', transition: 'background .15s' }}
                >
                  {item.q}
                  <span style={{ color: 'var(--text3)', fontSize: 12, transition: 'transform .2s', transform: openFaq === i ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
