import type { Categoria } from "@/lib/types";

// Categorias do catalogo (revisao Plinio, 30/06/2026). Green Plasticaria,
// Green Fibras e Medalhas e Trofeus formam a familia "Ecologicos" e ficam
// agrupadas no topo. "Datas Comemorativas" segue so como campanhas sazonais.
export const categorias: Categoria[] = [
  { slug: "green-plasticaria", nome: "Ecologicos - Green Plasticaria" },
  { slug: "green-fibras", nome: "Ecologicos - Green Fibras" },
  { slug: "medalhas-trofeus", nome: "Ecologicos - Medalhas e Trofeus" },
  { slug: "copos", nome: "Copos" },
  { slug: "canecas-xicaras", nome: "Canecas e Xicaras" },
  { slug: "chaveiros", nome: "Chaveiros" },
  { slug: "casa-decoracao", nome: "Casa e Decoracao" },
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
