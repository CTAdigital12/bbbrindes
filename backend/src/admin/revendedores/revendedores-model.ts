// Tipos da collection `revendedores` (portal de revenda, colecao de AUTH).
// Espelham Revendedores.ts. PII/LGPD: a lista e a previa vivem no /admin; so o
// admin logado ve tudo. A senha NUNCA volta da API, entao o draft trata
// `password` como opcional e o campo comeca sempre vazio.
export type NivelRevendedor = '1' | '2' | '3' | '4'
export type EnderecoEntrega = {
  logradouro?: string; bairro?: string; cidade?: string; uf?: string; cep?: string
}
export type RevendedorDraft = {
  id?: number
  email: string
  password?: string
  empresa: string
  nomeFantasia?: string
  cnpj?: string
  inscricaoEstadual?: string
  responsavel?: string
  telefone?: string
  whatsapp?: string
  site?: string
  nivel?: NivelRevendedor | '' | null
  ativo?: boolean | null
  enderecoEntrega?: EnderecoEntrega
  notas?: string
  updatedAt?: string
}
export type RevendedorRow = RevendedorDraft & { id: number }
export type RevendedorIssue = { message: string; field?: string }
export const REVENDEDOR_PATH = '/admin/collections/revendedores'
// Nivel = qual das 4 tabelas de preco o revendedor enxerga (value '1'..'4').
export const NIVEL_OPTIONS: { value: NivelRevendedor; label: string }[] = [
  { value: '1', label: 'Tabela 1' },
  { value: '2', label: 'Tabela 2' },
  { value: '3', label: 'Tabela 3' },
  { value: '4', label: 'Tabela 4' },
]
// Rotulo do nivel; vazio vira hifen (nunca travessao) para a previa e a lista.
export const nivelLabel = (nivel?: NivelRevendedor | '' | null): string =>
  NIVEL_OPTIONS.find(option => option.value === nivel)?.label ?? '-'
