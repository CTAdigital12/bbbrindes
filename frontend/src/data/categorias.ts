import type { Categoria } from "@/lib/types";

// Categorias do catalogo (revisao Plinio, 25/06/2026). "Datas Comemorativas"
// saiu da lista de categorias e segue apenas como campanhas sazonais.
export const categorias: Categoria[] = [
  { slug: "green-plasticaria", nome: "Green Plasticaria" },
  { slug: "green-fibras", nome: "Green Fibras" },
  { slug: "copos", nome: "Copos" },
  { slug: "canecas-xicaras", nome: "Canecas e Xicaras" },
  { slug: "chaveiros", nome: "Chaveiros" },
  { slug: "casa-decoracao", nome: "Casa e Decoracao" },
  { slug: "medalhas-trofeus", nome: "Medalhas e Trofeus" },
  { slug: "escritorio", nome: "Escritorio" },
  { slug: "squeezes", nome: "Squeezes" },
  { slug: "bowls-potes", nome: "Bowls, Baldes e Potes" },
  { slug: "to-go-viagem", nome: "To Go / Viagem" },
  { slug: "infantil", nome: "Infantil" },
  { slug: "cordoes-costurados", nome: "Cordoes e Costurados" },
  { slug: "in-mold-label", nome: "In Mold Label" },
  { slug: "projetos-especiais", nome: "Projetos Especiais" },
];

export function nomeCategoria(slug: string): string {
  return categorias.find((c) => c.slug === slug)?.nome ?? slug;
}
