// Seed do global `configuracoes` (FB-6) com os valores que hoje estao hardcoded
// no front (Header, Footer, Contato), pra o admin ja nascer refletindo o site.
//
// Idempotente: se o global ja estiver preenchido (contato.whatsapp setado), nao
// faz nada, pra nao atropelar edicao do cliente. Use CONF_OVERWRITE=1 pra forcar.
//
// Rodar (na pasta backend/), com o schema do global ja existente no banco:
//   payload run src/scripts/seed-configuracoes.ts
// (redes sociais ja com as URLs reais do site oficial; LinkedIn vazio.)

import { getPayload } from 'payload'
import config from '@payload-config'

const OVERWRITE = process.env.CONF_OVERWRITE === '1'

const defaults = {
  contato: {
    telefone: '(71) 99416-0138',
    whatsapp: '5571994160138',
    email: 'comercial@bbgrupo.com.br',
    endereco: 'Lauro de Freitas / BA',
    horario: 'A confirmar',
    cnpj: '11.158.637/0001-27',
  },
  redes: {
    // URLs reais do site oficial (28/10); LinkedIn vazio pois o site nao tem.
    instagram: 'https://www.instagram.com/grupobbbrindes/',
    linkedin: '',
    facebook: 'https://www.facebook.com/grupobbbrindes',
    pinterest: 'https://br.pinterest.com/grupobb/',
    youtube: 'https://www.youtube.com/user/bbgrupo',
  },
  descricao:
    'BB Brindes, uma empresa Grupo BB. Indústria brasileira de brindes corporativos personalizados, com fábrica própria há 27 anos.',
  selos: [
    { nome: 'SGP' },
    { nome: 'PS&C' },
    { nome: 'GMP' },
    { nome: 'NM300' },
    { nome: 'SMETA 4 Pilares' },
  ],
}

const payload = await getPayload({ config })

try {
  const atual = await payload.findGlobal({ slug: 'configuracoes' })
  const jaPreenchido = Boolean(atual?.contato?.whatsapp)

  if (jaPreenchido && !OVERWRITE) {
    payload.logger.info(
      'Global configuracoes ja preenchido. Nada a fazer (CONF_OVERWRITE=1 para sobrescrever).',
    )
    process.exit(0)
  }

  await payload.updateGlobal({ slug: 'configuracoes', data: defaults })
  payload.logger.info('Global configuracoes seedado com os valores atuais do site.')
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de configuracoes:', err)
  process.exit(1)
}
