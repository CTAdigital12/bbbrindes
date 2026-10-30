// Formatadores de input sem dependencia externa (o projeto evita peso no bundle
// do GitHub Pages). Por enquanto: telefone BR. A mascara reformata sempre a partir
// dos digitos, entao apagar/colar continua funcionando (nao e incremental).

export function apenasDigitos(v: string): string {
  return v.replace(/\D/g, "");
}

// Telefone BR: (00) 00000-0000 para celular (11 digitos) e (00) 0000-0000 para
// fixo (10). Aceita digitacao parcial e trava em 11 digitos. A string formatada
// tem no maximo 15 caracteres (use maxLength={15} no input).
export function mascaraTelefone(v: string): string {
  const d = apenasDigitos(v).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
