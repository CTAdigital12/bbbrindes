// Loaders de conteudo (S03-04): leem as colecoes do Payload e mapeiam para os
// tipos que a UI ja usa, mantendo a UI inalterada. Estrategia de transicao do
// wireframe: se o Payload nao responder OU vier vazio (cliente ainda nao
// cadastrou), cai no mock de data/*. Assim que houver conteudo real no painel,
// ele substitui o placeholder. A fonte muda; a tela nao.

import type {
  Banner,
  CatalogoDigital,
  Case,
  Categoria,
  ConteudoHome,
  ConteudoInstitucional,
  Materia,
  Post,
  SiteConfig,
} from "@/lib/types";
import type { Campanha } from "@/data/campanhas";
import type { HeroSlide } from "@/data/home-joy";
import { posts as postsMock } from "@/data/blog";
import { cases as casesMock } from "@/data/cases";
import { materias as materiasMock } from "@/data/imprensa";
import { banners as bannersMock, miniBanners as miniBannersMock } from "@/data/banners";
import { campanhas as campanhasMock, campanhaPorSlug } from "@/data/campanhas";
import { categorias as categoriasMock } from "@/data/categorias";
import { configMock } from "@/data/config";
import { TRUST, DIF, QUOTES, FAQ, LOGOS, nb, orderedHeroSlides } from "@/data/home-joy";
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

type CampanhaFullDoc = {
  slug: string;
  nome: string;
  mes?: string;
  chamada?: string;
  imagem?: { url?: string } | number;
  conteudo?: unknown; // richText
  produtos?: ({ slug?: string } | number)[];
  ativo?: boolean;
};

// Uma campanha completa (landing): hero, chamada, conteudo e produtos em
// destaque, para a pagina campanha/[slug]. depth: 1 traz a URL da imagem e o
// slug dos produtos relacionados. Cai no mock (slug/nome/mes) se o backend
// falhar ou a campanha nao existir no painel; a landing trata os campos ricos
// ausentes com o comportamento padrao do mockup.
export async function getCampanhaBySlug(slug: string): Promise<Campanha | undefined> {
  try {
    const docs = await payloadFind<CampanhaFullDoc>("campanhas", {
      depth: 1,
      limit: 1,
      where: { "where[slug][equals]": slug },
    });
    const d = docs[0];
    if (d && d.ativo !== false) {
      return {
        slug: d.slug,
        nome: d.nome,
        mes: d.mes ?? "",
        chamada: d.chamada || undefined,
        imagem: typeof d.imagem === "object" ? d.imagem?.url : undefined,
        conteudo: lexicalToPlainText(d.conteudo) || undefined,
        produtos: (d.produtos ?? [])
          .map((p) => (typeof p === "object" ? p.slug : undefined))
          .filter((s): s is string => typeof s === "string" && s.length > 0),
      };
    }
  } catch {
    // cai no mock abaixo
  }
  return campanhaPorSlug(slug);
}

// Slugs de TODAS as campanhas ativas do backend, para o generateStaticParams
// gerar uma landing por campanha publicada. Fallback nos slugs do mock se o
// backend cair no build (mesma regra das PDPs).
export async function getCampanhaSlugs(): Promise<string[]> {
  try {
    const docs = await payloadFind<CampanhaDoc>("campanhas", { depth: 0, limit: 100 });
    const slugs = docs
      .filter((d) => d.ativo !== false)
      .map((d) => d.slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    if (slugs.length > 0) return slugs;
  } catch {
    // cai no mock abaixo
  }
  return campanhasMock.map((c) => c.slug);
}

type CategoriaDoc = { slug: string; nome: string; icone?: { url?: string } | number };

export async function getCategorias(): Promise<Categoria[]> {
  try {
    // depth: 1 traz o icone (upload) como objeto com url (sem isso vem so o id).
    const docs = await payloadFind<CategoriaDoc>("categorias", { sort: "ordem", depth: 1 });
    if (docs.length === 0) return categoriasMock;
    return docs.map((d) => ({
      slug: d.slug,
      nome: d.nome,
      icone: typeof d.icone === "object" ? d.icone?.url : undefined,
    }));
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

// ---- Conteudo da home (global `conteudo-home`, FB-6 Fase 5) ----

// Campo de upload do Payload: com depth>=1 vem como objeto com url; sem depth (ou
// sem imagem) vem como id/numero ou null. urlDeUpload() extrai a url com seguranca.
type UploadRef = { url?: string } | number | null;

function urlDeUpload(ref: UploadRef): string | undefined {
  return ref && typeof ref === "object" ? ref.url : undefined;
}

// Shape cru do global (tudo opcional: um global parcial nao quebra o build).
type ConteudoHomeDoc = {
  selosConfianca?: { icone?: string; titulo?: string; sub?: string }[];
  diferenciais?: { icone?: string; titulo?: string; sub?: string }[];
  depoimentos?: { texto?: string; autor?: string }[];
  faq?: { pergunta?: string; resposta?: string }[];
  urgencia?: {
    chip?: string;
    tituloInicio?: string;
    tituloDestaque?: string;
    texto?: string;
    ctaLabel?: string;
    ctaHref?: string;
    imagem?: UploadRef;
  };
  ecoBanner?: { eyebrow?: string; titulo?: string; texto?: string; ctaLabel?: string; imagem?: UploadRef };
  ecoLead?: {
    eyebrow?: string;
    titulo?: string;
    texto?: string;
    linhas?: { texto?: string }[];
    ctaLabel?: string;
    imagem?: UploadRef;
  };
  ctaFinal?: { titulo?: string; texto?: string; ctaLabel?: string; ctaHref?: string };
};

// Fallback montado a partir do home-joy.ts (TRUST/DIF/QUOTES/FAQ) e da copy que
// estava inline no page.tsx. E o estado atual no ar: usado quando o global nao
// responde ou vier vazio, pra home nao regredir.
function conteudoHomeMock(): ConteudoHome {
  return {
    selosConfianca: TRUST.map(([icone, titulo, sub]) => ({ icone, titulo, sub })),
    diferenciais: DIF.map(([icone, titulo, sub]) => ({ icone, titulo, sub })),
    depoimentos: QUOTES.map(([texto, autor]) => ({ texto, autor })),
    faq: FAQ.map(([pergunta, resposta]) => ({ pergunta, resposta })),
    urgencia: {
      chip: "Agenda de fim de ano",
      tituloInicio: "Dezembro tem prazo.",
      tituloDestaque: "A produção do seu brinde também.",
      texto:
        "A produção de fim de ano é o pico do setor. Feche seu pedido de Natal até o fim de outubro e garanta a entrega antes das festas.",
      ctaLabel: "Garantir meu prazo",
      ctaHref: "/campanha/natal",
      imagem: "/img/foto/MV02406GC-super-bowl-green-fibras-colors-500ml.webp",
    },
    ecoBanner: {
      eyebrow: "Linha Green",
      titulo: "A nova geração dos brindes ecológicos",
      texto: "Mais design. Menos impacto. Mais futuro.",
      ctaLabel: "Ver linha ecológica",
      imagem: "/img/banners/home-hero-fixo-2-linha-ecologica.webp",
    },
    ecoLead: {
      eyebrow: "Brindes ecológicos",
      titulo: "Brindes que duram, não descartáveis",
      texto:
        "Fabricados com fibras naturais de coco e madeira de reflorestamento. Produto reciclável, de uso permanente, livre de BPA.",
      linhas: ["Premium", "Green Fibras", "Green Plasticaria", "Green Reversa"],
      ctaLabel: "Ver linha ecológica",
      imagem: "/img/foto/MV02146G-copo-mini-roma-ecologico-green-fibras-300ml.webp",
    },
    ctaFinal: {
      titulo: "Monte seu orçamento. Um especialista responde com a proposta.",
      texto:
        "Sem pagamento online. Você escolhe os produtos e a quantidade, e o time comercial retorna.",
      ctaLabel: "Começar meu orçamento",
      ctaHref: "/catalogo",
    },
  };
}

// Remove acentos pra comparar "mesmo texto a menos de acento". O backend semeia os
// defaultValue do global em ASCII (ex.: "Fabrica propria"); a copy acentuada
// canonica vive no front (mock). Enquanto o campo do global ainda for esse default
// ASCII, mantemos a versao acentuada; so quando o cliente edita de verdade (texto
// diferente) o global entra. Assim a home nunca regride de acento.
function semAcento(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Campo de texto: usa o mock (acentuado) quando o global esta vazio OU e o mesmo
// texto a menos de acento (ainda o default do backend); usa o global quando for
// edicao real do cliente.
function preferir(doGlobal: string | undefined, doMock: string): string {
  if (!doGlobal) return doMock;
  return semAcento(doGlobal) === semAcento(doMock) ? doMock : doGlobal;
}

// Le o global com fallback POR BLOCO (array/grupo vazio ou faltando cai no mock) e,
// nos campos de texto, com preferencia pela copy acentuada do mock enquanto o
// global ainda for o default ASCII do backend (ver `preferir`). Arrays pareiam por
// indice quando o tamanho bate (so o default mudou); se o cliente mexeu na
// estrutura (tamanho diferente), usa o array do global como veio. Imagens dos
// blocos e o countdown seguem no front.
export async function getConteudoHome(): Promise<ConteudoHome> {
  const mock = conteudoHomeMock();
  try {
    // depth: 1 traz as imagens dos blocos (upload) como objeto com url.
    const doc = await payloadGlobal<ConteudoHomeDoc>("conteudo-home", { depth: 1 });

    const selosG = (doc.selosConfianca ?? [])
      .map((s) => ({ icone: s.icone ?? "", titulo: s.titulo ?? "", sub: s.sub ?? "" }))
      .filter((s) => s.icone && s.titulo);
    const selos =
      selosG.length === 0
        ? mock.selosConfianca
        : selosG.length === mock.selosConfianca.length
          ? mock.selosConfianca.map((m, i) => ({
              icone: selosG[i].icone || m.icone,
              titulo: preferir(selosG[i].titulo, m.titulo),
              sub: preferir(selosG[i].sub, m.sub),
            }))
          : selosG;

    const difsG = (doc.diferenciais ?? [])
      .map((d) => ({ icone: d.icone ?? "", titulo: d.titulo ?? "", sub: d.sub ?? "" }))
      .filter((d) => d.icone && d.titulo);
    const difs =
      difsG.length === 0
        ? mock.diferenciais
        : difsG.length === mock.diferenciais.length
          ? mock.diferenciais.map((m, i) => ({
              icone: difsG[i].icone || m.icone,
              titulo: preferir(difsG[i].titulo, m.titulo),
              sub: preferir(difsG[i].sub, m.sub),
            }))
          : difsG;

    const depsG = (doc.depoimentos ?? [])
      .map((q) => ({ texto: q.texto ?? "", autor: q.autor ?? "" }))
      .filter((q) => q.texto && q.autor);
    const deps =
      depsG.length === 0
        ? mock.depoimentos
        : depsG.length === mock.depoimentos.length
          ? mock.depoimentos.map((m, i) => ({
              texto: preferir(depsG[i].texto, m.texto),
              autor: preferir(depsG[i].autor, m.autor),
            }))
          : depsG;

    const faqsG = (doc.faq ?? [])
      .map((f) => ({ pergunta: f.pergunta ?? "", resposta: f.resposta ?? "" }))
      .filter((f) => f.pergunta && f.resposta);
    const faqs =
      faqsG.length === 0
        ? mock.faq
        : faqsG.length === mock.faq.length
          ? mock.faq.map((m, i) => ({
              pergunta: preferir(faqsG[i].pergunta, m.pergunta),
              resposta: preferir(faqsG[i].resposta, m.resposta),
            }))
          : faqsG;

    const linhasG = (doc.ecoLead?.linhas ?? []).map((l) => l.texto ?? "").filter(Boolean);
    const linhas =
      linhasG.length === 0
        ? mock.ecoLead.linhas
        : linhasG.length === mock.ecoLead.linhas.length
          ? mock.ecoLead.linhas.map((m, i) => preferir(linhasG[i], m))
          : linhasG;

    return {
      selosConfianca: selos,
      diferenciais: difs,
      depoimentos: deps,
      faq: faqs,
      urgencia: {
        chip: preferir(doc.urgencia?.chip, mock.urgencia.chip),
        tituloInicio: preferir(doc.urgencia?.tituloInicio, mock.urgencia.tituloInicio),
        tituloDestaque: preferir(doc.urgencia?.tituloDestaque, mock.urgencia.tituloDestaque),
        texto: preferir(doc.urgencia?.texto, mock.urgencia.texto),
        ctaLabel: preferir(doc.urgencia?.ctaLabel, mock.urgencia.ctaLabel),
        // href e slug, nao prose: mantem o global quando preenchido.
        ctaHref: doc.urgencia?.ctaHref || mock.urgencia.ctaHref,
        // imagem: upload do painel quando houver, senao a foto padrao do site.
        imagem: urlDeUpload(doc.urgencia?.imagem ?? null) || mock.urgencia.imagem,
      },
      ecoBanner: {
        eyebrow: preferir(doc.ecoBanner?.eyebrow, mock.ecoBanner.eyebrow),
        titulo: preferir(doc.ecoBanner?.titulo, mock.ecoBanner.titulo),
        texto: preferir(doc.ecoBanner?.texto, mock.ecoBanner.texto),
        ctaLabel: preferir(doc.ecoBanner?.ctaLabel, mock.ecoBanner.ctaLabel),
        imagem: urlDeUpload(doc.ecoBanner?.imagem ?? null) || mock.ecoBanner.imagem,
      },
      ecoLead: {
        eyebrow: preferir(doc.ecoLead?.eyebrow, mock.ecoLead.eyebrow),
        titulo: preferir(doc.ecoLead?.titulo, mock.ecoLead.titulo),
        texto: preferir(doc.ecoLead?.texto, mock.ecoLead.texto),
        linhas,
        ctaLabel: preferir(doc.ecoLead?.ctaLabel, mock.ecoLead.ctaLabel),
        imagem: urlDeUpload(doc.ecoLead?.imagem ?? null) || mock.ecoLead.imagem,
      },
      ctaFinal: {
        titulo: preferir(doc.ctaFinal?.titulo, mock.ctaFinal.titulo),
        texto: preferir(doc.ctaFinal?.texto, mock.ctaFinal.texto),
        ctaLabel: preferir(doc.ctaFinal?.ctaLabel, mock.ctaFinal.ctaLabel),
        ctaHref: doc.ctaFinal?.ctaHref || mock.ctaFinal.ctaHref,
      },
    };
  } catch {
    return mock;
  }
}

// ---- Conteudo institucional (global `conteudo-institucional`, FB-6 Fase 6) ----

type ConteudoInstitucionalDoc = {
  quemSomos?: {
    eyebrow?: string;
    titulo?: string;
    paragrafo1?: string;
    paragrafo2?: string;
    numeros?: { valor?: string; rotulo?: string }[];
    sustentabilidade?: { icone?: string; titulo?: string }[];
    selos?: { sigla?: string; desc?: string }[];
    fotoFabrica?: UploadRef;
    galeria?: { imagem?: UploadRef; legenda?: string }[];
  };
  sac?: { titulo?: string; texto?: string; motivos?: { texto?: string }[] };
};

// Estado atual no ar das paginas Quem somos e SAC (hoje inline nas pages). Usado
// quando o global nao responde ou vier vazio, pra pagina nao regredir. As imagens
// ficam como caminho estatico (o loader resolve upload OU este path; a page usa
// imgSrc() uniforme).
function conteudoInstitucionalMock(): ConteudoInstitucional {
  return {
    quemSomos: {
      eyebrow: "Quem somos",
      titulo: "Somos fábrica, não revenda.",
      paragrafo1:
        "A BB Brindes, empresa do Grupo BB, é uma indústria brasileira de brindes corporativos. Produção própria, escala nacional e atendimento comercial direto.",
      paragrafo2:
        "Atendemos empresas e revendedores em todo o país, com catálogo amplo, personalização da sua marca e compromisso com prazo e qualidade.",
      numeros: [
        { valor: "27 anos", rotulo: "de mercado" },
        { valor: "500 un.", rotulo: "pedido mínimo" },
        { valor: "100%", rotulo: "produção nacional" },
        { valor: "5", rotulo: "certificações de qualidade" },
      ],
      sustentabilidade: [
        { icone: "livres-de-bpa-e-reciclados", titulo: "Produtos livres de BPA e materiais reciclados" },
        { icone: "menos-plastico-virgem", titulo: "Redução de plástico virgem na linha ecológica" },
        { icone: "controle-de-qualidade", titulo: "Produção própria com controle de qualidade" },
      ],
      selos: [
        { sigla: "SMETA 4 Pilares", desc: "Trabalho, saúde e segurança, meio ambiente e ética" },
        { sigla: "NBR NM 300", desc: "Segurança de brinquedos (Inmetro)" },
        { sigla: "SGP", desc: "Auditoria de fornecedor" },
        { sigla: "PS&C", desc: "Auditoria de fornecedor" },
        { sigla: "GMP", desc: "Boas práticas de fabricação" },
      ],
      fotoFabrica: "/img/institucional/inst-01.webp",
      galeria: [
        { imagem: "/img/institucional/inst-05.webp", legenda: "Máquina de injeção e sopro na fábrica" },
        { imagem: "/img/institucional/inst-04.webp", legenda: "Produção de squeezes da linha ecológica" },
        { imagem: "/img/institucional/inst-02.webp", legenda: "Lote de squeezes personalizados" },
        { imagem: "/img/institucional/inst-03.webp", legenda: "Produtos em In Mold Label" },
        { imagem: "/img/institucional/inst-06.webp", legenda: "Estande da BB Brindes em feira do setor" },
        { imagem: "/img/institucional/inst-07.webp", legenda: "BB Brindes em feira do setor" },
      ],
    },
    sac: {
      titulo: "SAC BB Brindes",
      texto:
        "Conta o que aconteceu. Selecione o motivo abaixo para que a sua mensagem chegue direto na pessoa certa. Retornamos em até 24 horas úteis.",
      motivos: [
        "Status do pedido",
        "Problema com produto",
        "Divergência de quantidade ou item",
        "Prazo de entrega",
        "Nota fiscal e documentos",
        "Aprovação de arte",
        "Elogio",
        "Outro",
      ],
    },
  };
}

// Le o global com fallback POR CAMPO (texto/array/imagem vazio cai no mock). Os
// defaultValue do backend ja vem acentuados e canonicos, entao usa o global direto
// quando preenchido. depth: 1 traz as imagens (fotoFabrica e galeria) como url.
export async function getConteudoInstitucional(): Promise<ConteudoInstitucional> {
  const mock = conteudoInstitucionalMock();
  try {
    const doc = await payloadGlobal<ConteudoInstitucionalDoc>("conteudo-institucional", { depth: 1 });
    const qs = doc.quemSomos;
    const sac = doc.sac;

    const numeros = (qs?.numeros ?? [])
      .map((n) => ({ valor: n.valor ?? "", rotulo: n.rotulo ?? "" }))
      .filter((n) => n.valor && n.rotulo);
    const sustentabilidade = (qs?.sustentabilidade ?? [])
      .map((s) => ({ icone: s.icone ?? "", titulo: s.titulo ?? "" }))
      .filter((s) => s.icone && s.titulo);
    const selos = (qs?.selos ?? [])
      .map((s) => ({ sigla: s.sigla ?? "", desc: s.desc ?? "" }))
      .filter((s) => s.sigla && s.desc);
    const galeria = (qs?.galeria ?? [])
      .map((g) => ({ imagem: urlDeUpload(g.imagem ?? null) ?? "", legenda: g.legenda ?? "" }))
      .filter((g) => g.imagem);
    const motivos = (sac?.motivos ?? []).map((m) => m.texto ?? "").filter(Boolean);

    return {
      quemSomos: {
        eyebrow: qs?.eyebrow || mock.quemSomos.eyebrow,
        titulo: qs?.titulo || mock.quemSomos.titulo,
        paragrafo1: qs?.paragrafo1 || mock.quemSomos.paragrafo1,
        paragrafo2: qs?.paragrafo2 || mock.quemSomos.paragrafo2,
        numeros: numeros.length ? numeros : mock.quemSomos.numeros,
        sustentabilidade: sustentabilidade.length ? sustentabilidade : mock.quemSomos.sustentabilidade,
        selos: selos.length ? selos : mock.quemSomos.selos,
        fotoFabrica: urlDeUpload(qs?.fotoFabrica ?? null) || mock.quemSomos.fotoFabrica,
        galeria: galeria.length ? galeria : mock.quemSomos.galeria,
      },
      sac: {
        titulo: sac?.titulo || mock.sac.titulo,
        texto: sac?.texto || mock.sac.texto,
        motivos: motivos.length ? motivos : mock.sac.motivos,
      },
    };
  } catch {
    return mock;
  }
}

// ---- Catalogo digital (global `catalogos`, FB-6 midia) ----

type CatalogosDoc = {
  titulo?: string;
  intro?: string;
  flipbookUrl?: string;
  itens?: { nome?: string; url?: string }[];
};

function catalogosMock(): CatalogoDigital {
  return {
    titulo: "Catálogo digital",
    intro: "Folheie online e compartilhe o link com quem decide a compra.",
    flipbookUrl: "https://heyzine.com/flip-book/aa2476761e.html",
    itens: [
      { nome: "Catálogo BB Brindes 2027", url: "" },
      { nome: "Linha Green (ecológicos)", url: "" },
      { nome: "Datas comemorativas", url: "" },
    ],
  };
}

export async function getCatalogos(): Promise<CatalogoDigital> {
  const mock = catalogosMock();
  try {
    const doc = await payloadGlobal<CatalogosDoc>("catalogos");
    const itens = (doc.itens ?? [])
      .map((i) => ({ nome: i.nome ?? "", url: i.url ?? "" }))
      .filter((i) => i.nome);
    return {
      titulo: doc.titulo || mock.titulo,
      intro: doc.intro || mock.intro,
      flipbookUrl: doc.flipbookUrl || mock.flipbookUrl,
      itens: itens.length ? itens : mock.itens,
    };
  } catch {
    return mock;
  }
}

// ---- Hero slides (collection `hero-slides`, FB-6 midia) ----

type HeroSlideDoc = {
  id?: number | string;
  nome?: string;
  tipo?: "mensal" | "fixo";
  mes?: number;
  ordem?: number;
  ativo?: boolean;
  theme?: "dark" | "cream";
  tag?: string;
  icone?: string;
  tituloAntes?: string;
  tituloDestaque?: string;
  tituloDepois?: string;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imagemDesktop?: UploadRef;
  imagemMobile?: UploadRef;
};

// Escapa HTML pra injetar texto do painel no titulo/sub do hero (renderizados com
// dangerouslySetInnerHTML) sem abrir XSS; so o <span class="hl"> do destaque, que
// nos controlamos, vai cru.
function escaparHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Recompoe o titulo do hero: antes + destaque (verde lime) + depois. Aplica o
// anti-viuva (nb) por segmento ja escapado, pra nao glueir dentro das tags.
function montarTituloHero(antes: string, destaque: string, depois: string): string {
  const partes: string[] = [];
  if (antes.trim()) partes.push(nb(escaparHtml(antes.trim())));
  if (destaque.trim()) partes.push(`<span class="hl">${nb(escaparHtml(destaque.trim()))}</span>`);
  if (depois.trim()) partes.push(nb(escaparHtml(depois.trim())));
  return partes.join(" ");
}

// Slide do painel sem imagem cai aqui: a `key` sintetica nao bate com nenhum
// arquivo /img/banners/home-hero-*, entao resolve-se uma imagem padrao valida.
const HERO_FALLBACK_IMG = "/img/banners/home-hero-fixo-1-fabrica-propria.webp";

// Carrossel principal da home. Replica a rotacao do mock (slide do mes corrente,
// depois os 2 fixos por ordem, depois os demais meses por mes) com os slides do
// painel. Cai no mock (orderedHeroSlides) se a collection estiver vazia ou o
// backend nao responder, pra home nao regredir.
export async function getHeroSlides(monthIdx: number): Promise<HeroSlide[]> {
  try {
    const docs = await payloadFind<HeroSlideDoc>("hero-slides", { sort: "ordem", depth: 1 });
    const ativos = docs.filter((d) => d.ativo !== false);
    if (ativos.length === 0) return orderedHeroSlides(monthIdx);

    const porOrdem = (a: HeroSlideDoc, b: HeroSlideDoc) => (a.ordem ?? 0) - (b.ordem ?? 0);
    const mesAtual = (((monthIdx % 12) + 12) % 12) + 1; // 1..12
    const fixos = ativos.filter((d) => d.tipo === "fixo").sort(porOrdem);
    const mensais = ativos.filter((d) => d.tipo !== "fixo");
    const doMes = mensais.filter((d) => d.mes === mesAtual).sort(porOrdem);
    const outrosMeses = mensais
      .filter((d) => d.mes !== mesAtual)
      .sort((a, b) => (a.mes ?? 0) - (b.mes ?? 0) || porOrdem(a, b));

    const ordenados = [...doMes, ...fixos, ...outrosMeses];

    return ordenados.map((d, i) => {
      const imgDesktop = urlDeUpload(d.imagemDesktop ?? null);
      const imgMobile = urlDeUpload(d.imagemMobile ?? null);
      return {
        key: `hero-${d.id ?? i}`,
        theme: d.theme === "cream" ? "cream" : "dark",
        tag: d.tag ?? "",
        icon: d.icone || "sparkles",
        title: montarTituloHero(d.tituloAntes ?? "", d.tituloDestaque ?? "", d.tituloDepois ?? ""),
        sub: d.sub ? nb(escaparHtml(d.sub)) : "",
        cta: d.ctaLabel || "Ver mais",
        href: d.ctaHref || "/catalogo",
        imgDesktop: imgDesktop || HERO_FALLBACK_IMG,
        imgMobile: imgMobile || imgDesktop || HERO_FALLBACK_IMG,
      };
    });
  } catch {
    return orderedHeroSlides(monthIdx);
  }
}

// ---- Logos do marquee (collection `logos`, FB-6) ----

type LogoDoc = { nome?: string; ordem?: number; url?: string };

// Logos estaticos como fallback (/img/logos/<slug>.svg). A home usa imgSrc() na
// url, que resolve tanto o caminho estatico quanto a URL absoluta do painel.
function logosMock(): { nome: string; url: string }[] {
  return LOGOS.map((l) => ({ nome: l, url: `/img/logos/${l}.svg` }));
}

// Logos das marcas no marquee (collection `logos`, upload proprio SVG/PNG). Cai
// nos SVGs estaticos se a collection estiver vazia ou o backend nao responder.
export async function getLogos(): Promise<{ nome: string; url: string }[]> {
  try {
    const docs = await payloadFind<LogoDoc>("logos", { sort: "ordem", depth: 0 });
    const reais = docs
      .filter((d) => typeof d.url === "string" && d.url.length > 0)
      .map((d) => ({ nome: d.nome ?? "", url: d.url as string }));
    if (reais.length === 0) return logosMock();
    return reais;
  } catch {
    return logosMock();
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
