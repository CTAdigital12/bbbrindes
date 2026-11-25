'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { MediaPicker } from './MediaPicker'
import { Icon } from './icons'
import { photo, type ProductColor, type Variacao } from './model'
import type { FieldProps } from './ProductFields'
import { PaletaCores, type CorMarcada } from '../../components/produto/PaletaCores'
import { codigoDaCor, corPorCodigo } from '../../components/produto/cores-bb'

// Hex valido = #rrggbb. Vazio/nulo e legitimo: o site resolve o tom pelo nome da
// cor (HEX_PADRAO em frontend/src/lib/produtos.ts), entao nao forcamos tonalidade.
const isHex = (hex?: string | null) => /^#[0-9a-f]{6}$/i.test(hex || '')
// Nome travado quando a cor veio da paleta (tem codigo e nao e a "cor especial" 99).
// A especial (99) e as linhas legado sem codigo seguem editaveis (nome a mao).
const nomeTravado = (color: ProductColor) => Boolean(color.codigo) && String(color.codigo) !== '99'

// Tom so para DESENHAR a bolinha (nunca gravado por aqui): usa o override do produto
// (color.hex) se houver, senao o hex da paleta mestra pelo codigo. Vazio = cor sem tom
// unico (cromia / mix / especial) -> leque multicor.
function tomExibicao(color: ProductColor): string {
  if (isHex(color.hex)) return color.hex as string
  return corPorCodigo(color.codigo)?.hex || ''
}
function fundoCor(hex: string): React.CSSProperties {
  return hex
    ? { background: hex }
    : { background: 'conic-gradient(#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)' }
}

// Grade de chips de um bloco (item 5): uma linha .cc por cor marcada (bolinha, nome,
// codigo, foto, remover) + o contador e a biblioteca de cores (PaletaCores) que abre no
// botao "Adicionar cores". Reaproveitada nos dois blocos: o base grava no array `cores`,
// o acessorio em `variacao.coresAcessorio`. `idPrefix` separa os ids dos campos de nome
// entre os blocos; so o base casa com o errorField da validacao (bb-cor-nome-*), porque
// a validacao (product-validation.ts) so cobra o nome das cores do `cores`.
function ColorList({
  colors,
  onChange,
  disabled,
  errorField,
  idPrefix,
}: {
  colors: ProductColor[]
  onChange: (next: CorMarcada[]) => void
  disabled?: boolean
  errorField?: string
  idPrefix: string
}) {
  const [selected, setSelected] = useState<number>()
  const [aberta, setAberta] = useState(false)
  function update(index: number, patch: Partial<ProductColor>) {
    onChange(colors.map((color, i) => (i === index ? { ...color, ...patch } : color)))
  }

  const comFoto = colors.filter((c) => photo(c.imagem)?.url).length
  const semCodigo = colors.filter((c) => !c.codigo).length

  return (
    <>
      <div className="clh">
        <span className="lbl">Cores disponíveis</span>
        <span className="help">
          {colors.length} {colors.length === 1 ? 'cor' : 'cores'} · {comFoto} com foto
          {semCodigo > 0 ? (
            <>
              {' '}
              · <b style={{ color: 'var(--warn)' }}>{semCodigo} sem código</b>
            </>
          ) : null}
        </span>
      </div>
      <div className="clist">
        {colors.length === 0 ? (
          <p className="help" style={{ margin: 0 }}>
            Nenhuma cor ainda. Use &ldquo;Adicionar cores&rdquo; para escolher na paleta oficial da BB.
          </p>
        ) : (
          colors.map((color, index) => {
            const travado = nomeTravado(color)
            const nomeId = `${idPrefix}-${index}`
            const tom = tomExibicao(color)
            const img = photo(color.imagem)
            return (
              <div className="cc" key={color.id ?? index}>
                <span className="bb-cc-sw">
                  {tom ? (
                    <input
                      className="bb-cc-swi"
                      type="color"
                      aria-label={`Tonalidade de ${color.nome || `cor ${index + 1}`}`}
                      value={tom}
                      disabled={disabled}
                      onChange={(e) => update(index, { hex: e.target.value })}
                    />
                  ) : (
                    <span className="swatch" aria-hidden style={fundoCor('')} />
                  )}
                  {isHex(color.hex) ? (
                    <button
                      type="button"
                      className="bb-cc-auto"
                      disabled={disabled}
                      title="Usar tom automático (o site escolhe o tom pelo nome)"
                      aria-label={`Usar tom automático em ${color.nome || `cor ${index + 1}`}`}
                      onClick={() => update(index, { hex: null })}
                    >
                      auto
                    </button>
                  ) : null}
                </span>
                {travado ? (
                  <span className="cn" title={color.nome}>
                    {color.nome}
                  </span>
                ) : (
                  <input
                    id={nomeId}
                    className="inp bb-cc-name"
                    aria-label={`Nome da cor ${index + 1}`}
                    aria-required="true"
                    aria-invalid={errorField === nomeId}
                    aria-describedby={errorField === nomeId ? 'bb-product-error' : undefined}
                    placeholder="Nome da cor especial"
                    value={color.nome}
                    disabled={disabled}
                    onChange={(e) => update(index, { nome: e.target.value })}
                  />
                )}
                <code
                  className={color.codigo ? '' : 'miss'}
                  title={color.codigo ? `Código da cor: ${color.codigo}` : 'Falta o código da cor'}
                >
                  {color.codigo || '––'}
                </code>
                <span className="bb-cft-wrap">
                  {img?.url ? (
                    <>
                      <button
                        type="button"
                        className="cft"
                        title="Trocar foto"
                        aria-label={`Trocar foto de ${color.nome || `cor ${index + 1}`}`}
                        disabled={disabled}
                        onClick={() => setSelected(index)}
                      >
                        <img src={img.url} alt={color.nome} />
                      </button>
                      <button
                        type="button"
                        className="bb-cft-rm"
                        title="Remover foto"
                        aria-label={`Remover foto de ${color.nome || `cor ${index + 1}`}`}
                        disabled={disabled}
                        onClick={() => update(index, { imagem: null })}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="cft emp"
                      title="Foto da cor (opcional)"
                      aria-label={`Adicionar foto da cor ${index + 1}`}
                      disabled={disabled}
                      onClick={() => setSelected(index)}
                    >
                      +
                    </button>
                  )}
                </span>
                <button
                  type="button"
                  className="x"
                  aria-label={`Tirar ${color.nome || `cor ${index + 1}`} (desmarca na paleta)`}
                  disabled={disabled}
                  onClick={() => onChange(colors.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            )
          })
        )}
      </div>
      {colors.length ? (
        <p className="help" style={{ margin: '-2px 0 0' }}>
          O número ao lado de cada cor é o <b>código da cor</b> (2 dígitos). Ele monta o código que vai para o
          CRM, junto com o CIGAM do produto. A bolinha é opcional: em automático o site escolhe o tom pelo nome.
        </p>
      ) : null}
      {aberta ? (
        <PaletaCores value={colors} onChange={onChange} disabled={disabled} onClose={() => setAberta(false)} />
      ) : (
        <button type="button" className="btn sm" disabled={disabled} onClick={() => setAberta(true)}>
          <Icon name="plus" />
          Adicionar cores
        </button>
      )}
      {selected !== undefined ? (
        <MediaPicker onClose={() => setSelected(undefined)} onSelect={(images) => update(selected, { imagem: images[0] })} />
      ) : null}
    </>
  )
}

// Um bloco (.cblk do mock): card com cabecalho (titulo + subtitulo + toggle "Nao
// preencher"), rotulo "Nome que aparece no site" e a grade de chips. Ligado = tem cor;
// "nao preencher" esconde o seletor e entra como 00 no codigo do CRM.
function ColorBlock({
  titulo,
  subtitulo,
  mensagemNp,
  rotuloPlaceholder,
  rotuloId,
  rotulo,
  naoPreencher,
  onRotulo,
  onNaoPreencher,
  colors,
  onColors,
  disabled,
  errorField,
  idPrefix,
}: {
  titulo: string
  subtitulo: string
  mensagemNp: string
  rotuloPlaceholder: string
  rotuloId: string
  rotulo: string
  naoPreencher: boolean
  onRotulo: (value: string) => void
  onNaoPreencher: (value: boolean) => void
  colors: ProductColor[]
  onColors: (next: CorMarcada[]) => void
  disabled?: boolean
  errorField?: string
  idPrefix: string
}) {
  return (
    <section className={`cblk${naoPreencher ? ' off' : ''}`}>
      <header>
        <div>
          <b>{titulo}</b>
          <span>{subtitulo}</span>
        </div>
        <label className="np">
          <span className="sw">
            <input
              type="checkbox"
              checked={naoPreencher}
              disabled={disabled}
              aria-label={`Não preencher as cores: ${titulo}`}
              onChange={(e) => onNaoPreencher(e.target.checked)}
            />
            <span />
          </span>
          Não preencher
        </label>
      </header>
      {naoPreencher ? (
        <p className="cnp">
          {mensagemNp} No código do CRM, este bloco entra como <code>00</code>.
        </p>
      ) : (
        <>
          <div className="fld">
            <label htmlFor={rotuloId}>Nome que aparece no site</label>
            <input
              className="inp"
              id={rotuloId}
              placeholder={rotuloPlaceholder}
              value={rotulo}
              disabled={disabled}
              onChange={(e) => onRotulo(e.target.value)}
            />
          </div>
          <ColorList
            colors={colors}
            onChange={onColors}
            disabled={disabled}
            errorField={errorField}
            idPrefix={idPrefix}
          />
        </>
      )}
    </section>
  )
}

// Item 5 (cores base x acessorio): a aba Cores vira DOIS blocos. O base grava no array
// `cores` (como antes); o acessorio em `variacao.coresAcessorio`. Cada bloco tem um
// rotulo editavel (ex. "Garrafa"/"Tampa") e o toggle "Nao preencher" (ligado = o produto
// nao tem cor naquela metade). Defaults de produto legado (variacao indefinida): base
// preenche, acessorio nao preenche. No fim, a previa "Como aparece no site" e o resumo
// "Codigo para o CRM" (CIGAM + base + acessorio, sem hifen).
export function ProductColors({ product, change, disabled, errorField }: FieldProps) {
  const variacao: Variacao = product.variacao ?? {}
  const baseNaoPreencher = variacao.baseNaoPreencher ?? false
  const acessorioNaoPreencher = variacao.acessorioNaoPreencher ?? true
  const baseCores = product.cores ?? []
  const acessCores = variacao.coresAcessorio ?? []

  // "Ligado" = o bloco tem cor de verdade (preenchido e com ao menos 1 cor). Vale para a
  // previa e para o resumo do CRM (bloco desligado entra como 00).
  const baseOn = !baseNaoPreencher && baseCores.length > 0
  const acessOn = !acessorioNaoPreencher && acessCores.length > 0
  const cigam = product.codigoCigam || ''
  const cb = !baseOn ? '00' : codigoDaCor(baseCores[0]) ?? '??'
  const ca = !acessOn ? '00' : codigoDaCor(acessCores[0]) ?? '??'

  const blocosLigados: { rotulo?: string | null; cores: ProductColor[] }[] = []
  if (baseOn) blocosLigados.push({ rotulo: variacao.baseRotulo, cores: baseCores })
  if (acessOn) blocosLigados.push({ rotulo: variacao.acessorioRotulo, cores: acessCores })
  const combinacoes = blocosLigados.map((b) => b.cores.length)

  return (
    <div className="bb-color-blocks">
      <p className="sub" style={{ marginBottom: 12 }}>
        O site mostra até 2 seletores de cor. O nome que você escrever aparece em cima das bolinhas, com a cor
        escolhida ao lado.
      </p>
      <ColorBlock
        titulo="Base"
        subtitulo="Corpo do produto: garrafa, caneca, copo"
        mensagemNp="O site não mostra seletor de cor."
        rotuloPlaceholder="Ex.: Garrafa, Caneca, Copo"
        rotuloId="bb-variacao-baseRotulo"
        rotulo={variacao.baseRotulo ?? ''}
        naoPreencher={baseNaoPreencher}
        onRotulo={(v) => change('variacao.baseRotulo', v)}
        onNaoPreencher={(v) => change('variacao.baseNaoPreencher', v)}
        colors={baseCores}
        onColors={(next) => change('cores', next)}
        disabled={disabled}
        errorField={errorField}
        idPrefix="bb-cor-nome"
      />
      <ColorBlock
        titulo="Acessório"
        subtitulo="Parte que muda de cor à parte: tampa, alça, refil"
        mensagemNp="O site mostra só o seletor da Base."
        rotuloPlaceholder="Ex.: Tampa, Alça, Refil"
        rotuloId="bb-variacao-acessorioRotulo"
        rotulo={variacao.acessorioRotulo ?? ''}
        naoPreencher={acessorioNaoPreencher}
        onRotulo={(v) => change('variacao.acessorioRotulo', v)}
        onNaoPreencher={(v) => change('variacao.acessorioNaoPreencher', v)}
        colors={acessCores}
        onColors={(next) => change('variacao.coresAcessorio', next)}
        disabled={disabled}
        errorField={errorField}
        idPrefix="bb-coracess-nome"
      />
      <div className="cfim">
        <div className="cprev">
          <span className="lbl">Como aparece no site</span>
          {blocosLigados.length ? (
            blocosLigados.map((b, i) => (
              <div className="cpv" key={i}>
                <div>
                  <b>{b.rotulo || 'Cor'}:</b> {b.cores[0].nome}
                </div>
                <div className="dots">
                  {b.cores.map((c, j) => (
                    <i key={j} className={j === 0 ? 'on' : undefined} style={fundoCor(tomExibicao(c))} title={c.nome} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="help" style={{ margin: 0 }}>
              Sem seletor de cor no site.
            </p>
          )}
        </div>
        <div className="crm">
          <span className="lbl">Código para o CRM</span>
          <p className="help" style={{ margin: '2px 0 10px' }}>
            CIGAM do produto + 2 dígitos da Base + 2 dígitos do Acessório, sem hífen.
          </p>
          <div className="crmx">
            <code>{cigam || 'CIGAM'}</code>
            <i>+</i>
            <code>{cb}</code>
            <i>+</i>
            <code>{ca}</code>
            <i>=</i>
            <code className="res">{(cigam || 'CIGAM') + cb + ca}</code>
          </div>
          <p className="help" style={{ margin: '8px 0 0' }}>
            Exemplo com a 1ª cor de cada bloco
            {combinacoes.length > 1
              ? ` · ${combinacoes.join(' × ')} = ${combinacoes.reduce((a, b) => a * b, 1)} combinações`
              : combinacoes.length
                ? ` · ${combinacoes[0]} ${combinacoes[0] === 1 ? 'opção' : 'opções'}`
                : ''}
            . O CIGAM fica na aba Comercial.
          </p>
        </div>
      </div>
    </div>
  )
}
