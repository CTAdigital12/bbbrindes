import { mediaID, type MediaRef } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { InstGaleria, InstMarco, InstMotivo, InstNumero, InstQuemSomos, InstSac, InstSelo, InstSustentabilidade, InstitucionalContent, InstitucionalIssue } from './institucional-model'
const imgId = (ref: MediaRef | undefined) => mediaID(ref) ?? null
const keepId = (row: { id?: string }) => (row.id ? { id: row.id } : {})
const numero = (n: InstNumero) => ({ ...keepId(n), valor: n.valor ?? '', rotulo: n.rotulo ?? '' })
const sustent = (s: InstSustentabilidade) => ({ ...keepId(s), icone: s.icone ?? '', titulo: s.titulo ?? '' })
const selo = (s: InstSelo) => ({ ...keepId(s), sigla: s.sigla ?? '', desc: s.desc ?? '' })
const foto = (g: InstGaleria) => ({ ...keepId(g), imagem: imgId(g.imagem), legenda: g.legenda ?? '' })
const motivo = (m: InstMotivo) => ({ ...keepId(m), texto: m.texto ?? '' })
const marco = (m: InstMarco) => ({ ...keepId(m), ano: m.ano ?? '', titulo: m.titulo ?? '', texto: m.texto ?? '', destaqueResumo: Boolean(m.destaqueResumo) })
function quemSomosBody(g: InstQuemSomos = {}) {
  return {
    eyebrow: g.eyebrow ?? '', titulo: g.titulo ?? '', paragrafo1: g.paragrafo1 ?? '', paragrafo2: g.paragrafo2 ?? '',
    numeros: (g.numeros ?? []).map(numero),
    sustentabilidade: (g.sustentabilidade ?? []).map(sustent),
    selos: (g.selos ?? []).map(selo),
    fotoFabrica: imgId(g.fotoFabrica),
    galeria: (g.galeria ?? []).map(foto),
  }
}
function sacBody(g: InstSac = {}) {
  return { titulo: g.titulo ?? '', texto: g.texto ?? '', motivos: (g.motivos ?? []).map(motivo) }
}
// Corpo do update do global: manda os TRES blocos (quemSomos, sac, linhaDoTempo)
// com o estado completo carregado, para a atualizacao nunca apagar um bloco que esta
// tela nao esta editando naquele momento. Mantem os ids das linhas dos arrays e
// troca as imagens (fotoFabrica e cada foto da galeria) pelo id da Media.
export function institucionalBody(content: InstitucionalContent): Record<string, unknown> {
  return {
    quemSomos: quemSomosBody(content.quemSomos),
    sac: sacBody(content.sac),
    linhaDoTempo: (content.linhaDoTempo ?? []).map(marco),
  }
}
// Valida os campos obrigatorios do schema (valor/rotulo dos numeros, icone/titulo da
// sustentabilidade, sigla/desc dos selos, imagem da galeria, texto dos motivos e
// ano/titulo/texto da linha do tempo). Mensagem amigavel em portugues.
export function validateInstitucional(content: InstitucionalContent): InstitucionalIssue | undefined {
  const qs = content.quemSomos ?? {}
  if ((qs.numeros ?? []).some(n => !n.valor?.trim() || !n.rotulo?.trim())) return { message: 'Em Quem somos, preencha o valor e o rotulo de todos os numeros.' }
  if ((qs.sustentabilidade ?? []).some(s => !s.icone?.trim() || !s.titulo?.trim())) return { message: 'Em Sustentabilidade, preencha o icone e o titulo de todos os itens.' }
  if ((qs.selos ?? []).some(s => !s.sigla?.trim() || !s.desc?.trim())) return { message: 'Em Certificacoes, preencha a sigla e a descricao de todos os itens.' }
  if ((qs.galeria ?? []).some(g => !mediaID(g.imagem))) return { message: 'Na Galeria de fotos, escolha uma imagem para cada item (ou remova o item vazio).' }
  if ((content.sac?.motivos ?? []).some(m => !m.texto?.trim())) return { message: 'No SAC, preencha o texto de todos os motivos de contato.' }
  if ((content.linhaDoTempo ?? []).some(m => !m.ano?.trim() || !m.titulo?.trim() || !m.texto?.trim())) return { message: 'Na Linha do tempo, preencha o ano, o titulo e o texto de todos os marcos.' }
  return undefined
}
export function institucionalSaveIssue(cause: unknown): InstitucionalIssue {
  if (cause instanceof RequestError && cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  return { message: cause instanceof Error ? cause.message : 'Nao foi possivel salvar. Tente novamente.' }
}
