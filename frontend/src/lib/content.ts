// Loaders de conteudo (S03-04): leem as colecoes do Payload e mapeiam para os
// tipos que a UI ja usa, mantendo a UI inalterada. Estrategia de transicao do
// wireframe: se o Payload nao responder OU vier vazio (cliente ainda nao
// cadastrou), cai no mock de data/*. Assim que houver conteudo real no painel,
// ele substitui o placeholder. A fonte muda; a tela nao.

import type { Banner, Case, Categoria, Materia, Post, SiteConfig } from "@/lib/types";
import type { Campanha } from "@/data/campanhas";
import { posts as postsMock } from "@/data/blog";
import { cases as casesMock } from "@/data/cases";
import { materias as materiasMock } from "@/data/imprensa";
import { banners as bannersMock, miniBanners as miniBannersMock } from "@/data/banners";
import { campanhas as campanhasMock } from "@/data/campanhas";
import { categorias as categoriasMock } from "@/data/categorias";
import { configMock } from "@/data/config";
import { lexicalToPlainText, payloadFind, payloadGlobal, toDateOnly } from "@/lib/payload";

type PostDoc = {
  slug: string;
  titulo: string;
  resumo?: string;
  data: string;
  conteudo?: unknown;
};

type CaseDoc = {
  slug: string;
  cliente: string;
  titulo: string;
  segmento?: string;
  resumo?: string;
  depoimento?: { texto?: string; autor?: string };
};

type MateriaDoc = {
  id: number | string;
  veiculo: string;
  data: string;
  titulo: string;
  resumo?: string;
  url?: string;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const docs = await payloadFind<PostDoc>("posts", { sort: "-data" });
    if (docs.length === 0) return postsMock;
    return docs.map((d) => ({
      slug: d.slug,
      titulo: d.titulo,
      resumo: d.resumo ?? "",
      data: toDateOnly(d.data),
      conteudo: lexicalToPlainText(d.conteudo),
    }));
  } catch {
    return postsMock;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getCases(): Promise<Case[]> {
  try {
    const docs = await payloadFind<CaseDoc>("cases");
    if (docs.length === 0) return casesMock;
    return docs.map((d) => {
      const c: Case = {
        slug: d.slug,
        cliente: d.cliente,
        segmento: d.segmento ?? "",
        titulo: d.titulo,
        resumo: d.resumo ?? "",
      };
      if (d.depoimento?.texto) {
        c.depoimento = { texto: d.depoimento.texto, autor: d.depoimento.autor ?? "" };
      }
      return c;
    });
  } catch {
    return casesMock;
  }
}

type BannerDoc = {
  id: number | string;
  titulo: string;
  subtitulo?: string;
  cta?: string;
  href?: string;
  imagem?: { url?: string } | number;
  posicao: "carrossel" | "mini";
  ativo?: boolean;
  ordem?: number;
};

// Banners da home, separados por posicao (carrossel principal x mini banners).
// Fallback so quando a colecao inteira esta vazia (cliente ainda nao mexeu em
// banners); a partir do primeiro banner cadastrado, respeita o que esta no
// painel, mesmo que uma das posicoes fique sem itens.
export async function getBanners(): Promise<{ carrossel: Banner[]; mini: Banner[] }> {
  try {
    // depth: 1 traz a imagem como objeto com url (sem isso vem so o id).
    const docs = await payloadFind<BannerDoc>("banners", { sort: "ordem", depth: 1 });
    if (docs.length === 0) return { carrossel: bannersMock, mini: miniBannersMock };

    const mapear = (posicao: BannerDoc["posicao"]): Banner[] =>
      docs
        .filter((d) => d.posicao === posicao && d.ativo !== false)
        .map((d) => ({
          id: String(d.id),
          titulo: d.titulo,
          subtitulo: d.subtitulo ?? "",
          cta: d.cta ?? "",
          href: d.href && d.href.length > 0 ? d.href : "#",
          imagem: typeof d.imagem === "object" ? d.imagem?.url : undefined,
        }));

    return { carrossel: mapear("carrossel"), mini: mapear("mini") };
  } catch {
    return { carrossel: bannersMock, mini: miniBannersMock };
  }
}

type CampanhaDoc = { slug: string; nome: string; mes?: string; ativo?: boolean };

export async function getCampanhas(): Promise<Campanha[]> {
  try {
    const docs = await payloadFind<CampanhaDoc>("campanhas");
    const ativas = docs.filter((d) => d.ativo !== false);
    if (ativas.length === 0) return campanhasMock;
    return ativas.map((d) => ({ slug: d.slug, nome: d.nome, mes: d.mes ?? "" }));
  } catch {
    return campanhasMock;
  }
}

type CategoriaDoc = { slug: string; nome: string };

export async function getCategorias(): Promise<Categoria[]> {
  try {
    const docs = await payloadFind<CategoriaDoc>("categorias", { sort: "ordem" });
    if (docs.length === 0) return categoriasMock;
    return docs.map((d) => ({ slug: d.slug, nome: d.nome }));
  } catch {
    return categoriasMock;
  }
}

type ConfigDoc = {
  contato?: {
    telefone?: string;
    whatsapp?: string;
    email?: string;
    endereco?: string;
    horario?: string;
    cnpj?: string;
  };
  redes?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    pinterest?: string;
    youtube?: string;
  };
  descricao?: string;
  selos?: { nome?: string }[];
};

// Configuracoes gerais do site (global `configuracoes`, FB-6): contato, redes,
// selos e blurb. Cai no mock (data/config.ts) se o backend falhar OU se o global
// ainda estiver vazio (cliente nao cadastrou). Cada campo tem fallback proprio no
// mock, entao um global parcialmente preenchido completa o resto com o padrao.
export async function getConfig(): Promise<SiteConfig> {
  try {
    const doc = await payloadGlobal<ConfigDoc>("configuracoes");
    // Global recem-criado (sem contato) -> usa o mock inteiro.
    if (!doc?.contato?.whatsapp && !doc?.contato?.email) return configMock;
    return {
      telefone: doc.contato?.telefone ?? configMock.telefone,
      whatsapp: doc.contato?.whatsapp ?? configMock.whatsapp,
      email: doc.contato?.email ?? configMock.email,
      endereco: doc.contato?.endereco ?? configMock.endereco,
      horario: doc.contato?.horario ?? configMock.horario,
      cnpj: doc.contato?.cnpj ?? configMock.cnpj,
      descricao: doc.descricao ?? configMock.descricao,
      redes: {
        instagram: doc.redes?.instagram ?? "",
        linkedin: doc.redes?.linkedin ?? "",
        facebook: doc.redes?.facebook ?? "",
        pinterest: doc.redes?.pinterest ?? "",
        youtube: doc.redes?.youtube ?? "",
      },
      selos: (doc.selos ?? [])
        .map((s) => s.nome ?? "")
        .filter(Boolean),
    };
  } catch {
    return configMock;
  }
}

export async function getMaterias(): Promise<Materia[]> {
  try {
    const docs = await payloadFind<MateriaDoc>("imprensa", { sort: "-data" });
    if (docs.length === 0) return materiasMock;
    return docs.map((d) => ({
      id: String(d.id),
      veiculo: d.veiculo,
      data: toDateOnly(d.data),
      titulo: d.titulo,
      resumo: d.resumo ?? "",
      url: d.url && d.url.length > 0 ? d.url : "#",
    }));
  } catch {
    return materiasMock;
  }
}
