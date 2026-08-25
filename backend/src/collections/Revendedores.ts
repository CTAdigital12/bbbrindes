import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { APIError } from 'payload'

// Revendedor: colecao de AUTH (S03-03). Acesso UNICO por empresa, sem
// sub-usuarios na v1 (golden path secao 2). O login real do portal usa esta
// colecao; o painel /admin continua sendo so dos Users (admin.user no config),
// entao um revendedor autentica pela API mas nunca entra no /admin.
//
// PII (LGPD, CLAUDE.md regra 15): sem leitura publica. Admin le tudo; o
// revendedor logado le SOMENTE o proprio registro. Nao logar dados completos.
//
// Regra critica (golden path secao 3.2): aprovar e atribuir tabela sao o MESMO
// passo. Um revendedor nunca pode ficar `ativo` sem `nivel` (1 a 4), senao
// entra vendo preco errado ou nenhum. A validacao do campo `ativo` garante
// isso no create e no update.

// Admin = usuario da colecao `users`. req.user.collection existe no servidor
// (confirmado em payload/auth/types) e distingue admin de revendedor.
const isAdmin = (user: { collection?: string } | null | undefined): boolean =>
  user?.collection === 'users'

const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

// Leitura: admin ve tudo; revendedor logado ve so o proprio doc; publico nada.
const readOwnOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return { id: { equals: user.id } }
}

// Campos de controle (nivel, ativo) so o admin altera; o revendedor nunca
// muda a propria tabela de preco.
const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user)

export const Revendedores: CollectionConfig = {
  slug: 'revendedores',
  labels: { singular: 'Revendedor', plural: 'Revendedores' },
  auth: {
    // Recuperacao de senha basica (S03-03). O e-mail transacional real entra
    // com o provedor (S03-09); ate la o Payload usa o transporte configurado.
    forgotPassword: {},
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 min
  },
  admin: {
    useAsTitle: 'empresa',
    group: 'Revenda',
    defaultColumns: ['empresa', 'cnpj', 'nivel', 'ativo'],
  },
  access: {
    // So o admin cria (a solicitacao publica vai para o Leads2b, nao cria
    // conta direto), le tudo, edita e remove. O revendedor le so o proprio.
    create: adminOnly,
    read: readOwnOrAdmin,
    update: adminOnly,
    delete: adminOnly,
    // Nenhum revendedor acessa o painel /admin (reforco explicito; o
    // admin.user do config ja e a colecao users).
    admin: ({ req: { user } }) => isAdmin(user),
  },
  hooks: {
    // Bloqueio server-side: revendedor so loga se estiver aprovado (ativo).
    // Credencial valida mas conta inativa nao gera sessao. O cliente tambem
    // checa, mas a garantia mora aqui.
    beforeLogin: [
      ({ user }) => {
        if (!user?.ativo) {
          throw new APIError(
            'Cadastro em analise. O acesso e liberado apos a aprovacao.',
            403,
          )
        }
      },
    ],
  },
  fields: [
    // Email e senha vem do auth (login unico por empresa via e-mail).
    { name: 'empresa', label: 'Razao social', type: 'text', required: true },
    { name: 'nomeFantasia', label: 'Nome fantasia', type: 'text' },
    // CNPJ unico reforca "acesso unico por empresa".
    { name: 'cnpj', type: 'text', unique: true, index: true },
    { name: 'inscricaoEstadual', label: 'Inscricao estadual', type: 'text' },
    { name: 'responsavel', type: 'text' },
    { name: 'telefone', type: 'text' },
    { name: 'whatsapp', type: 'text' },
    { name: 'site', type: 'text' },
    {
      // Nivel define qual das 4 tabelas de preco o revendedor enxerga.
      name: 'nivel',
      label: 'Nivel (tabela de preco)',
      type: 'select',
      access: { update: adminFieldOnly, create: adminFieldOnly },
      options: [
        { label: 'Tabela 1', value: '1' },
        { label: 'Tabela 2', value: '2' },
        { label: 'Tabela 3', value: '3' },
        { label: 'Tabela 4', value: '4' },
      ],
      admin: {
        description:
          'Obrigatorio para ativar. Define a tabela de preco que o revendedor ve.',
      },
    },
    {
      // Aprovacao. Nao pode ficar ativo sem nivel (aprovar = atribuir tabela).
      name: 'ativo',
      label: 'Ativo (acesso liberado)',
      type: 'checkbox',
      defaultValue: false,
      access: { update: adminFieldOnly, create: adminFieldOnly },
      validate: (value: unknown, { siblingData }: { siblingData?: { nivel?: unknown } }) => {
        if (value === true && !siblingData?.nivel) {
          return 'Para ativar o revendedor, atribua o nivel/tabela de preco no mesmo passo.'
        }
        return true
      },
      admin: {
        description:
          'Aprovar e atribuir a tabela sao o mesmo passo: nao da para ativar sem nivel.',
      },
    },
    {
      name: 'enderecoEntrega',
      type: 'group',
      label: 'Endereco de entrega',
      fields: [
        { name: 'logradouro', type: 'text' },
        { name: 'bairro', type: 'text' },
        { name: 'cidade', type: 'text' },
        { name: 'uf', type: 'text', maxLength: 2 },
        { name: 'cep', type: 'text' },
      ],
    },
    { name: 'notas', type: 'textarea' },
  ],
}
