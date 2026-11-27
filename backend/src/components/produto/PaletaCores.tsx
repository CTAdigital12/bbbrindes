'use client'
import React from 'react'
import { CORES_BB, GRUPOS_CORES, normalizarNome, type CorBB } from './cores-bb'

// Item A (revisao Plinio 10/11): a aba Cores deixa de ser texto livre. Mostramos a
// paleta com TODAS as cores da BB (uma bolinha por cor) e a pessoa so MARCA as que o
// produto tem. O dado gravado continua compativel com o site (cores[].nome/hex/imagem):
// cada cor marcada leva nome, codigo e tonalidade. O `codigo` (tabela mestra do CRM)
// alimenta o item E (codigos por cor). A foto-por-cor ja ligada e preservada: o seletor
// so adiciona/remove entradas, nunca mexe na imagem/hex das que continuam marcadas.
//
// Fonte da paleta (track 1b): a lista de cores vem agora da collection editavel cores-bb
// via REST (GET /api/cores-bb?limit=0&depth=0), e nao mais da constante CORES_BB. Como
// isto e um client component, a leitura e feita com fetch no useEffect (getPaleta e so
// server). FALLBACK: se o fetch falhar ou vier vazio, usamos CORES_BB/GRUPOS_CORES, que
// seguem existindo como seed e rede de seguranca (o build nao pode quebrar com a
// collection vazia).
//
// VISUAL (feat/admin-cores-visual): este componente agora e a "Biblioteca de cores"
// (.cpick do mock da Joy): grupos com "Incluir todas", chips .cpc e o form "Cor nova"
// inline (POST /api/cores-bb -> recarrega -> ja marca no bloco). O onClose (botao
// "Pronto") e desenhado pelo ColorList que abre/fecha a biblioteca.

// Tipo frouxo de propósito: serve a friendly view e a nativa sem acoplar ao model.
export type CorMarcada = {
  id?: string
  nome: string
  hex?: string | null
  codigo?: string | null
  imagem?: unknown
}

function estaMarcada(cor: CorBB, atuais: CorMarcada[]): number {
  return atuais.findIndex(
    (c) =>
      (c.codigo && String(c.codigo).padStart(2, '0') === cor.codigo) ||
      normalizarNome(c.nome) === normalizarNome(cor.nome),
  )
}

function paraCorMarcada({ nome, codigo, hex }: CorBB): CorMarcada {
  return { nome, codigo, hex: hex || undefined }
}

// Fundo da bolinha: hex solido, ou leque multicor para cromia / mix / especial (hex vazio).
function fundoCor(hex: string): React.CSSProperties {
  return hex
    ? { background: hex }
    : { background: 'conic-gradient(#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)' }
}

type NovaCor = { nome: string; hex: string; codigo: string; grupo: string }
const NOVA_VAZIA: NovaCor = { nome: '', hex: '#4a8f6a', codigo: '', grupo: GRUPOS_CORES[0] }

export function PaletaCores({
  value,
  onChange,
  disabled,
  onClose,
}: {
  value: CorMarcada[]
  onChange: (cores: CorMarcada[]) => void
  disabled?: boolean
  // Quando fornecido, desenha o rodape "Pronto" que fecha a biblioteca (estado no ColorList).
  onClose?: () => void
}) {
  const atuais = value ?? []

  // Paleta lida da collection cores-bb. Comeca com a constante (fallback/seed) para o
  // primeiro render nunca ficar vazio; o fetch substitui pela lista da collection.
  const [cores, setCores] = React.useState<CorBB[]>(CORES_BB)
  const [nova, setNova] = React.useState<NovaCor>(NOVA_VAZIA)
  const [erro, setErro] = React.useState('')
  const [criando, setCriando] = React.useState(false)

  // Leitura (reusada no mount e depois de criar uma cor). Devolve a lista ou null em falha.
  const carregar = React.useCallback(async (): Promise<CorBB[] | null> => {
    try {
      const resp = await fetch('/api/cores-bb?limit=0&depth=0', { credentials: 'include' })
      if (!resp.ok) return null
      const data = (await resp.json()) as { docs?: Array<Record<string, unknown>> }
      const docs = Array.isArray(data?.docs) ? data.docs : []
      if (docs.length === 0) return null // vazio: mantem o fallback CORES_BB
      return docs.map((d) => ({
        codigo: String(d?.codigo ?? ''),
        nome: String(d?.nome ?? ''),
        grupo: String(d?.grupo ?? ''),
        hex: d?.hex ? String(d.hex) : '',
      }))
    } catch {
      return null // falha de rede: mantem o fallback CORES_BB ja no estado.
    }
  }, [])

  React.useEffect(() => {
    let ativo = true
    ;(async () => {
      const lista = await carregar()
      if (ativo && lista) setCores(lista)
    })()
    return () => {
      ativo = false
    }
  }, [carregar])

  function alternar(cor: CorBB) {
    if (disabled) return
    const idx = estaMarcada(cor, atuais)
    if (idx >= 0) {
      onChange(atuais.filter((_, i) => i !== idx))
    } else {
      onChange([...atuais, paraCorMarcada(cor)])
    }
  }

  // "Incluir todas": marca as cores do grupo que ainda nao estao no bloco (nunca desmarca).
  function incluirTodas(grupo: string) {
    if (disabled) return
    const faltando = cores.filter((c) => c.grupo === grupo && estaMarcada(c, atuais) < 0)
    if (faltando.length === 0) return
    onChange([...atuais, ...faltando.map(paraCorMarcada)])
  }

  // "Criar e incluir": valida na UI (00/99 reservados, codigo/nome duplicado), faz
  // POST /api/cores-bb (a collection exige editor/admin), recarrega a biblioteca e ja
  // inclui a cor nova no bloco. Mesma ordem de mensagens do mock aprovado.
  async function criar() {
    if (disabled || criando) return
    const nome = nova.nome.trim()
    const cod = nova.codigo.trim()
    const dupCod = cores.find((c) => c.codigo === cod)
    const dupNome = cores.find((c) => normalizarNome(c.nome) === normalizarNome(nome))
    const msg = !nome
      ? 'Dê um nome à cor.'
      : !/^\d{2}$/.test(cod)
        ? 'O código precisa ter 2 dígitos, sem hífen (ex.: 19).'
        : cod === '00' || cod === '99'
          ? `O código ${cod} é reservado.`
          : dupCod
            ? `O código ${cod} já é da cor ${dupCod.nome}.`
            : dupNome
              ? `Já existe a cor ${dupNome.nome} (código ${dupNome.codigo}).`
              : ''
    if (msg) {
      setErro(msg)
      return
    }
    setErro('')
    setCriando(true)
    const novaCor = { ...nova, nome, codigo: cod }
    try {
      const resp = await fetch('/api/cores-bb', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCor),
      })
      if (!resp.ok) {
        let detalhe = ''
        try {
          const err = (await resp.json()) as { errors?: Array<{ message?: string }>; message?: string }
          detalhe = err?.errors?.[0]?.message || err?.message || ''
        } catch {
          // corpo nao-JSON: cai na mensagem generica abaixo
        }
        setErro(
          detalhe ||
            (resp.status === 403
              ? 'Sem permissão para criar cores (precisa ser editor ou admin).'
              : `Não deu para criar a cor (erro ${resp.status}).`),
        )
        return
      }
      onChange([...atuais, paraCorMarcada(novaCor)])
      setNova({ ...NOVA_VAZIA, grupo: nova.grupo })
      const lista = await carregar()
      if (lista) setCores(lista)
    } catch {
      setErro('Falha de rede ao criar a cor. Tente de novo.')
    } finally {
      setCriando(false)
    }
  }

  const grupos = GRUPOS_CORES.filter((g) => cores.some((c) => c.grupo === g))

  return (
    <div className="cpick">
      <div className="cph">
        <b>Biblioteca de cores</b>
        <span>Clique em uma cor para incluir ou tirar deste bloco. O número é o código do CRM.</span>
      </div>
      {grupos.map((grupo) => {
        const doGrupo = cores.filter((c) => c.grupo === grupo)
        return (
          <div key={grupo}>
            <div className="cpgh">
              <h5>{grupo}</h5>
              <button type="button" className="lnk" disabled={disabled} onClick={() => incluirTodas(grupo)}>
                Incluir todas
              </button>
            </div>
            <div className="cpg">
              {doGrupo.map((cor) => {
                const marcada = estaMarcada(cor, atuais) >= 0
                return (
                  <button
                    key={cor.codigo}
                    type="button"
                    className={`cpc${marcada ? ' on' : ''}`}
                    onClick={() => alternar(cor)}
                    disabled={disabled}
                    aria-pressed={marcada}
                    title={`${cor.codigo} ${cor.nome}`}
                  >
                    <span className="swatch" aria-hidden style={fundoCor(cor.hex)} />
                    <span>{cor.nome}</span>
                    <code>{cor.codigo}</code>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="cnew">
        <h5>Cor nova</h5>
        <div className="cnr">
          <div className="fld">
            <label htmlFor="bb-cn-nome">Nome</label>
            <input
              className="inp"
              id="bb-cn-nome"
              value={nova.nome}
              disabled={disabled || criando}
              placeholder="Ex.: Verde Água"
              onChange={(e) => setNova({ ...nova, nome: e.target.value })}
            />
          </div>
          <div className="fld">
            <label htmlFor="bb-cn-hex">Tonalidade</label>
            <span className="cnhex">
              <input
                type="color"
                id="bb-cn-hex"
                value={nova.hex}
                disabled={disabled || criando}
                aria-label="Escolher tonalidade"
                onChange={(e) => setNova({ ...nova, hex: e.target.value })}
              />
              <code>{nova.hex}</code>
            </span>
          </div>
          <div className="fld">
            <label htmlFor="bb-cn-cod">Código</label>
            <input
              className="inp"
              id="bb-cn-cod"
              value={nova.codigo}
              disabled={disabled || criando}
              inputMode="numeric"
              maxLength={2}
              placeholder="19"
              onChange={(e) => setNova({ ...nova, codigo: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            />
          </div>
          <div className="fld">
            <label htmlFor="bb-cn-grupo">Grupo</label>
            <select
              className="sel"
              id="bb-cn-grupo"
              value={nova.grupo}
              disabled={disabled || criando}
              onChange={(e) => setNova({ ...nova, grupo: e.target.value })}
            >
              {GRUPOS_CORES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn sm pri" disabled={disabled || criando} onClick={criar}>
            {criando ? 'Criando…' : 'Criar e incluir'}
          </button>
        </div>
        {erro ? (
          <p className="cerr" role="alert">
            {erro}
          </p>
        ) : null}
        <p className="help" style={{ margin: '6px 0 0' }}>
          Código com 2 dígitos, sem hífen. 00 e 99 são reservados: 00 = &ldquo;Não preencher&rdquo; e 99 = cor
          especial.
        </p>
      </div>
      {onClose ? (
        <div className="cpf">
          <button type="button" className="btn sm" onClick={onClose}>
            Pronto
          </button>
        </div>
      ) : null}
    </div>
  )
}
