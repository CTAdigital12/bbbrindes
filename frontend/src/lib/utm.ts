// Captura e persistencia de UTMs (FB-6, Frente 1 do card G1). O site hoje nao
// captura nenhum UTM. Aqui a gente le os parametros utm_* da querystring de
// QUALQUER pagina de entrada, guarda no localStorage (first-party, sem terceiros)
// e, no envio do orcamento, devolve o objeto no formato combinado com o backend.
//
// Contrato com o backend: campo opcional `utm` no corpo do POST /api/orcamento,
// chaves em camelCase SEM o prefixo "utm_", todas strings opcionais:
//   utm: { source?, medium?, campaign?, term?, content? }
//   (source=utm_source, medium=utm_medium, campaign=utm_campaign,
//    term=utm_term, content=utm_content)
//
// Tudo em try/catch: localStorage falha em aba anonima ou com cookies/site data
// bloqueados. Em qualquer falha, degrada pra vazio sem quebrar o fluxo.

const STORAGE_KEY = "bbbrindes:utm";

// Mapa querystring -> chave do contrato. A ordem define as chaves conhecidas.
const MAPA: Record<string, keyof Utm> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
};

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

// Le os utm_* da querystring e, se houver algum nao-vazio, persiste no
// localStorage sobrescrevendo (last-touch nao-vazio: so grava quando a URL
// atual traz UTM, senao mantem o que ja estava). Deve rodar cedo no
// carregamento, em qualquer pagina de entrada.
export function capturarUtm(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const novo: Utm = {};
    for (const [qs, chave] of Object.entries(MAPA)) {
      const valor = params.get(qs);
      if (valor && valor.trim()) novo[chave] = valor.trim();
    }
    // Sem UTM na URL: nao mexe no que ja estava guardado.
    if (Object.keys(novo).length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
  } catch {
    // Aba anonima ou storage bloqueado: ignora sem quebrar.
  }
}

// Le os UTMs persistidos e devolve no formato do contrato (ou {} se nao houver
// nada guardado ou se o storage falhar). Filtra so as chaves conhecidas e
// descarta valores vazios, pra nao mandar lixo no POST.
export function lerUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return {};
    const dados = JSON.parse(bruto) as Record<string, unknown>;
    const saida: Utm = {};
    for (const chave of Object.values(MAPA)) {
      const valor = dados[chave];
      if (typeof valor === "string" && valor.trim()) saida[chave] = valor.trim();
    }
    return saida;
  } catch {
    return {};
  }
}
