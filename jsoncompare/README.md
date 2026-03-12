# JSON Compare

Ferramentas de JSON em uma UI rápida (React + Vite). O foco do projeto é oferecer utilitários como **formatar**, **validar**, **minificar** e **converter** JSON (XML/CSV/YAML), com uma interface moderna e atalhos de teclado.

## Requisitos

- Node.js (recomendado: LTS)
- npm

## Como rodar

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Pré-visualizar o build:

```bash
npm run preview
```

## Estrutura de pastas

O `src/` é organizado para separar responsabilidades:

- **`src/pages/`**: páginas/ferramentas do site (telas).
- **`src/components/`**: componentes reutilizáveis da UI.
- **`src/hooks/`**: hooks reutilizáveis (estado/comportamento).
- **`src/utils/`**: funções utilitárias/lógica (ex.: JSON, conversões, etc.).
- **`src/services/`**: camada de HTTP/integrações (quando houver).
- **`src/styles/`**: estilos globais/temas (quando usado).

Arquivos principais:

- **`src/main.jsx`**: bootstrap do React.
- **`src/App.jsx`**: tela principal atual da ferramenta.

## Funcionalidades atuais (JSON Formatter)

- **Formatar JSON**: formata com indentação configurável.
- **Validar JSON**: valida e mostra status.
- **Minificar JSON**: remove espaços/quebras.
- **Converter**: JSON → XML / CSV / YAML.
- **Upload**:
  - **Arquivo**: carrega `.json`/`.txt`.
  - **URL**: busca o conteúdo via `fetch` e carrega no editor.

## Depuração de requisições HTTP

Quando você usar o upload via URL (no modal), o console do navegador mostrará:

- `Enviando requisição para:` (URL)
- `Status da resposta:` (HTTP status)
- `Dados recebidos:` (conteúdo retornado)
- `Erro na requisição:` (em caso de falha)

