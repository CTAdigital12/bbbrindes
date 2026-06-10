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
