import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '../access/byRole'

// Paleta mestra de cores da BB Brindes, agora como COLLECTION editavel (item 5 da
// task 9910008, secao 2 da spec feature-cores-base-acessorio). Antes a paleta era a
// constante CORES_BB em components/produto/cores-bb.ts; agora o cliente edita aqui.
//
// IMPORTANTE (fundacao, nao mexe nos consumidores ainda):
// - components/produto/cores-bb.ts CONTINUA existindo como fonte do seed e FALLBACK
//   do loader (o build nao pode quebrar com a collection vazia). Os 5 consumidores
//   (Produtos.ts select, PaletaCores, CodigosPorCorView, UploadLoteProdutos e o
//   enriquecimento do orcamento) seguem lendo a constante ate serem migrados em
//   OUTRA track.
// - Leitura e via Local API (getPaleta em components/produto/paleta-loader.ts) no
//   server e via REST padrao GET /api/cores-bb?limit=0&depth=0 nos client components.
//
// Codigos reservados (NAO sao cor cadastravel comum, por convencao da spec secao 2.4):
//   `00` = "nao preencher" (bloco sem cor, nao e cor de paleta).
//   `99` = cor especial (nome editado a mao no produto).
// A validacao do campo `codigo` aceita 2 digitos quaisquer (inclui 00/99); a reserva
// e convencao de uso, nao trava de schema.
export const CoresBB: CollectionConfig = {
  slug: 'cores-bb',
  labels: { singular: 'Cor (paleta)', plural: 'Paleta de cores' },
  admin: {
    group: 'Catalogo',
    useAsTitle: 'nome',
    defaultColumns: ['codigo', 'nome', 'grupo', 'hex'],
    description:
      'Paleta mestra de cores (tabela codigo -> nome do CRM/Leads2b). O hex e so a bolinha do seletor; o site resolve o tom pelo nome.',
  },
  // Leitura publica (o site e a friendly view leem a paleta); escrita so editor/admin.
  // Espelha a regra de access de collections/Produtos.ts.
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'codigo',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Codigo da cor (CRM)',
      admin: {
        description: 'Dois digitos, ex. 02. Chave da tabela mestra do CRM/Leads2b. 00 e 99 sao reservados.',
      },
      validate: (value: unknown) => /^\d{2}$/.test(String(value ?? '')) || 'Codigo deve ter 2 digitos (ex. 02).',
    },
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome da cor',
    },
    {
      name: 'hex',
      type: 'text',
      label: 'Hex (bolinha do seletor)',
      admin: {
        description: 'Cor em #rrggbb para a bolinha do seletor (opcional). Vazio = render especial/auto.',
      },
      validate: (value: unknown) =>
        !value ? true : /^#[0-9a-f]{6}$/i.test(String(value)) || 'Use #rrggbb (ex. #1a2b3c) ou deixe vazio.',
    },
    {
      name: 'grupo',
      type: 'select',
      required: true,
      label: 'Grupo',
      options: ['Padrao', 'Cristal', 'Green Fibras', 'Green Plasticaria', 'Especial'],
      admin: {
        description: 'Grupo da paleta. A aba Cores secciona a paleta por grupo.',
      },
    },
  ],
}
