// Tipos do global `configuracoes` (FB-6). Espelham Configuracoes.ts e o leitor do
// front (content.ts getConfig + types.ts SiteConfig). Tudo opcional: um campo
// vazio nao quebra, o front cai no mock por campo. selos e array de { nome }.
export type ConfigContato = { telefone?: string; whatsapp?: string; email?: string; endereco?: string; horario?: string; cnpj?: string }
export type ConfigRedes = { instagram?: string; linkedin?: string; facebook?: string; pinterest?: string; youtube?: string }
export type ConfigSelo = { id?: string; nome?: string }
export type ConfigContent = {
  contato?: ConfigContato
  redes?: ConfigRedes
  descricao?: string
  selos?: ConfigSelo[]
}
export const CONFIG_PATH = '/admin/globals/configuracoes'
// Redes sociais na ordem do rodape do site (Footer.tsx). Rotulo amigavel para o
// editor e a previa; a chave bate com o campo do schema (redes.<chave>).
export const REDE_FIELDS: [key: keyof ConfigRedes, label: string][] = [
  ['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['facebook', 'Facebook'],
  ['pinterest', 'Pinterest'], ['youtube', 'YouTube'],
]
// Campos de contato na ordem em que a tela os agrupa.
export const CONTATO_FIELDS: [key: keyof ConfigContato, label: string, placeholder: string][] = [
  ['telefone', 'Telefone (exibição)', '(71) 99416-0138'],
  ['whatsapp', 'WhatsApp (só números, com DDI)', '5571994160138'],
  ['email', 'E-mail comercial', 'comercial@bbgrupo.com.br'],
  ['endereco', 'Endereço / cidade', 'Lauro de Freitas / BA'],
  ['horario', 'Horário de atendimento', 'Seg a sex, 8h às 18h'],
  ['cnpj', 'CNPJ', '11.158.637/0001-27'],
]
