// Tipos do dominio (wireframe). Espelham a estrutura que sera modelada no Payload (Sprint 1).

export type Categoria = {
  slug: string;
  nome: string;
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
};

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string;
  cta: string;
  href: string;
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
