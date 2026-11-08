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
    components: { views: {
      edit: { root: { Component: '/admin/institucional/InstitucionalEditView' } },
    } },
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
        {
          name: 'fotoFabrica',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Foto de destaque da fabrica (topo do bloco). Vazio = usa a imagem padrao do site.' },
        },
        {
          name: 'galeria',
          type: 'array',
          label: 'Galeria de fotos',
          admin: { description: 'Fotos da fabrica/producao na faixa deslizante. Vazio = usa as fotos padrao do site.' },
          fields: [
            { name: 'imagem', type: 'upload', relationTo: 'media', required: true },
            { name: 'legenda', type: 'text' },
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
    {
      name: 'linhaDoTempo',
      type: 'array',
      label: 'Linha do tempo',
      admin: {
        description:
          'Marcos da historia do Grupo BB. Aparece completa no Quem somos e, nos itens marcados "Destaque no resumo", no teaser da pagina de produto.',
      },
      defaultValue: [
        {
          ano: '2000',
          titulo: 'Como tudo começou',
          texto:
            'A trajetória do Grupo BB nasceu de uma decisão corajosa. Em Curitiba, no ano 2000, Plínio Bevervanso transformou a compra da flauta de formatura em capital inicial, alugando uma pequena sala de 30 m² por três meses. Um pequeno passo que deu início a uma grande história de sucesso empresarial.',
          destaqueResumo: false,
        },
        { ano: '2001', titulo: 'BB Business', texto: 'A partir de uma parceria especial na sala de aula do curso de administração, nasce a BB Business.', destaqueResumo: true },
        { ano: '2002', titulo: 'Ecossistema Grupo BB', texto: 'O Ecossistema Grupo BB é desenhado e os primeiros funcionários começam a assumir os desafios do empreendimento.', destaqueResumo: false },
        { ano: '2003', titulo: 'Primeira expansão', texto: 'Com crescimento contínuo e busca por inovação e pioneirismo, o Grupo BB conclui sua primeira fase de expansão.', destaqueResumo: false },
        { ano: '2004', titulo: 'Atuação nacional', texto: 'A nova sede e a expansão dos negócios marcam o início da atuação nacional do Grupo, com equipe comercial presente em 9 estados.', destaqueResumo: true },
        { ano: '2006', titulo: 'Expansão internacional', texto: 'Parcerias de negócios para importação de produtos, insumos e equipamentos industriais.', destaqueResumo: false },
        { ano: '2007', titulo: 'Fábrica na Bahia', texto: 'Instalação da unidade na Bahia, consolidando a mudança de portfólio e a produção própria no mercado promocional.', destaqueResumo: true },
        { ano: '2010', titulo: 'Liga da Esperança', texto: 'O Grupo BB cria o projeto social Liga da Esperança para ampliar a empregabilidade, incentivar o desenvolvimento acadêmico e fortalecer a integração comunitária.', destaqueResumo: false },
        { ano: '2012', titulo: 'Primeiro copo ecossustentável', texto: 'Com parceiros de ensino e pesquisa, lança o primeiro copo ecossustentável do Brasil e consolida a construção da Linha Green.', destaqueResumo: true },
        { ano: '2015', titulo: 'Reconhecimento nos EUA', texto: 'O Grupo BB avança na internacionalização em feiras globais e é reconhecido no Going Green Design Point pela Linha Green.', destaqueResumo: false },
        { ano: '2022', titulo: 'Plasticaria', texto: 'Lança a startup cleantech Plasticaria, com a Lowtech, focada em educação ambiental, economia circular e mobiliário de plástico reciclado.', destaqueResumo: true },
        { ano: '2024', titulo: 'BB Store', texto: 'O Grupo lança a BB Store, com e-commerce e presença em marketplaces para atuar em utilidades, giftware e licensing.', destaqueResumo: false },
        { ano: '2026', titulo: 'BB Plastics', texto: 'A BB Plastics amplia sua capacidade produtiva e fortalece a atuação em eletrodomésticos, cosméticos e automotivo.', destaqueResumo: true },
      ],
      fields: [
        { name: 'ano', type: 'text', required: true },
        { name: 'titulo', type: 'text', required: true },
        { name: 'texto', type: 'textarea', required: true },
        { name: 'destaqueResumo', type: 'checkbox', label: 'Destaque no resumo (teaser do produto)', defaultValue: false },
      ],
    },
  ],
}
