'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { ProductGallery } from './ProductGallery'
import { ProductPlacement, ProductChannels } from './ProductPlacement'
import { ProductColors } from './ProductColors'
import { fieldValue, plainText, richText } from './product-data'
import { photo, type Product } from './model'
import { MediaPicker } from './MediaPicker'
import { CodigosPorCorView } from '../../components/produto/CodigosPorCorView'

export type FieldProps = { product: Product; change: (field: string, value: unknown) => void; disabled?: boolean; errorField?: string }
export function ProductField({ product, change, field, label, multiline = false, type = 'text', disabled = false, errorField, help }: FieldProps & { field: string; label: string; multiline?: boolean; type?: string; help?: string }) {
  const id = `bb-${field.replaceAll('.', '-')}`
  return <div className="fld"><label htmlFor={id}>{label}</label>{multiline ? <textarea id={id} aria-invalid={errorField === id} aria-describedby={errorField === id ? 'bb-product-error' : undefined} rows={4} value={fieldValue(product, field)} disabled={disabled} onChange={e => change(field, e.target.value)} /> : <input className="inp" id={id} aria-invalid={errorField === id} aria-describedby={errorField === id ? 'bb-product-error' : undefined} type={type} min={type === 'number' ? 1 : undefined} value={fieldValue(product, field)} disabled={disabled} onChange={e => change(field, type === 'number' ? (e.target.value ? Number(e.target.value) : null) : e.target.value)} />}{help ? <span className="help">{help}</span> : null}</div>
}
function General(props: FieldProps) {
  const { product, change, disabled } = props
  return <>
    <ProductField {...props} field="subtitulo" label="Subtítulo (opcional)" multiline />
    <ProductField {...props} field="headline" label="Chamada do produto" />
    <div className="fld"><label htmlFor="bb-descricao">Descrição</label><textarea id="bb-descricao" rows={6} disabled={disabled} value={plainText(product.descricaoCompleta)} onChange={e => change('descricaoCompleta', richText(e.target.value))} /></div>
    <div className="row2"><ProductField {...props} field="codigoSite" label="Código do produto" /><ProductField {...props} field="quantidadeMinima" label="Quantidade mínima" type="number" /></div>
    <label className="bb-check"><input type="checkbox" checked={Boolean(product.ecologico)} disabled={disabled} onChange={e => change('ecologico', e.target.checked)} />Produto ecológico</label>
    <div className="fld"><span className="lbl">Fotos</span><ProductGallery images={product.imagens ?? []} onChange={images => change('imagens', images)} disabled={disabled} /></div>
    <details className="adv"><summary>Mais informações do produto</summary><ProductField {...props} field="descricaoCurta" label="Descrição curta" multiline />
      {(['beneficios', 'idealPara', 'diferenciais'] as const).map((field, index) => <div className="fld" key={field}><label htmlFor={`bb-${field}`}>{['Principais benefícios', 'Ideal para', 'Diferenciais BB Brindes'][index]}</label><textarea id={`bb-${field}`} value={(product[field] ?? []).join('\n')} onChange={e => change(field, e.target.value.split('\n'))} disabled={disabled} /><span className="help">Uma informação por linha.</span></div>)}
    </details><ProductPlacement {...props} />
  </>
}
function Photos(props: FieldProps) {
  // Item C: além da imagem ambientada, um slot "Imagem de dimensões" (o site abre no
  // "ver dimensões"). Um único seletor de mídia atende os dois, pelo alvo em foco.
  const [picker, setPicker] = React.useState<null | 'imagemAmbientada' | 'imagemDimensoes'>(null)
  const slot = (field: 'imagemAmbientada' | 'imagemDimensoes', titulo: string, cta: string) => {
    const img = photo(props.product[field])
    return <div className="fld"><span className="lbl">{titulo}</span>{img?.url
      ? <div className="imgset"><img src={img.url} alt={titulo} /><div className="i"><b>{titulo}</b><div className="acts"><button type="button" className="lnk" disabled={props.disabled} onClick={() => setPicker(field)}>Trocar</button><button type="button" className="lnk red" disabled={props.disabled} onClick={() => props.change(field, null)}>Remover</button></div></div></div>
      : <button type="button" className="btn ghost" disabled={props.disabled} onClick={() => setPicker(field)}>{cta}</button>}</div>
  }
  return <><div className="fld"><span className="lbl">Fotos do produto</span><ProductGallery images={props.product.imagens ?? []} onChange={images => props.change('imagens', images)} disabled={props.disabled} /></div>
    <ProductField {...props} field="videoUrl" label="Vídeo do produto (opcional)" help="Cole o link do YouTube." />
    {slot('imagemAmbientada', 'Imagem ambientada', 'Escolher imagem ambientada')}
    {slot('imagemDimensoes', 'Imagem de dimensões', 'Escolher imagem de dimensões')}
    {picker ? <MediaPicker onClose={() => setPicker(null)} onSelect={images => { props.change(picker, images[0]); setPicker(null) }} /> : null}
  </>
}
function Personalization(props: FieldProps) {
  // Item D: marca-se o método disponível (checkbox); a área/tamanho só aparece quando
  // o método está marcado. Usa os mesmos campos do schema (impressao.metodoX/areaX).
  const imp = (props.product.impressao ?? {}) as Record<string, unknown>
  const metodos: [string, string, string][] = [
    ['metodoTransfer', 'areaTransfer', 'Transfer'],
    ['metodoTampografia', 'areaTampografia', 'Tampografia'],
    ['metodoSerigrafia', 'areaSerigrafia', 'Serigrafia'],
    ['metodoSleeve', 'sleeve', 'Sleeve'],
  ]
  return <><p className="sub">Marque os métodos de personalização disponíveis. A área ou tamanho de cada um aparece só quando o método está marcado.</p>
    {metodos.map(([flag, area, label]) => <div className="fld" key={flag}>
      <label className="bb-check"><input type="checkbox" checked={Boolean(imp[flag])} disabled={props.disabled} onChange={e => props.change(`impressao.${flag}`, e.target.checked)} />{label}</label>
      {imp[flag] ? <ProductField {...props} field={`impressao.${area}`} label={`Área de impressão (${label.toLowerCase()})`} /> : null}
    </div>)}
    <ProductField {...props} field="impressao.metodos" label="Observações de impressão (opcional)" help="Texto livre, se precisar detalhar." />
  </>
}
function Technical(props: FieldProps) {
  const rows = props.product.especificacoes ?? []
  function update(index: number, key: string, value: string) { props.change('especificacoes', rows.map((row, i) => i === index ? { ...row, [key]: value } : row)) }
  return <><div className="row2">{[['materiaPrima', 'Material'], ['dimensoes', 'Dimensões'], ['pesoUnitario', 'Peso unitário'], ['ncm', 'NCM'], ['modeloCaixaMaster', 'Modelo da caixa master'], ['qtdPorCaixa', 'Quantidade por caixa'], ['dimensoesCaixaMaster', 'Dimensões da caixa master'], ['pesoCaixaMaster', 'Peso da caixa master']].map(([field, label]) => <ProductField {...props} key={field} field={`logistica.${field}`} label={label} type={field === 'qtdPorCaixa' ? 'number' : 'text'} />)}</div>
    <h3>Especificações</h3>{rows.map((row, index) => <div className="bb-spec-row" key={row.id ?? index}><input className="inp" aria-label={`Nome da especificação ${index + 1}`} value={row.rotulo} disabled={props.disabled} onChange={e => update(index, 'rotulo', e.target.value)} /><input className="inp" aria-label={`Valor da especificação ${index + 1}`} value={row.valor} disabled={props.disabled} onChange={e => update(index, 'valor', e.target.value)} /><button type="button" className="btn danger" aria-label={`Remover especificação ${index + 1}`} disabled={props.disabled} onClick={() => props.change('especificacoes', rows.filter((_, i) => i !== index))}>×</button></div>)}
    <button type="button" className="btn sm" disabled={props.disabled} onClick={() => props.change('especificacoes', [...rows, { rotulo: '', valor: '' }])}>+ Adicionar especificação</button>
  </>
}
function SEO(props: FieldProps) {
  const keywords = props.product.seo?.palavrasChave as string[] | undefined
  return <><ProductField {...props} field="seo.titleTag" label="Título no Google (opcional)" /><ProductField {...props} field="seo.metaDescription" label="Descrição no Google (opcional)" multiline /><ProductField {...props} field="seo.altTextPrincipal" label="Descrição da foto principal" />
    <div className="fld"><label htmlFor="bb-keywords">Palavras-chave</label><textarea id="bb-keywords" disabled={props.disabled} value={(keywords ?? []).join('\n')} onChange={e => props.change('seo.palavrasChave', e.target.value.split('\n').filter(Boolean))} /><span className="help">Uma palavra ou expressão por linha.</span></div></>
}
function Commercial(props: FieldProps) {
  // Item E: preço e estoque saíram daqui (vêm do CIGAM/CRM, nunca editados). Fica o
  // código CIGAM e a relação de códigos por cor (read-only), que é o que vai ao CRM.
  const cores = (props.product.cores ?? []).map(cor => ({ nome: cor.nome, codigo: cor.codigo }))
  return <><div className="lock"><span>Informações internas do cadastro. Preço e estoque têm origem no CRM e não são editados aqui.</span></div>
    <div className="fld" style={{ maxWidth: 320 }}><ProductField {...props} field="codigoCigam" label="Código CIGAM" help="Chave do produto no CRM/ERP." /></div>
    <CodigosPorCorView cigam={props.product.codigoCigam} cores={cores} />
    <ProductField {...props} field="argumentoComercial" label="Argumento comercial" multiline /><ProductChannels {...props} /></>
}
export const PRODUCT_TABS = [ ['geral', 'Geral'], ['fotos', 'Fotos e vídeo'], ['cores', 'Cores'], ['pers', 'Personalização'], ['ficha', 'Ficha técnica'], ['seo', 'SEO'], ['com', 'Comercial'] ] as const
export function ProductFields({ tab, ...props }: FieldProps & { tab: string }) {
  const components: Record<string, React.ComponentType<FieldProps>> = { geral: General, fotos: Photos, cores: ProductColors, pers: Personalization, ficha: Technical, seo: SEO, com: Commercial }
  const Fields = components[tab] ?? General
  return <Fields {...props} />
}
