// Tipos do dominio (wireframe). Espelham a estrutura que sera modelada no Payload (Sprint 1).

export type Categoria = {
  slug: string;
  nome: string;
  // Icone da categoria (Payload: upload `icone`). URL da media. Opcional; sem ele
  // o front cai no icone estatico (CAT_ICON) e, sem este, num generico.
  icone?: string;
};

export type VariacaoCor = {
  nome: string;
  hex: string;
};

export type Produto = {
  slug: string;
  nome: string;
  categoria: string; // slug da categoria
  descricao: string;
  material: string;
  aplicacoes: string[];
  cores: VariacaoCor[];
  personalizavel: boolean;
  faixaPreco: "ate-3-99" | "4-a-15" | "acima-de-15";
  destaques: ("destaque" | "mais-vendido" | "lancamento")[];
  // Tags que diferenciam de verdade (ex.: Ecologico). Opcional; ver tagsDoProduto.
  tags?: string[];
  // Detalhamento da PDP (S03-11). Opcional: so os produtos-modelo preenchem no
  // wireframe. Na producao virao do Payload (docs/pdp-modelo-squeeze.md, Versao A).
  detalhe?: ProdutoDetalhe;
  // URLs de imagem reais (Payload). Opcional: produtos mock nao tem e a PDP cai
  // no placeholder. Presente quando o produto vem do Payload com galeria.
  imagens?: string[];
  // Foto lifestyle/ambientada (Payload: imagemAmbientada). E a imagem que o card
  // revela no HOVER (slot .alt full-bleed). Opcional; quando vazia o hover cai no
  // comportamento antigo (2a foto da galeria).
  imagemAmbientada?: string;
  // Video da linha do produto (Payload: videoUrl, URL do YouTube). Opcional;
  // quando presente, a PDP mostra o botao "Ver video" (abre modal com o embed).
  videoUrl?: string;
  // Quantidade minima de pedido (Payload: quantidadeMinima). Opcional; quando
  // ausente a PDP assume 500 (minimo padrao da fabrica).
  quantidadeMinima?: number;
  // Metodos de impressao/personalizacao aceitos (Payload: impressao.metodos, texto
  // da planilha, ex.: "Serigrafia cilindrica/ tampografia"). Opcional; exibido como
  // informacao na PDP (o cliente nao escolhe mais a tecnica: depende da arte).
  metodosImpressao?: string;
};

// Blocos da pagina de produto simulados no wireframe (S03-11). Espelham a
// estrutura de docs/pdp-modelo-squeeze.md. Campos "a confirmar" com o cliente
// ficam em pendencias, exibidos com marca visivel para nao publicar dado errado.
export type ProdutoDetalhe = {
  linhaCurta: string; // subtitulo que cita o produto
  abertura: string; // paragrafo de abertura visivel
  especificacoes: { rotulo: string; valor: string }[];
  beneficios: string[];
  idealPara: string[];
  descricaoCompleta: string[]; // paragrafos atras do "Ver mais"
  diferenciais: string[];
  selos: string[];
  faq: { pergunta: string; resposta: string; aConfirmar?: boolean }[];
  // Itens que dependem de confirmacao do cliente antes de publicar.
  pendencias?: string[];
};

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string;
  cta: string;
  href: string;
  // URL do fundo (Payload). Opcional: sem imagem cai no placeholder. O texto
  // (titulo/subtitulo/cta) mora aqui, nao na imagem; o banner e so o fundo.
  imagem?: string;
};

export type Post = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string; // ISO
  conteudo: string;
};

// Cases / prova social (S01-08): cliente, segmento e depoimento opcional.
export type Case = {
  slug: string;
  cliente: string;
  segmento: string;
  titulo: string;
  resumo: string;
  depoimento?: { texto: string; autor: string };
};

// Materia de imprensa / clipping (S01-09).
export type Materia = {
  id: string;
  veiculo: string;
  data: string; // ISO
  titulo: string;
  resumo: string;
  url: string;
};

// Configuracoes gerais do site (global `configuracoes` do Payload, FB-6): dados
// de contato, redes sociais, selos e o blurb do rodape. O front le via
// getConfig(), com fallback no mock (data/config.ts) enquanto o global nao
// estiver preenchido. redes vem como "" quando nao cadastradas (icone escondido).
export type SiteConfig = {
  telefone: string;
  whatsapp: string; // so numeros, com DDI (base do link wa.me)
  email: string;
  endereco: string;
  horario: string;
  cnpj: string;
  descricao: string;
  redes: {
    instagram: string;
    linkedin: string;
    facebook: string;
    pinterest: string;
    youtube: string;
  };
  selos: string[];
};

// Conteudo editavel da home (global `conteudo-home`, FB-6 Fase 5): a copy dos
// blocos que eram hardcoded (home-joy.ts + inline no page.tsx). O front le via
// getConteudoHome(), com fallback no mock (home-joy) enquanto o global nao
// estiver disponivel/preenchido, pra home nao regredir. Imagens dos blocos e o
// countdown seguem no front (nao vem do global). `icone`: nos selos e o nome do
// Icon; nos diferenciais e o slug do arquivo diferencial-<icone>.svg.
export type ConteudoHome = {
  selosConfianca: { icone: string; titulo: string; sub: string }[];
  diferenciais: { icone: string; titulo: string; sub: string }[];
  depoimentos: { texto: string; autor: string }[];
  faq: { pergunta: string; resposta: string }[];
  urgencia: {
    chip: string;
    tituloInicio: string;
    tituloDestaque: string;
    texto: string;
    ctaLabel: string;
    ctaHref: string;
    // URL resolvida da foto do bloco (backend ou padrao estatico). Sempre
    // presente: o loader cai na imagem padrao quando o global nao tem upload.
    imagem: string;
  };
  ecoBanner: { eyebrow: string; titulo: string; texto: string; ctaLabel: string; imagem: string };
  ecoLead: {
    eyebrow: string;
    titulo: string;
    texto: string;
    linhas: string[];
    ctaLabel: string;
    imagem: string;
  };
  ctaFinal: { titulo: string; texto: string; ctaLabel: string; ctaHref: string };
};

// Conteudo editavel das paginas institucionais (global `conteudo-institucional`,
// FB-6 Fase 6): Quem somos (intro, numeros, sustentabilidade, certificacoes,
// foto da fabrica + galeria) e SAC (intro + motivos). O front le via
// getConteudoInstitucional(), com fallback no mock enquanto o global nao
// estiver disponivel. fotoFabrica e galeria[].imagem vem como URL resolvida
// (backend ou caminho estatico); use imgSrc() direto. A linha do tempo segue no
// front. `icone` em sustentabilidade = slug do arquivo sustentabilidade-<icone>.svg.
export type ConteudoInstitucional = {
  quemSomos: {
    eyebrow: string;
    titulo: string;
    paragrafo1: string;
    paragrafo2: string;
    numeros: { valor: string; rotulo: string }[];
    sustentabilidade: { icone: string; titulo: string }[];
    selos: { sigla: string; desc: string }[];
    fotoFabrica: string;
    galeria: { imagem: string; legenda: string }[];
  };
  sac: { titulo: string; texto: string; motivos: string[] };
};

// Conteudo editavel da pagina /catalogos (global `catalogos`, FB-6 midia):
// titulo/intro, a URL do flipbook (heyzine, embed) e os cards de atalho. O
// front le via getCatalogos(), com fallback no mock. itens[].url vazia = abre o
// flipbook principal.
export type CatalogoDigital = {
  titulo: string;
  intro: string;
  flipbookUrl: string;
  itens: { nome: string; url: string }[];
};

// Visao exclusiva do revendedor (preco e estoque por produto).
export type RevendedorPreco = {
  produtoSlug: string;
  precoUnitario: number; // BRL
  estoque: number;
};

export type PedidoRevendedor = {
  numero: string;
  data: string; // ISO
  itens: number;
  total: number;
  status: "em-analise" | "confirmado" | "faturado";
};
