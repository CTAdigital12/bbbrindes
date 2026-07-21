import type { CollectionConfig } from 'payload'

// Cadastro de revendedor (empresa, responsavel, CNPJ, endereco de entrega,
// notas). Somente o modelo de dados; a autenticacao e o login vem na S03-03
// (quando esta colecao vira auth). Guarda PII (LGPD): sem leitura publica, so
// no painel admin (acesso padrao restrito). Nao logar dados completos.
export const Revendedores: CollectionConfig = {
  slug: 'revendedores',
  labels: { singular: 'Revendedor', plural: 'Revendedores' },
  admin: {
    useAsTitle: 'empresa',
    group: 'Revenda',
    defaultColumns: ['empresa', 'responsavel', 'cnpj'],
  },
  fields: [
    { name: 'empresa', type: 'text', required: true },
    { name: 'responsavel', type: 'text' },
    { name: 'cnpj', type: 'text' },
    { name: 'telefone', type: 'text' },
    { name: 'email', type: 'email' },
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
