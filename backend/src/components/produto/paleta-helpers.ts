// Helpers PUROS da paleta de cores (secao 2.3 da spec feature-cores-base-acessorio).
//
// Diferenca para os helpers de cores-bb.ts: aqui eles operam sobre uma lista RECEBIDA
// (PaletaCor[] vinda de getPaleta/REST), nao sobre a constante interna. Isso permite que
// os consumidores migrem da constante hardcoded para o dado da collection sem reescrever
// a logica de busca. cores-bb.ts segue intacto como seed+fallback; estes sao os helpers
// que os consumidores vao passar a usar em OUTRA track.

import type { PaletaCor } from './paleta-loader'

// Normaliza nome para casar entradas antigas (texto livre) com a paleta: minusculo, sem
// acento, espacos colapsados. Mesma regra de cores-bb.ts#normalizarNome.
export function normalizarNome(s?: string | null): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

// Grupo derivado pela FAIXA do codigo. Puro, nao depende de lista. Mesma logica do
// grupoPorCodigo (privado) de cores-bb.ts: vira sugestao de default ao cadastrar uma cor.
export function grupoPorCodigo(codigo?: string | null): string {
  const n = Number(codigo)
  if (n >= 30 && n <= 38) return 'Cristal'
  if (n >= 50 && n <= 57) return 'Green Fibras'
  if (n >= 70 && n <= 80) return 'Green Plasticaria'
  if (n === 99) return 'Especial'
  return 'Padrao'
}

// codigo -> cor, na lista recebida. Normaliza para 2 digitos (padStart) como cores-bb.ts.
export function corPorCodigo(lista: PaletaCor[], codigo?: string | null): PaletaCor | undefined {
  if (!codigo) return undefined
  const alvo = String(codigo).padStart(2, '0')
  return lista.find((c) => c.codigo === alvo)
}

// nome -> cor, na lista recebida (casa por nome normalizado).
export function corPorNome(lista: PaletaCor[], nome?: string | null): PaletaCor | undefined {
  if (!nome) return undefined
  const alvo = normalizarNome(nome)
  return lista.find((c) => normalizarNome(c.nome) === alvo)
}

// nome -> codigo do CRM, na lista recebida. Devolve o codigo da cor cujo nome casa.
export function codigoDaCor(lista: PaletaCor[], nome?: string | null): string | undefined {
  return corPorNome(lista, nome)?.codigo
}
