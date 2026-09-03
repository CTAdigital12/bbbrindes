import type { Produto, VariacaoCor } from "@/lib/types";

// Paleta reutilizada nas variacoes de cor.
const C: Record<string, VariacaoCor> = {
  branco: { nome: "Branco", hex: "#f8fafc" },
  preto: { nome: "Preto", hex: "#1c1917" },
  azul: { nome: "Azul", hex: "#1d4ed8" },
  verde: { nome: "Verde", hex: "#15803d" },
  vermelho: { nome: "Vermelho", hex: "#b91c1c" },
  amarelo: { nome: "Amarelo", hex: "#eab308" },
  neon: { nome: "Amarelo Neon", hex: "#c9e62f" },
  laranja: { nome: "Laranja", hex: "#ea580c" },
  natural: { nome: "Natural", hex: "#cbb893" },
};

// Fotos reais do produto-modelo (Squeeze), servidas pelo proprio site (public/).
// Prefixadas com o basePath para funcionar tanto em dev quanto no GitHub Pages.
const SQUEEZE_IMG = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/produtos/squeeze`;

// Materiais e aplicacoes usados nos filtros do catalogo.
export const materiais = ["Plastico", "Inox", "Ceramica", "Bambu", "Vidro", "Fibra natural"];
export const aplicacoes = ["Bebidas", "Escritorio", "Casa", "Eventos", "Infantil", "Esportes"];

// Catalogo mockado. Na producao virao ~1200 SKUs do Payload.
export const produtos: Produto[] = [
  // Produto-modelo da PDP (S03-11), Versao A honesta de docs/pdp-modelo-squeeze.md.
  // So este produto tem `detalhe` preenchido; serve para o cliente ver a estrutura
  // da pagina antes do design final. Campos [PLINIO] ficam em detalhe.pendencias.
  {
    slug: "squeeze-300ml-personalizado",
    nome: "Squeeze 300ml Personalizado",
    categoria: "squeezes",
    descricao:
      "Squeeze de 300 mL em polietileno atoxico e livre de BPA, com personalizacao da sua logomarca. Pedidos a partir de 500 unidades.",
    material: "Polietileno (PEAD + PEBD)",
    aplicacoes: ["Bebidas", "Esportes", "Eventos"],
    // Cores e fotos na MESMA ordem: clicar a cor troca a foto correspondente.
    cores: [C.azul, C.vermelho, C.verde, C.neon, C.laranja, C.branco],
    imagens: [
      `${SQUEEZE_IMG}/azul.webp`,
      `${SQUEEZE_IMG}/vermelho.webp`,
      `${SQUEEZE_IMG}/verde.webp`,
      `${SQUEEZE_IMG}/neon.webp`,
      `${SQUEEZE_IMG}/laranja.webp`,
      `${SQUEEZE_IMG}/branco.webp`,
    ],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["destaque"],
    detalhe: {
      linhaCurta:
        "Squeeze de 300 mL em polietileno atóxico e livre de BPA, com personalização da sua logomarca. Pedidos a partir de 500 unidades.",
      abertura:
        "O Squeeze 300 mL é um brinde promocional prático, leve e funcional, ideal para empresas que querem incentivar hábitos saudáveis enquanto fortalecem a presença da marca no dia a dia de clientes e colaboradores. Fabricado em polietileno atóxico e livre de BPA, oferece alta durabilidade, excelente acabamento e ampla área para personalização, uma solução versátil para campanhas corporativas, eventos e ações de relacionamento.",
      especificacoes: [
        { rotulo: "Material", valor: "Polietileno (PEAD + PEBD), atóxico e livre de BPA" },
        { rotulo: "Capacidade", valor: "300 mL" },
        { rotulo: "Dimensões", valor: "7 (L) × 7 (C) × 13,5 (A) cm" },
        { rotulo: "Peso unitário", valor: "33 g" },
        { rotulo: "Impressão", valor: "Heat transfer e serigrafia cilíndrica" },
        { rotulo: "Área de impressão (transfer)", valor: "1 lado 75 × 50 mm · 2 lados 226 × 50 mm" },
        { rotulo: "Área de impressão (serigrafia)", valor: "1 lado 90 × 48 mm · 2 lados 200 × 48 mm" },
        { rotulo: "Quantidade por caixa", valor: "100 unidades" },
        { rotulo: "NCM", valor: "3924.90.00" },
      ],
      beneficios: [
        "Polietileno atóxico e livre de BPA",
        "Reutilizável, com longa vida útil",
        "Incentiva hábitos saudáveis e hidratação",
        "Design leve, compacto e ergonômico",
        "Excelente área para personalização",
        "Alta resistência para uso diário",
        "Produção nacional com qualidade premium",
        "Excelente custo-benefício para campanhas promocionais",
      ],
      idealPara: [
        "Campanhas de qualidade de vida",
        "SIPAT e programas de saúde ocupacional",
        "Academias e eventos esportivos",
        "Onboarding de colaboradores",
        "Endomarketing e programas de reconhecimento",
        "Convenções e treinamentos",
        "Feiras e congressos",
      ],
      descricaoCompleta: [
        "Pequenos gestos geram grandes conexões. O Squeeze 300 mL foi desenvolvido para transformar um hábito simples, como manter-se hidratado, em uma oportunidade permanente de aproximação entre a sua marca e as pessoas.",
        "Compacto, resistente e fácil de transportar, acompanha a rotina de trabalho, atividades físicas, viagens, eventos e momentos de lazer. A capacidade de 300 mL oferece praticidade para o uso diário, o que faz dele uma opção forte para ações promocionais voltadas à saúde, qualidade de vida e bem-estar.",
        "Fabricado em polietileno atóxico e livre de BPA, o squeeze entrega resistência ao uso contínuo, longa vida útil e excelente acabamento. O design ergonômico facilita o manuseio, e a ampla área de personalização garante visibilidade da marca durante toda a vida útil do produto.",
        "Por ser reutilizável, o Squeeze 300 mL reduz o consumo de embalagens descartáveis e alinha a sua empresa a práticas de consumo consciente. É um brinde que entrega utilidade, valor percebido e presença constante da marca.",
        "Produzido pela BB Brindes, indústria nacional com fábrica própria e mais de 25 anos de mercado, o produto reúne qualidade premium, fabricação nacional e capacidade de atendimento para projetos de qualquer porte.",
      ],
      diferenciais: [
        "Fabricação própria, indústria nacional",
        "Personalização de alta qualidade",
        "Produção para pequenos e grandes volumes",
        "Mais de 25 anos de experiência em brindes promocionais",
        "Desenvolvimento de projetos especiais sob demanda",
      ],
      selos: ["Livre de BPA", "Uso permanente", "Produto reciclável"],
      faq: [
        {
          pergunta: "Qual o pedido mínimo do Squeeze 300 mL?",
          resposta: "O pedido mínimo é de 500 unidades.",
          aConfirmar: true,
        },
        {
          pergunta: "De que material é feito o Squeeze 300 mL?",
          resposta:
            "O Squeeze 300 mL é fabricado em polietileno (PEAD + PEBD), atóxico e livre de BPA.",
          aConfirmar: true,
        },
        {
          pergunta: "Como é feita a personalização com a logomarca?",
          resposta:
            "A personalização é feita por heat transfer ou serigrafia cilíndrica. A área de impressão é de 75 × 50 mm em um lado, ou 226 × 50 mm em dois lados. Desenvolvemos o layout com a sua logomarca e enviamos para aprovação antes de iniciar a produção.",
        },
        {
          pergunta: "O Squeeze 300 mL pode ir na lava-louças ou no microondas?",
          resposta:
            "Não. Este produto não tem indicação para lava-louças nem para microondas. Recomendamos lavagem manual com água e detergente neutro.",
        },
        {
          pergunta: "Quanto tempo leva a produção?",
          resposta: "Prazo de produção por faixa de volume.",
          aConfirmar: true,
        },
        {
          pergunta: "Quantas unidades vêm por caixa?",
          resposta:
            "Cada caixa master leva 100 unidades e pesa 3,76 kg, com dimensões de 37 × 37 × 56,5 cm.",
        },
      ],
      pendencias: [
        "Material: a planilha registra PEAD + PEBD, mas o texto comercial diz PP. As duas versões não podem coexistir; o cliente confirma qual é o correto.",
        "Pedido mínimo: 500 vs. 100 unidades.",
        "Prazo real de produção por faixa de volume.",
      ],
    },
  },
  {
    slug: "squeeze-eco-500ml",
    nome: "Squeeze Ecologico 500ml",
    categoria: "green-plasticaria",
    descricao: "Squeeze sustentavel para personalizacao, ideal para acoes de marca com pegada ecologica.",
    material: "Plastico",
    aplicacoes: ["Bebidas", "Esportes"],
    cores: [C.branco, C.azul, C.verde, C.preto],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["destaque", "mais-vendido"],
  },
  {
    slug: "caneca-ceramica-325ml",
    nome: "Caneca de Ceramica 325ml",
    categoria: "canecas-xicaras",
    descricao: "Caneca classica de ceramica para personalizacao por sublimacao.",
    material: "Ceramica",
    aplicacoes: ["Bebidas", "Casa"],
    cores: [C.branco, C.preto, C.vermelho],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["mais-vendido"],
  },
  {
    slug: "copo-bambu-400ml",
    nome: "Copo de Bambu 400ml",
    categoria: "green-fibras",
    descricao: "Copo de fibra de bambu reutilizavel, leve e resistente.",
    material: "Bambu",
    aplicacoes: ["Bebidas", "Casa"],
    cores: [C.natural, C.verde],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["destaque", "lancamento"],
  },
  {
    slug: "caneta-eco-semente",
    nome: "Caneta Ecologica com Semente",
    categoria: "escritorio",
    descricao: "Caneta plantavel: ao fim do uso, a ponta vira muda. Forte apelo sustentavel.",
    material: "Fibra natural",
    aplicacoes: ["Escritorio", "Eventos"],
    cores: [C.natural, C.verde, C.azul],
    personalizavel: true,
    faixaPreco: "ate-3-99",
    destaques: ["destaque"],
  },
  {
    slug: "garrafa-inox-750ml",
    nome: "Garrafa Termica Inox 750ml",
    categoria: "to-go-viagem",
    descricao: "Garrafa termica de inox com parede dupla, mantem a temperatura por horas.",
    material: "Inox",
    aplicacoes: ["Bebidas", "Esportes"],
    cores: [C.preto, C.azul, C.vermelho, C.branco],
    personalizavel: true,
    faixaPreco: "acima-de-15",
    destaques: ["lancamento", "mais-vendido"],
  },
  {
    slug: "taca-acrilica-300ml",
    nome: "Taca Acrilica 300ml",
    categoria: "copos",
    descricao: "Taca de acrilico resistente para eventos e brindes.",
    material: "Plastico",
    aplicacoes: ["Bebidas", "Eventos"],
    cores: [C.branco, C.preto],
    personalizavel: false,
    faixaPreco: "ate-3-99",
    destaques: [],
  },
  {
    slug: "bowl-melamina-500ml",
    nome: "Bowl de Melamina 500ml",
    categoria: "bowls-potes",
    descricao: "Bowl duravel para uso diario, empilhavel.",
    material: "Plastico",
    aplicacoes: ["Casa"],
    cores: [C.verde, C.laranja, C.amarelo],
    personalizavel: false,
    faixaPreco: "4-a-15",
    destaques: [],
  },
  {
    slug: "copo-infantil-300ml",
    nome: "Copo Infantil com Tampa 300ml",
    categoria: "infantil",
    descricao: "Copo infantil com tampa e bico, livre de BPA.",
    material: "Plastico",
    aplicacoes: ["Infantil", "Casa"],
    cores: [C.azul, C.vermelho, C.amarelo, C.verde],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["lancamento"],
  },
  {
    slug: "cordao-personalizado",
    nome: "Cordao Personalizado para Cracha",
    categoria: "cordoes-costurados",
    descricao: "Cordao de poliester com impressao da marca, para eventos e empresas.",
    material: "Fibra natural",
    aplicacoes: ["Eventos", "Escritorio"],
    cores: [C.preto, C.azul, C.vermelho, C.verde],
    personalizavel: true,
    faixaPreco: "ate-3-99",
    destaques: ["mais-vendido"],
  },
  {
    slug: "kit-natal-caneca",
    nome: "Caneca Edicao Datas Comemorativas",
    categoria: "canecas-xicaras",
    descricao: "Caneca tematica para campanhas sazonais (Natal, dia das maes e outras).",
    material: "Ceramica",
    aplicacoes: ["Bebidas", "Eventos"],
    cores: [C.branco, C.vermelho],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["destaque"],
  },
  {
    slug: "squeeze-aluminio-600ml",
    nome: "Squeeze de Aluminio 600ml",
    categoria: "squeezes",
    descricao: "Squeeze leve de aluminio com mosquetao, ideal para esportes.",
    material: "Inox",
    aplicacoes: ["Bebidas", "Esportes"],
    cores: [C.preto, C.azul, C.vermelho, C.amarelo],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["mais-vendido"],
  },
  {
    slug: "bloco-anotacoes-eco",
    nome: "Bloco de Anotacoes Ecologico",
    categoria: "escritorio",
    descricao: "Bloco com capa de papel reciclado e caneta de semente inclusa.",
    material: "Fibra natural",
    aplicacoes: ["Escritorio", "Eventos"],
    cores: [C.natural],
    personalizavel: true,
    faixaPreco: "4-a-15",
    destaques: ["lancamento"],
  },
  {
    slug: "ecobag-algodao-cru",
    nome: "Ecobag de Algodao Cru",
    categoria: "green-fibras",
    descricao: "Sacola reutilizavel de algodao cru, alternativa sustentavel a sacola plastica.",
    material: "Fibra natural",
    aplicacoes: ["Eventos", "Casa"],
    cores: [C.natural, C.verde],
    personalizavel: true,
    faixaPreco: "ate-3-99",
    destaques: ["lancamento"],
  },
];

export function produtoPorSlug(slug: string): Produto | undefined {
  return produtos.find((p) => p.slug === slug);
}

// Tags que diferenciam de verdade (ex.: Ecologico). No wireframe sao derivadas;
// na producao virao explicitas do Payload. "Personalizavel" nao e tag (todos sao).
// Regra unica de "produto ecologico", reusada nas tags e na faixa de Brindes Ecologicos.
export function ehEcologico(p: Produto): boolean {
  return (
    p.categoria === "green-plasticaria" ||
    p.categoria === "green-fibras" ||
    p.categoria === "medalhas-trofeus" ||
    p.material === "Bambu" ||
    p.material === "Fibra natural" ||
    /ecolog/i.test(p.nome)
  );
}

export function tagsDoProduto(p: Produto): string[] {
  const tags = p.tags ? [...p.tags] : [];
  if (ehEcologico(p) && !tags.includes("Ecologico")) tags.push("Ecologico");
  return tags;
}

export function produtosEcologicos(): Produto[] {
  return produtos.filter(ehEcologico);
}

export function produtosPorDestaque(tipo: Produto["destaques"][number]): Produto[] {
  return produtos.filter((p) => p.destaques.includes(tipo));
}

export const faixaPrecoLabels: Record<Produto["faixaPreco"], string> = {
  "ate-3-99": "Ate R$ 3,99",
  "4-a-15": "R$ 4 a R$ 15",
  "acima-de-15": "Acima de R$ 15",
};
