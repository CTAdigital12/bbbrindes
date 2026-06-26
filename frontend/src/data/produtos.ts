import type { Produto, VariacaoCor } from "@/lib/types";

// Paleta reutilizada nas variacoes de cor.
const C: Record<string, VariacaoCor> = {
  branco: { nome: "Branco", hex: "#f8fafc" },
  preto: { nome: "Preto", hex: "#1c1917" },
  azul: { nome: "Azul", hex: "#1d4ed8" },
  verde: { nome: "Verde", hex: "#15803d" },
  vermelho: { nome: "Vermelho", hex: "#b91c1c" },
  amarelo: { nome: "Amarelo", hex: "#eab308" },
  laranja: { nome: "Laranja", hex: "#ea580c" },
  natural: { nome: "Natural", hex: "#cbb893" },
};

// Materiais e aplicacoes usados nos filtros do catalogo.
export const materiais = ["Plastico", "Inox", "Ceramica", "Bambu", "Vidro", "Fibra natural"];
export const aplicacoes = ["Bebidas", "Escritorio", "Casa", "Eventos", "Infantil", "Esportes"];

// Catalogo mockado. Na producao virao ~1200 SKUs do Payload.
export const produtos: Produto[] = [
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
