import { describe, it, expect } from 'vitest'
import { homeBody, homeSaveIssue, validateHome } from '../../src/admin/home/home-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { HomeContent } from '../../src/admin/home/home-model'
const base: HomeContent = {
  selosConfianca: [{ id: 's1', icone: 'package', titulo: 'A partir de 500', sub: 'Volume nacional' }],
  diferenciais: [{ id: 'd1', icone: 'entrega-garantida', titulo: 'Entrega', sub: 'Prazo combinado' }],
  depoimentos: [{ id: 'q1', texto: 'Ótimo', autor: 'Cliente' }],
  faq: [{ id: 'f1', pergunta: 'Mínimo?', resposta: '500 unidades' }],
  urgencia: { chip: 'Agenda', tituloInicio: 'Dezembro tem prazo.', tituloDestaque: 'A produção também.', texto: 'Feche cedo.', ctaLabel: 'Garantir', ctaHref: '/campanha/natal', imagem: { id: 70, url: 'https://m.test/70.webp' } },
  ecoBanner: { eyebrow: 'Green', titulo: 'Eco', texto: 'Menos impacto', ctaLabel: 'Ver', imagem: 71 },
  ecoLead: { eyebrow: 'Eco', titulo: 'Duram', texto: 'Fibras', linhas: [{ texto: 'Premium' }], ctaLabel: 'Ver', imagem: null },
  ctaFinal: { titulo: 'Monte seu orçamento', texto: 'Sem pagamento', ctaLabel: 'Começar', ctaHref: '/catalogo' },
}
describe('gravacao do conteudo da home', () => {
  it('manda todos os blocos (nenhum bloco some)', () => {
    const body = homeBody(base)
    for (const key of ['selosConfianca', 'diferenciais', 'depoimentos', 'faq', 'urgencia', 'ecoBanner', 'ecoLead', 'ctaFinal']) {
      expect(body).toHaveProperty(key)
    }
  })
  it('troca a imagem de grupo pelo id da Media (objeto, numero ou null)', () => {
    const body = homeBody(base) as Record<string, { imagem?: unknown }>
    expect(body.urgencia.imagem).toBe(70)
    expect(body.ecoBanner.imagem).toBe(71)
    expect(body.ecoLead.imagem).toBe(null)
  })
  it('preserva os ids das linhas dos arrays', () => {
    const body = homeBody(base) as Record<string, { id?: string }[]>
    expect(body.selosConfianca[0].id).toBe('s1')
    expect(body.faq[0].id).toBe('f1')
  })
  it('preserva as linhas do bloco eco lead', () => {
    const body = homeBody(base) as { ecoLead: { linhas: { texto: string }[] } }
    expect(body.ecoLead.linhas).toEqual([{ texto: 'Premium' }])
  })
})
describe('validacao do conteudo da home', () => {
  it('aceita um conteudo completo', () => { expect(validateHome(base)).toBeUndefined() })
  it('cobra icone e titulo dos selos e diferenciais', () => {
    expect(validateHome({ ...base, selosConfianca: [{ icone: '', titulo: 'x' }] })?.message).toMatch(/Selos/)
    expect(validateHome({ ...base, diferenciais: [{ icone: 'x', titulo: '' }] })?.message).toMatch(/Diferenciais/)
  })
  it('cobra texto/autor dos depoimentos e pergunta/resposta do FAQ', () => {
    expect(validateHome({ ...base, depoimentos: [{ texto: 'x', autor: '' }] })?.message).toMatch(/Depoimentos/)
    expect(validateHome({ ...base, faq: [{ pergunta: '', resposta: 'x' }] })?.message).toMatch(/FAQ/)
  })
})
describe('erro de servidor', () => {
  it('vira mensagem amigavel', () => {
    const issue = homeSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'selosConfianca', message: 'y' }] } }] }))
    expect(issue.message).toMatch(/Confira/)
  })
})
