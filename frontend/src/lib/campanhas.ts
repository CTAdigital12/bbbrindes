import type { Campanha } from "@/data/campanhas";
import { lexicalToPlainText, payloadFind } from "./payload";

type CampanhaDoc = {
  slug: string;
  nome: string;
  mes?: string;
  chamada?: string;
  imagem?: { url?: string } | number | null;
  conteudo?: unknown;
  produtos?: ({ slug?: string } | number)[];
  ativo?: boolean;
};

function mapear(doc: CampanhaDoc): Campanha {
  return {
    slug: doc.slug,
    nome: doc.nome,
    mes: doc.mes ?? "",
    chamada: doc.chamada || undefined,
    imagem: doc.imagem && typeof doc.imagem === "object" ? doc.imagem.url : undefined,
    conteudo: lexicalToPlainText(doc.conteudo) || undefined,
    produtos: (doc.produtos ?? [])
      .map((produto) => typeof produto === "object" ? produto.slug : undefined)
      .filter((slug): slug is string => Boolean(slug)),
  };
}

// Campanhas publicadas sao as do painel. Vazio/inativo nao ressuscita a lista
// inicial. Falha de API interrompe o build e preserva a publicacao anterior.
export async function getCampanhas(): Promise<Campanha[]> {
  const docs = await payloadFind<CampanhaDoc>("campanhas", {
    limit: 1000, depth: 1, sort: "createdAt",
  });
  return docs.filter((doc) => doc.ativo !== false).map(mapear);
}

export async function getCampanhaBySlug(slug: string): Promise<Campanha | undefined> {
  const docs = await payloadFind<CampanhaDoc>("campanhas", {
    depth: 1, limit: 1, where: { "where[slug][equals]": slug },
  });
  const doc = docs[0];
  return doc && doc.ativo !== false ? mapear(doc) : undefined;
}

export async function getCampanhaSlugs(): Promise<string[]> {
  return (await getCampanhas()).map((campanha) => campanha.slug);
}
