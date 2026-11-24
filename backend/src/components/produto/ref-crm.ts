// refCrm: montagem e decode do codigo CIGAM + base(2) + acessorio(2), SEM hifen.
// Modulo puro e isolado (sem dependencias), pensado para ser testavel e reusado
// no CodigosPorCorView (admin, read-only) e no enriquecimento do orcamento. A
// fiacao nesses lugares e outra track; aqui so mora a logica.
//
// Formato novo: `${cigam}${base}${acessorio}`, cada codigo com 2 digitos.
// Ex: Squeeze 300 garrafa preto(02) + tampa creme(07), CIGAM MV01109 -> MV011090207.
//
// PEGADINHA 1: o hifen NAO e "so apagar". O formato velho era `${cigam}-${cor}`
//   (CIGAM + hifen + UM codigo de 2 digitos, ex. MV01444-02). O formato novo tem
//   4 digitos pos-CIGAM. Apagar o hifen de MV01444-02 daria MV0144402 (errado:
//   falta o "00" do acessorio). Cor unica = base + "00". Ex. MV01444 base 02 sem
//   acessorio -> MV014440200, NUNCA MV0144402.
//
// PEGADINHA 2: o CIGAM tem tamanho VARIAVEL. Nunca assumir 7 caracteres. Exemplos
//   reais: MV01109 (7), MV02109G (8), MV02109GC (9). Por isso o decode nao fatia
//   por posicao fixa: os 4 ULTIMOS digitos sao base(2)+acessorio(2) e o CIGAM e
//   todo o resto (cod.slice(0, -4)).

/**
 * Monta o refCrm no formato novo (CIGAM + base + acessorio, sem hifen).
 * - base e acessorio sao normalizados para 2 digitos (padStart com '0').
 * - acessorio ausente / "nao preencher" vira "00" (cor unica).
 * - base "00" (ou vazia) = incompleto: nao emite ref (retorna null).
 * - cigam vazio = sem como montar (retorna null).
 */
export function montarRefCrm(
  cigam: string,
  base?: string | null,
  acessorio?: string | null,
): string | null {
  if (!cigam) return null
  const b = (base ?? '').padStart(2, '0')
  const a = acessorio ? acessorio.padStart(2, '0') : '00' // acessorio ausente/nao-preencher = 00
  if (b === '00') return null // base sem codigo = incompleto, nao emite ref
  return `${cigam}${b}${a}`
}

/**
 * Decodifica um refCrm ja pronto de volta em { cigam, base, acessorio }.
 * Os 4 ULTIMOS digitos sao base(2) + acessorio(2); o CIGAM e todo o resto.
 * Funciona com CIGAM de tamanho variavel (ex. MV02109GC0252).
 * Retorna null se o codigo tiver menos de 5 chars ou nao casar o shape minimo
 * (CIGAM nao-vazio + 4 digitos finais).
 */
export function decodeRefCrm(
  cod: string,
): { cigam: string; base: string; acessorio: string } | null {
  if (!cod || cod.length < 5) return null
  const cigam = cod.slice(0, -4)
  const base = cod.slice(-4, -2)
  const acessorio = cod.slice(-2)
  // shape minimo: CIGAM presente e os 4 ultimos sao mesmo digitos.
  if (!cigam) return null
  if (!/^\d{2}$/.test(base) || !/^\d{2}$/.test(acessorio)) return null
  return { cigam, base, acessorio }
}
