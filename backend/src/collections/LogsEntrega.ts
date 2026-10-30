import type { CollectionConfig } from 'payload'

// Log de entrega dos orcamentos (FB-7, PART 0). Requisito do cliente (Julien,
// docs/integracao-leads2b.md secao 3): "nao preciso ARMAZENAR, desde que tenha um
// LOG DE ENTREGA". Logo, esta collection NAO e um banco de leads: guarda so a
// auditoria de que a submissao chegou e o que aconteceu com ela, com PII MINIMA e
// MASCARADA (LGPD). O conteudo real do orcamento vai pro CRM (PART 1) ou pelo
// WhatsApp/e-mail; aqui nao fica nome, e-mail nem telefone completos.
//
// So o endpoint /api/orcamento cria registros (via Local API, que ignora o access
// `create` abaixo). O `create: () => false` bloqueia qualquer criacao pela REST
// publica (anti-spam). Leitura e exclusao so para usuario logado do admin.
export const LogsEntrega: CollectionConfig = {
  slug: 'logs-entrega',
  labels: { singular: 'Log de entrega', plural: 'Logs de entrega' },
  admin: {
    useAsTitle: 'requisicaoId',
    group: 'Sistema',
    defaultColumns: ['createdAt', 'status', 'modo', 'empresa', 'totalUnidades'],
    description:
      'Auditoria dos pedidos de orcamento enviados pelo site. modo "stub"/status "simulado" = o CRM ainda nao esta conectado (o lead chegou ao backend, mas a entrega ao comercial e pelo WhatsApp ate a integracao real ser ligada).',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'requisicaoId',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Id interno da submissao (gerado no backend).' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'simulado',
      options: [
        { label: 'Simulado (CRM nao conectado)', value: 'simulado' },
        { label: 'Entregue ao CRM', value: 'entregue' },
        { label: 'Falhou', value: 'falhou' },
        { label: 'Reenviado', value: 'reenviado' },
      ],
    },
    {
      name: 'modo',
      type: 'select',
      required: true,
      defaultValue: 'stub',
      options: [
        { label: 'Stub (sem CRM)', value: 'stub' },
        { label: 'Real (entregue via n8n)', value: 'real' },
      ],
    },
    {
      name: 'crmId',
      type: 'text',
      admin: { description: 'Id do lead no CRM, quando a entrega real (n8n) estiver ligada.' },
    },
    {
      name: 'empresa',
      type: 'text',
      admin: { description: 'Empresa informada no pedido (usada pelo comercial pra identificar).' },
    },
    {
      name: 'emailMascarado',
      type: 'text',
      admin: { description: 'E-mail parcialmente mascarado (LGPD; sem PII completa em claro).' },
    },
    {
      name: 'telefoneMascarado',
      type: 'text',
      admin: { description: 'Telefone com so os ultimos 4 digitos (LGPD).' },
    },
    {
      name: 'qtdItens',
      type: 'number',
      admin: { description: 'Quantos produtos diferentes no pedido.' },
    },
    {
      name: 'totalUnidades',
      type: 'number',
      admin: { description: 'Soma das quantidades do carrinho.' },
    },
    {
      name: 'consentimento',
      type: 'checkbox',
      admin: { description: 'Marcou o consentimento LGPD antes de enviar.' },
    },
    {
      name: 'erro',
      type: 'textarea',
      admin: { description: 'Mensagem de erro quando a entrega falhou.' },
    },
  ],
}
