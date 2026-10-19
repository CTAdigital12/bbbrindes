// Conteudo de marketing da home, portado VERBATIM do mockup funcional da Joy
// (memory/mockup-ref/mockup-js.js). Texto PT-BR do mockup; o cliente refina
// depois. As rotas em hash (#/...) do mockup foram convertidas para o App Router
// (ex.: #/catalogo?cat=X -> /catalogo?categoria=X). Os produtos e categorias NAO
// moram aqui: vem do Payload (getProdutos/getCategorias).

export const WA = "https://wa.me/5571994160138";

// Sem viuva: troca o ultimo espaco por um espaco inquebravel ( ). Espelha o
// helper nb() do mockup, mas devolvendo o caractere (nao a entidade &nbsp;),
// para renderizar como texto puro no React.
export function nb(s: string): string {
  return s.replace(/ (\S+)$/, " $1");
}

export type HeroSlide = {
  key: string;
  theme: "dark" | "cream";
  tag: string;
  icon: string;
  // title/sub vem com HTML do mockup (<span class="hl"> e &nbsp;); renderizados
  // com dangerouslySetInnerHTML no HeroSlider.
  title: string;
  sub: string;
  cta: string;
  href: string;
};

// Banner rotativo de cada mes (1 por mes). Copy provisoria do mockup.
export const MESES: HeroSlide[] = [
  { key: "01-jan-volta-as-aulas", theme: "dark", tag: "Volta às aulas + verão", icon: "sun", title: 'O verão inteiro com a <span class="hl">sua&nbsp;marca</span>', sub: "Squeezes e copos personalizados para hidratar equipes, alunos e clientes nos dias quentes.", cta: "Ver squeezes", href: "/catalogo?categoria=squeezes" },
  { key: "02-fev-carnaval", theme: "cream", tag: "Carnaval", icon: "sparkles", title: 'Sua marca no <span class="hl">bloco&nbsp;inteiro</span>', sub: "Copos e squeezes resistentes para eventos, festas e ações de rua com a sua logomarca.", cta: "Ver brindes para eventos", href: "/campanha/carnaval" },
  { key: "03-mar-consumidor-e-agua", theme: "dark", tag: "Dia do Consumidor · Dia da Água", icon: "droplet", title: 'Água por perto, <span class="hl">marca na&nbsp;memória</span>', sub: "Squeezes reutilizáveis e livres de BPA para as campanhas de março com quem consome a sua marca.", cta: "Ver squeezes", href: "/catalogo?categoria=squeezes" },
  { key: "04-abr-pascoa", theme: "cream", tag: "Páscoa", icon: "egg", title: 'Páscoa que fica <span class="hl">depois do&nbsp;chocolate</span>', sub: "Bowls e brindes infantis personalizados para ações com clientes, colaboradores e famílias.", cta: "Ver linha infantil", href: "/catalogo?categoria=infantil" },
  { key: "05-mai-dia-das-maes", theme: "dark", tag: "Dia das Mães", icon: "heart", title: 'Homenagem que vai para a <span class="hl">mesa do&nbsp;café</span>', sub: "Canecas e xícaras personalizadas para celebrar as mães da sua equipe e da sua carteira.", cta: "Ver brindes para Dia das Mães", href: "/campanha/dia-das-maes" },
  { key: "06-jun-festa-junina", theme: "cream", tag: "Festas juninas + inverno", icon: "snowflake", title: 'Arraiá quentinho com a <span class="hl">sua&nbsp;marca</span>', sub: "Canecas térmicas personalizadas para as festas de junho e para os dias frios do escritório.", cta: "Ver canecas", href: "/catalogo?categoria=canecas-xicaras" },
  { key: "07-jul-sipat", theme: "dark", tag: "SIPAT", icon: "helmet", title: 'Segurança lembrada <span class="hl">o ano&nbsp;todo</span>', sub: "Squeezes e copos que mantêm a mensagem da SIPAT na rotina do colaborador depois da semana.", cta: "Ver brindes para SIPAT", href: "/catalogo?categoria=squeezes" },
  { key: "08-ago-dia-dos-pais", theme: "cream", tag: "Dia dos Pais", icon: "tie", title: 'Presente que entra <span class="hl">na rotina&nbsp;dele</span>', sub: "Canecas, copos e itens to go personalizados para homenagear os pais da sua empresa.", cta: "Ver brindes para Dia dos Pais", href: "/campanha/dia-dos-pais" },
  { key: "09-set-dia-do-cliente", theme: "dark", tag: "Dia do Cliente", icon: "gift", title: 'Agradeça a quem <span class="hl">escolhe a sua&nbsp;marca</span>', sub: "Kits e canecas personalizados para o Dia do Cliente, de 500 a milhares de unidades.", cta: "Ver brindes para Dia do Cliente", href: "/campanha/dia-do-cliente" },
  { key: "10-out-dia-das-criancas", theme: "cream", tag: "Dia das Crianças", icon: "horse-toy", title: 'Brincadeira com a <span class="hl">marca da&nbsp;empresa</span>', sub: "Ioiô, cofrinho, pega-varetas e canecas infantis para ações com os filhos dos colaboradores.", cta: "Ver linha infantil", href: "/campanha/dia-das-criancas" },
  { key: "11-nov-black-friday", theme: "dark", tag: "Black Friday", icon: "tag", title: 'Black Friday direto da <span class="hl">fábrica</span>', sub: "Copos, canecas, squeezes e bowls personalizados com produção própria e entrega nacional.", cta: "Ver catálogo completo", href: "/catalogo" },
  { key: "12-dez-natal", theme: "dark", tag: "Natal", icon: "christmas-tree", title: 'Brindes de Natal que <span class="hl">ficam em&nbsp;uso</span>', sub: "Kits, canecas e bowls personalizados que continuam na mesa do cliente em janeiro.", cta: "Ver brindes de Natal", href: "/campanha/natal" },
];

// Banners fixos (2), intercalados entre o banner do mes.
export const FIXOS: HeroSlide[] = [
  { key: "fixo-1-fabrica-propria", theme: "dark", tag: "Fábrica própria", icon: "building-factory-2", title: 'Somos <span class="hl">fábrica,</span> não&nbsp;revenda', sub: "Mais de 25 anos fabricando brindes personalizados no Brasil, com homologação Nestlé e Coca-Cola.", cta: "Conheça a BB", href: "/quem-somos" },
  { key: "fixo-2-linha-ecologica", theme: "cream", tag: "Linha ecológica", icon: "leaf", title: 'Brindes que <span class="hl">duram,</span> não&nbsp;descartáveis', sub: "Produtos reutilizáveis, recicláveis e livres de BPA, fabricados no Brasil.", cta: "Ver linha ecológica", href: "/catalogo?categoria=green-fibras" },
];

// Ordem dos slides do mockup: banner do mes + 2 fixos, depois os demais meses em
// sequencia. No site real seria so o do mes + 2 fixos; aqui mantem a vitrine
// completa do mockup. monthIdx = mes corrente (0-11), resolvido no build.
export function orderedHeroSlides(monthIdx: number): HeroSlide[] {
  const m = ((monthIdx % 12) + 12) % 12;
  return [MESES[m], FIXOS[0], FIXOS[1], ...MESES.slice(m + 1), ...MESES.slice(0, m)];
}

// Faixa de confianca (4 itens) logo apos o hero.
export const TRUST: [icon: string, titulo: string, sub: string][] = [
  ["building-factory-2", "Fábrica própria há 27 anos", "Do molde à entrega, sem intermediário"],
  ["package", "A partir de 500 unidades", "Do pedido de evento ao volume nacional"],
  ["truck-delivery", "Entrega para todo o Brasil", "Prazo combinado no orçamento"],
  ["certificate", "Qualidade certificada", "SGP, GMP, NM300 e SMETA"],
];

// Logos da marquee (duplicados no render para o loop continuo). /img/logos/*.svg
export const LOGOS = [
  "coca-cola", "nestle", "banco-do-brasil", "ambev", "heineken", "bradesco",
  "braskem", "google", "fedex", "scania", "positivo", "levis", "oral-b",
  "anglo-american", "devassa",
];

// Diferenciais (slug do icone diferencial-<slug>.svg, titulo, descricao).
export const DIF: [slug: string, titulo: string, sub: string][] = [
  ["industria-brasileira", "Indústria brasileira", "Produção nacional, do molde à entrega"],
  ["melhor-custo-beneficio", "Melhor custo-benefício", "Preço de fábrica, sem intermediário"],
  ["entrega-garantida", "Entrega garantida", "Prazo combinado e acompanhado"],
  ["industria-sustentavel", "Indústria sustentável", "Fibras naturais de coco e madeira de reflorestamento"],
  ["atoxidade-certificada", "Atoxidade certificada", "Para itens com contato com alimento"],
  ["cores-inovadoras", "Cores inovadoras", "Linhas Colors para combinar com a sua marca"],
  ["qualidade-certificada", "Qualidade certificada", "SGP, PS&C, GMP, NM300 e SMETA 4 Pilares"],
  ["livre-de-bpa", "Livre de BPA", "Seguro para o uso diário"],
  ["microondas-e-lava-loucas", "Microondas e lava-louças", "Uso permanente, não descartável"],
];

// Cases ilustrativos (cliente, segmento, titulo, imagem local). Link -> /cases.
export const CASES: [cliente: string, segmento: string, titulo: string, img: string][] = [
  ["Coca-Cola", "Bebidas", "Squeezes personalizados para campanha de verão", "/img/foto/MV01113-squeeze-550ml.webp"],
  ["Ambev", "Bebidas", "Copos para ativação em evento", "/img/foto/MV01147-copo-mini-roma-cristal-300ml.webp"],
  ["Nestlé", "Alimentos", "Canecas ecológicas para endomarketing", "/img/foto/MV01215-caneca-quadrada-250ml.webp"],
];

// Cases completos (6) para a pagina /cases, portados do array CASES(6) do mockup
// (casesHTML(6)). Ilustrativos: imagem de produto como stand-in + chip "Ilustrativo".
// O home-joy CASES (3 itens, acima) alimenta a secao da home; este os 6 da pagina.
export const CASES6: [cliente: string, segmento: string, titulo: string, img: string][] = [
  ["Coca-Cola", "Bebidas", "Squeezes personalizados para campanha de verão", "/img/foto/MV01113-squeeze-550ml.webp"],
  ["Ambev", "Bebidas", "Copos para ativação em evento", "/img/foto/MV01147-copo-mini-roma-cristal-300ml.webp"],
  ["Nestlé", "Alimentos", "Canecas ecológicas para endomarketing", "/img/foto/MV01215-caneca-quadrada-250ml.webp"],
  ["PicPay", "Financeiro", "Canecas Green Fibras para o time", "/img/foto/MV02215GC-caneca-quadrada-ecologica-green-fibras-colors.webp"],
  ["Jeep", "Automotivo", "Itens to go para o pós-venda", "/img/foto/MV02277G-mariner-box-plus-ecologico-green-fibras.webp"],
  ["Claro", "Telecom", "Canecas térmicas para ação de inverno", "/img/foto/MV02251GC-caneca-termica-color-300ml-ecologica-green-fibras-colors.webp"],
];

// Depoimentos da secao de cases.
export const QUOTES: [texto: string, autor: string][] = [
  ["“Vocês foram brilhantes. Os brindes ficaram lindos. Cumpriram os prazos com excelência.”", "Lilian Bueno · Braskem"],
  ["“O produto que recebi é de excelente qualidade e o pedido foi entregue corretamente, antes mesmo do combinado.”", "Wilson Dias Lima · TOP Fitness"],
];

// Imprensa (veiculo, chamada). Link -> /imprensa.
export const PRESS: [veiculo: string, titulo: string][] = [
  ["Valor Econômico", "Indústria baiana amplia produção de brindes sustentáveis"],
  ["Exame", "O que as empresas buscam em brindes corporativos em 2026"],
  ["Meio & Mensagem", "Como uma indústria nacional entrega campanhas em escala"],
];

// Blog (titulo, resumo, imagem local). Link -> /blog.
export const POSTS: [titulo: string, resumo: string, img: string][] = [
  ["Brindes de Natal corporativos: o guia para fechar sem correria", "Quando fechar, o que pedir e como evitar a fila de fim de ano.", "/img/foto/MV02406GC-super-bowl-green-fibras-colors-500ml.webp"],
  ["Brindes para SIPAT: como escolher o produto certo para a semana de segurança", "O brinde que mantém a mensagem viva depois da semana.", "/img/foto/MV01114-squeeze-750ml.webp"],
  ["Fabricante ou revendedor: o que muda no seu pedido de brindes", "Prazo, preço e padrão de qualidade lado a lado.", "/img/foto/MV02280G-porta-talheres-trio-ecologico-green-fibras.webp"],
];

// FAQ (pergunta, resposta). O primeiro item abre por padrao.
export const FAQ: [pergunta: string, resposta: string][] = [
  ["Qual é o pedido mínimo?", "A maioria dos produtos é personalizada a partir de 500 unidades. O especialista confirma o mínimo de cada item no orçamento."],
  ["Com quanto tempo de antecedência preciso fechar?", "Recomendamos fechar com 40 a 60 dias de antecedência. Para o Natal, o ideal é fechar até o fim de outubro, porque a produção de fim de ano é o pico do setor."],
  ["Como a minha marca é aplicada?", "Por transfer ou serigrafia, conforme o produto. A área de impressão de cada item está na página do produto."],
  ["Os produtos são atóxicos?", "Os itens com contato com alimento (copos, canecas, squeezes e bowls) têm atoxidade certificada e são livres de BPA."],
  ["Vocês entregam em todo o Brasil?", "Sim. A BB Brindes, empresa do Grupo BB, fabrica no Brasil e entrega para todo o país."],
];

// slug da categoria (getCategorias) -> nome do arquivo do icone em /img/icones/.
// Os slugs reais batem com os do mockup, mas os nomes de arquivo variam
// (ex.: canecas-xicaras -> categoria-canecas-e-xicaras.svg).
export const CAT_ICON: Record<string, string> = {
  "green-plasticaria": "categoria-green-plasticaria",
  "green-fibras": "categoria-green-fibras",
  "medalhas-trofeus": "categoria-medalhas-e-trofeus",
  copos: "categoria-copos",
  "canecas-xicaras": "categoria-canecas-e-xicaras",
  chaveiros: "categoria-chaveiros",
  "casa-decoracao": "categoria-casa-e-decoracao",
  escritorio: "categoria-escritorio",
  squeezes: "categoria-squeezes",
  "bowls-potes": "categoria-bowls-baldes-e-potes",
  "to-go-viagem": "categoria-to-go-e-viagem",
  infantil: "categoria-infantil",
  "cordoes-costurados": "categoria-cordoes-e-costurados",
  "in-mold-label": "categoria-in-mold-label",
  "projetos-especiais": "categoria-projetos-especiais",
};

// slug da campanha (getCampanhas) -> base do arquivo do tile em /img/banners/
// (home-campanha-<base>.webp). Campanhas sem entrada aqui (ex.: ano-novo) nao
// tem tile e sao omitidas da grade.
export const CAMP_TILE: Record<string, string> = {
  carnaval: "carnaval",
  "dia-da-mulher": "dia-da-mulher",
  pascoa: "pascoa",
  "dia-das-maes": "dia-das-maes",
  "festa-junina": "festa-junina",
  "dia-dos-pais": "dia-dos-pais",
  "dia-do-cliente": "dia-do-cliente",
  "dia-das-criancas": "dia-das-criancas",
  "outubro-rosa": "outubro-rosa",
  "black-friday": "black-friday",
  natal: "natal",
  "volta-as-aulas": "volta-s-aulas",
};

// As 2 proximas datas (badge "PROXIMA" nos tiles), a partir do mes corrente.
// Portado do nextCamps() do mockup. Resolvido no build.
export function nextCamps(monthIdx: number): string[] {
  const order = [
    "volta-as-aulas", "carnaval", "dia-da-mulher", "pascoa", "dia-das-maes",
    "festa-junina", "dia-dos-pais", "dia-do-cliente", "dia-das-criancas",
    "outubro-rosa", "black-friday", "natal",
  ];
  // Mapeia o mes corrente para a campanha vigente na ordem acima.
  const mi: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 6, 8: 7, 9: 8, 10: 10, 11: 11 };
  const cur = ((monthIdx % 12) + 12) % 12;
  const curSlug = cur >= 10 ? "black-friday" : order[mi[cur]];
  const idx = order.indexOf(curSlug);
  return [order[(idx + 1) % 12], order[(idx + 2) % 12]];
}
