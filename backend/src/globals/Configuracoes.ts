import type { GlobalConfig } from 'payload'

// Configuracoes gerais do site (singleton). Reune o que hoje esta hardcoded no
// front (Header, Footer, pagina de Contato): dados de contato, redes sociais,
// selos de certificacao e o texto institucional do rodape. Editavel pelo cliente
// no admin (FB-6). O front le via getConfig() (lib/content.ts), com fallback no
// mock enquanto o global nao estiver preenchido.
export const Configuracoes: GlobalConfig = {
  slug: 'configuracoes',
  label: 'Configuracoes do site',
  admin: {
    group: 'Sistema',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contato',
      type: 'group',
      label: 'Contato',
      fields: [
        {
          name: 'telefone',
          type: 'text',
          label: 'Telefone (exibicao)',
          admin: { description: 'Como aparece no site, ex.: (71) 99416-0138.' },
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp (so numeros, com DDI)',
          admin: { description: 'Ex.: 5571994160138. Vira o link wa.me do site.' },
        },
        { name: 'email', type: 'text', label: 'E-mail comercial' },
        { name: 'endereco', type: 'text', label: 'Endereco / cidade' },
        { name: 'horario', type: 'text', label: 'Horario de atendimento' },
        { name: 'cnpj', type: 'text', label: 'CNPJ' },
      ],
    },
    {
      name: 'redes',
      type: 'group',
      label: 'Redes sociais',
      admin: { description: 'Deixe em branco para esconder o icone no site.' },
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram (URL)' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn (URL)' },
        { name: 'facebook', type: 'text', label: 'Facebook (URL)' },
        { name: 'pinterest', type: 'text', label: 'Pinterest (URL)' },
        { name: 'youtube', type: 'text', label: 'YouTube (URL)' },
      ],
    },
    {
      name: 'descricao',
      type: 'textarea',
      label: 'Descricao da empresa (rodape)',
    },
    {
      name: 'selos',
      type: 'array',
      label: 'Selos / certificacoes',
      labels: { singular: 'Selo', plural: 'Selos' },
      admin: { description: 'Ex.: SGP, GMP, NM300. Aparecem no rodape.' },
      fields: [{ name: 'nome', type: 'text', required: true }],
    },
  ],
}
