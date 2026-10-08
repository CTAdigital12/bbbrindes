// Loader de produto (S03-02 piloto): le o produto do Payload e mapeia para o
// tipo Produto que a PDP ja usa, com fallback pro mock. Assim a PDP renderiza o
// dado real (ex.: Squeeze 300ml) sem mudar a UI; produtos que ainda nao existem
// no Payload continuam vindo do mock.

import type { Produto, ProdutoDetalhe, VariacaoCor } from "@/lib/types";
import {
  produtoPorSlug,
  produtos as produtosMock,
  produtosEcologicos as produtosEcologicosMock,
} from "@/data/produtos";
import { lexicalToPlainText, payloadFind } from "@/lib/payload";

type CategoriaRef = { slug?: string; nome?: string } | number;
type MediaRef = { url?: string } | number;

type ProdutoDoc = {
  slug: string;
  nome: string;
  subtitulo?: string;
  headline?: string;
  descricaoCurta?: string;
  descricaoCompleta?: unknown;
  beneficios?: string[];
  idealPara?: string[];
  diferenciais?: string[];
  especificacoes?: { rotulo: string; valor: string }[];
  categorias?: CategoriaRef[];
  ecologico?: boolean;
  selos?: Record<string, boolean>;
  cores?: { nome: string; hex?: string }[];
  imagens?: MediaRef[];
  faixaPreco?: Produto["faixaPreco"];
  destaques?: Produto["destaques"];
  logistica?: { materiaPrima?: string };
};

// Cor sem hex definido (o dado de cor estruturado ainda nao veio do Plinio):
// usa um tom neutro so para o swatch renderizar.
const HEX_PADRAO: Record<string, string> = {
  Standard: "#e5e7eb",
  Neon: "#c6ff00",
  Metalizado: "#9ca3af",
};
const hexDaCor = (nome: string, hex?: string) => hex || HEX_PADRAO[nome] || "#cbd5e1";

const LABEL_SELO: Record<string, string> = {
  livreDeBpa: "Livre de BPA",
  usoMicroondas: "Uso em microondas",
  usoLavaLoucas: "Uso em lava-loucas",
  recicladoTotal: "100% reciclado",
  logisticaReversa: "Logistica reversa",
  usoPermanente: "Uso permanente",
  reducaoCo2: "Reducao de CO2",
  fonteRenovavel: "50% fonte renovavel",
  designCircular: "Design circular",
  upcycling: "Upcycling",
  fibraNatural: "Fibra natural",
  reciclavel: "Reciclavel",
  reducaoPlastico: "Reducao de plastico",
};

function categoriaPrincipal(cats?: CategoriaRef[]): string {
  const primeira = cats?.[0];
  return primeira && typeof primeira === "object" ? primeira.slug ?? "" : "";
}

function urlsDasImagens(imgs?: MediaRef[]): string[] {
  return (imgs ?? [])
    .map((i) => (typeof i === "object" ? i.url : undefined))
    .filter((u): u is string => typeof u === "string" && u.length > 0);
}

function montarDetalhe(doc: ProdutoDoc): ProdutoDetalhe {
  const completa = lexicalToPlainText(doc.descricaoCompleta);
  const selos = Object.entries(doc.selos ?? {})
    .filter(([, v]) => v === true)
    .map(([k]) => LABEL_SELO[k] ?? k);

  return {
    linhaCurta: doc.headline ?? doc.subtitulo ?? "",
    abertura: doc.subtitulo ?? doc.descricaoCurta ?? "",
    especificacoes: doc.especificacoes ?? [],
    beneficios: doc.beneficios ?? [],
    idealPara: doc.idealPara ?? [],
    descricaoCompleta: completa ? completa.split("\n\n") : [],
    diferenciais: doc.diferenciais ?? [],
    selos,
    faq: [],
  };
}

function mapear(doc: ProdutoDoc): Produto {
  const cores: VariacaoCor[] = (doc.cores ?? []).map((c) => ({
    nome: c.nome,
    hex: hexDaCor(c.nome, c.hex),
  }));

  return {
    slug: doc.slug,
    nome: doc.nome,
    categoria: categoriaPrincipal(doc.categorias),
    descricao: doc.descricaoCurta ?? "",
    material: doc.logistica?.materiaPrima ?? "",
    aplicacoes: doc.idealPara ?? [],
    cores,
    personalizavel: true,
    faixaPreco: doc.faixaPreco ?? "4-a-15",
    destaques: doc.destaques ?? [],
    tags: doc.ecologico ? ["ecologico"] : [],
    detalhe: montarDetalhe(doc),
    imagens: urlsDasImagens(doc.imagens),
  };
}

export async function getProdutoBySlug(slug: string): Promise<Produto | undefined> {
  try {
    // Busca o produto direto pelo slug, em vez de puxar a lista inteira a cada
    // pagina (que, com 150+ produtos e depth 1, era pesado e estourava o timeout).
    const docs = await payloadFind<ProdutoDoc>("produtos", {
      depth: 1,
      limit: 1,
      where: { "where[slug][equals]": slug },
    });
    if (docs[0]) return mapear(docs[0]);
  } catch {
    // cai no mock abaixo
  }
  return produtoPorSlug(slug);
}

// Slugs de TODOS os produtos reais do backend, para o generateStaticParams gerar
// uma PDP por produto publicado (sem isso, as paginas sao geradas a partir do
// mock e os produtos reais dao 404). Se o backend cair durante o build, usa os
// slugs do mock: o build nunca quebra, no pior caso sobem so os de exemplo.
export async function getProdutoSlugs(): Promise<string[]> {
  try {
    const docs = await payloadFind<{ slug?: string }>("produtos", {
      depth: 0,
      limit: 1000,
    });
    const slugs = docs
      .map((d) => d.slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    if (slugs.length > 0) return slugs;
  } catch {
    // cai no mock abaixo
  }
  return produtosMock.map((p) => p.slug);
}

// Lista completa de produtos reais do backend, ja mapeada pro tipo da UI, para a
// vitrine (/catalogo) e as faixas da home. Fallback pro mock se o backend cair no
// build (mesma regra das PDPs: no pior caso sobem so os de exemplo).
export async function getProdutos(): Promise<Produto[]> {
  try {
    const docs = await payloadFind<ProdutoDoc>("produtos", { depth: 1, limit: 1000 });
    if (docs.length > 0) return docs.map(mapear);
  } catch {
    // cai no mock abaixo
  }
  return produtosMock;
}

// So os ecologicos, para a faixa "Brindes Ecologicos" da home. Deriva da lista
// real pelo flag `ecologico`; cai no mock se a lista real veio vazia/fora do ar.
export async function getProdutosEcologicos(): Promise<Produto[]> {
  const todos = await getProdutos();
  if (todos === produtosMock) return produtosEcologicosMock();
  const eco = todos.filter((p) => (p.tags ?? []).includes("ecologico"));
  return eco.length > 0 ? eco : produtosEcologicosMock();
}
