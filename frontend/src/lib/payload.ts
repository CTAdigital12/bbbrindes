// Acesso a REST API do Payload para o front (S03-04). O site e export estatico:
// estes fetches rodam no BUILD (SSG). Sem revalidacao ao vivo por enquanto (o
// modo ISR fica para o S03-08, junto da migracao de hosting). Toda leitura tem
// timeout curto e quem chama trata a falha caindo no mock, para o build nao
// travar nem quebrar quando o backend nao estiver acessivel (ex.: CI do Pages).

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

type FindParams = {
  limit?: number;
  sort?: string;
  depth?: number;
};

// Lista documentos de uma colecao publica. Lanca em erro de rede, timeout ou
// status != 2xx; retorna o array `docs` (pode vir vazio). Quem chama decide o
// fallback.
export async function payloadFind<T = Record<string, unknown>>(
  collection: string,
  { limit = 100, sort, depth = 0 }: FindParams = {},
): Promise<T[]> {
  const qs = new URLSearchParams({ limit: String(limit), depth: String(depth) });
  if (sort) qs.set("sort", sort);

  // Timeout para o build nao pendurar se o backend estiver lento/fora do ar.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${BACKEND}/api/${collection}?${qs.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Payload ${collection} respondeu ${res.status}`);
    const data = (await res.json()) as { docs?: T[] };
    return data.docs ?? [];
  } finally {
    clearTimeout(timeout);
  }
}

// Normaliza data do Payload (ISO com hora, ex.: 2026-04-12T00:00:00.000Z) para
// o formato date-only (2026-04-12) que a UI do wireframe ja espera.
export function toDateOnly(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 10) : "";
}

// Extrai texto puro de um campo richText (lexical) do Payload. O wireframe
// renderiza o conteudo do post como texto simples; a formatacao rica fica para
// quando a PDP/blog ganharem render de richText de verdade.
type LexicalNode = {
  text?: string;
  type?: string;
  children?: LexicalNode[];
};

export function lexicalToPlainText(rich: unknown): string {
  const root = (rich as { root?: LexicalNode } | null)?.root;
  if (!root?.children) return "";

  const paragrafos: string[] = [];
  for (const bloco of root.children) {
    paragrafos.push(coletarTexto(bloco).trim());
  }
  return paragrafos.filter(Boolean).join("\n\n");
}

function coletarTexto(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  if (!node.children) return "";
  return node.children.map(coletarTexto).join("");
}
