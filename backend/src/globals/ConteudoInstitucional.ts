import type { GlobalConfig } from 'payload'

import { rebuildGlobalAfterChange } from '../hooks/triggerDeploy'

// Global "Conteudo institucional" (FB-6, Fase 6). Torna editavel no /admin a copy
// das paginas institucionais hoje hardcoded no front: Quem somos (intro, numeros,
// sustentabilidade, selos) e SAC (intro + motivos). Nasce preenchido via
// `defaultValue` (com acentos, igual ao site), sem seed. O front le com fallback no
// mock. Escopo = texto; as fotos da galeria do quem-somos e a linha do tempo seguem
// no front por ora (viram fatia de midia depois).

export const ConteudoInstitucional: GlobalConfig = {
  slug: 'conteudo-institucional',
  label: 'Conteudo institucional',
  admin: {
    group: 'Conteudo',
    description:
      'Textos das paginas Quem somos e SAC. Em sustentabilidade, o icone usa o arquivo sustentabilidade-<icone>.svg em /img/icones.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [rebuildGlobalAfterChange],
  },
  fields: [
    {
      name: 'quemSomos',
      type: 'group',
      label: 'Quem somos',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Quem somos' },
        { name: 'titulo', type: 'text', defaultValue: 'Somos fábrica, não revenda.' },
        {
          name: 'paragrafo1',
          type: 'textarea',
          defaultValue:
            'A BB Brindes, empresa do Grupo BB, é uma indústria brasileira de brindes corporativos. Produção própria, escala nacional e atendimento comercial direto.',
        },
        {
          name: 'paragrafo2',
          type: 'textarea',
          defaultValue:
            'Atendemos empresas e revendedores em todo o país, com catálogo amplo, personalização da sua marca e compromisso com prazo e qualidade.',
        },
        {
          name: 'numeros',
          type: 'array',
          label: 'Números (faixa de 4)',
          defaultValue: [
            { valor: '27 anos', rotulo: 'de mercado' },
            { valor: '500 un.', rotulo: 'pedido mínimo' },
            { valor: '100%', rotulo: 'produção nacional' },
            { valor: '5', rotulo: 'certificações de qualidade' },
          ],
          fields: [
            { name: 'valor', type: 'text', required: true },
            { name: 'rotulo', type: 'text', required: true },
          ],
        },
        {
          name: 'sustentabilidade',
          type: 'array',
          label: 'Sustentabilidade',
          admin: { description: 'Icone = slug do arquivo sustentabilidade-<icone>.svg.' },
          defaultValue: [
            { icone: 'livres-de-bpa-e-reciclados', titulo: 'Produtos livres de BPA e materiais reciclados' },
            { icone: 'menos-plastico-virgem', titulo: 'Redução de plástico virgem na linha ecológica' },
            { icone: 'controle-de-qualidade', titulo: 'Produção própria com controle de qualidade' },
          ],
          fields: [
            { name: 'icone', type: 'text', required: true },
            { name: 'titulo', type: 'text', required: true },
          ],
        },
        {
          name: 'selos',
          type: 'array',
          label: 'Certificações',
          admin: { description: 'A primeira ocupa a linha inteira em destaque no site.' },
          defaultValue: [
            { sigla: 'SMETA 4 Pilares', desc: 'Trabalho, saúde e segurança, meio ambiente e ética' },
            { sigla: 'NBR NM 300', desc: 'Segurança de brinquedos (Inmetro)' },
            { sigla: 'SGP', desc: 'Auditoria de fornecedor' },
            { sigla: 'PS&C', desc: 'Auditoria de fornecedor' },
            { sigla: 'GMP', desc: 'Boas práticas de fabricação' },
          ],
          fields: [
            { name: 'sigla', type: 'text', required: true },
            { name: 'desc', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'sac',
      type: 'group',
      label: 'SAC',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'SAC BB Brindes' },
        {
          name: 'texto',
          type: 'textarea',
          defaultValue:
            'Conta o que aconteceu. Selecione o motivo abaixo para que a sua mensagem chegue direto na pessoa certa. Retornamos em até 24 horas úteis.',
        },
        {
          name: 'motivos',
          type: 'array',
          label: 'Motivos de contato',
          defaultValue: [
            { texto: 'Status do pedido' },
            { texto: 'Problema com produto' },
            { texto: 'Divergência de quantidade ou item' },
            { texto: 'Prazo de entrega' },
            { texto: 'Nota fiscal e documentos' },
            { texto: 'Aprovação de arte' },
            { texto: 'Elogio' },
            { texto: 'Outro' },
          ],
          fields: [{ name: 'texto', type: 'text', required: true }],
        },
      ],
    },
  ],
}
