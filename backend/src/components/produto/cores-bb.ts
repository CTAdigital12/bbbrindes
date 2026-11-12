// Paleta mestra de cores da BB Brindes (item A e item E da revisao do Plinio 10/11).
//
// Fonte: _catalogo-12_10/plan-color-codes.json (tabela mestra codigo -> nome, a mesma
// que vai para o CRM/Leads2b). Aqui ela fica embutida como constante para o admin nao
// depender de arquivo de outro repo em tempo de build. Se a tabela mestra mudar na
// planilha, atualizar este arquivo (manter os codigos como no CRM).
//
// O `hex` abaixo e so para desenhar a bolinha no seletor (display). Nao e fonte da
// verdade de tom: o site resolve o tom pelo nome da cor (HEX_PADRAO em
// frontend/src/lib/produtos.ts). Por isso o seletor NAO grava hex automaticamente.

export type CorBB = {
  codigo: string
  nome: string
  grupo: string
  // Hex apenas para a bolinha do seletor. Vazio = render especial (ex.: cromia, mix).
  hex: string
}

// Grupos derivados da faixa de codigo (mesma logica da planilha).
export const GRUPOS_CORES = ['Padrao', 'Cristal', 'Green Fibras', 'Green Plasticaria', 'Especial'] as const

function grupoPorCodigo(codigo: string): string {
  const n = Number(codigo)
  if (n >= 30 && n <= 38) return 'Cristal'
  if (n >= 50 && n <= 57) return 'Green Fibras'
  if (n >= 70 && n <= 80) return 'Green Plasticaria'
  if (n === 99) return 'Especial'
  return 'Padrao'
}

// codigo -> { nome, hex de display }. Ordem = ordem da tabela mestra.
const BASE: Array<[string, string, string]> = [
  ['01', 'cromia digital', ''],
  ['02', 'preto', '#111827'],
  ['03', 'branco', '#ffffff'],
  ['04', 'amarelo', '#facc15'],
  ['05', 'alaranjado', '#f97316'],
  ['06', 'cafe', '#6f4e37'],
  ['07', 'creme', '#f5f0e1'],
  ['08', 'natural', '#e7dcc8'],
  ['09', 'prata', '#c0c0c0'],
  ['10', 'lilas', '#c084fc'],
  ['11', 'azul royal', '#1d4ed8'],
  ['12', 'verde', '#16a34a'],
  ['13', 'vermelho', '#dc2626'],
  ['14', 'dourado', '#d4af37'],
  ['15', 'verde neon', '#39ff14'],
  ['16', 'amarelo neon', '#faff00'],
  ['17', 'rosa neon', '#ff10f0'],
  ['18', 'alaranjado neon', '#ff5e00'],
  ['30', 'azul cristal', '#7fb5e6'],
  ['31', 'verde cristal', '#8fd9b6'],
  ['32', 'vermelho cristal', '#e9808f'],
  ['33', 'lilas cristal', '#d2b4f0'],
  ['34', 'cristal', '#e8f0f5'],
  ['35', 'verde neon cristal', '#9dffb0'],
  ['36', 'amarelo neon cristal', '#f2ff99'],
  ['37', 'rosa neon cristal', '#ffa6e6'],
  ['38', 'alaranjado neon cristal', '#ffb27f'],
  ['50', 'green fibras madeira', '#9c6b3f'],
  ['51', 'green fibras coco', '#7b5230'],
  ['52', 'green fibras palha', '#d9c27e'],
  ['53', 'green fibras lilas', '#b89cc8'],
  ['54', 'green fibras azul', '#5b86a8'],
  ['55', 'green fibras verde', '#6f8f5a'],
  ['56', 'green fibras vermelho', '#b05a4a'],
  ['57', 'green fibras amarelo', '#cdb85f'],
  ['70', 'green plasticaria alaranjado', '#e08a3c'],
  ['71', 'green plasticaria amarelo', '#e6c84f'],
  ['72', 'green plasticaria verde', '#5a9e5a'],
  ['73', 'green plasticaria azul', '#4a79b0'],
  ['74', 'green plasticaria lilas', '#a98fc4'],
  ['75', 'green plasticaria rosa', '#d98cae'],
  ['76', 'green plasticaria vermelho', '#c0564a'],
  ['77', 'green plasticaria branco', '#f3f3ef'],
  ['78', 'green plasticaria cinza', '#9aa0a6'],
  ['79', 'green plasticaria preto', '#2b2b2b'],
  ['80', 'green plasticaria mix', ''],
  ['99', 'cor especial', ''],
]

export const CORES_BB: CorBB[] = BASE.map(([codigo, nome, hex]) => ({
  codigo,
  nome,
  hex,
  grupo: grupoPorCodigo(codigo),
}))

// Normaliza nome para casar entradas antigas (texto livre) com a tabela mestra:
// minusculo, sem acento, espacos colapsados.
export function normalizarNome(nome: string): string {
  return (nome || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

const PORNOME = new Map(CORES_BB.map((c) => [normalizarNome(c.nome), c]))
const PORCODIGO = new Map(CORES_BB.map((c) => [c.codigo, c]))

export function corPorCodigo(codigo?: string | null): CorBB | undefined {
  return codigo ? PORCODIGO.get(String(codigo).padStart(2, '0')) : undefined
}

export function corPorNome(nome?: string | null): CorBB | undefined {
  return nome ? PORNOME.get(normalizarNome(nome)) : undefined
}

// Dada uma cor ja gravada (nome e/ou codigo), descobre o codigo do CRM.
export function codigoDaCor(cor: { nome?: string | null; codigo?: string | null }): string | undefined {
  if (cor.codigo) return String(cor.codigo).padStart(2, '0')
  return corPorNome(cor.nome)?.codigo
}
