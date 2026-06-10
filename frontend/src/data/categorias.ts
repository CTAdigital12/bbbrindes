import type { Categoria } from "@/lib/types";

// Categorias espelhando o menu do site atual (bbbrindes.com.br).
export const categorias: Categoria[] = [
  { slug: "ecologicos", nome: "Brindes Ecologicos" },
  { slug: "copos-tacas", nome: "Copos e Tacas" },
  { slug: "canecas-xicaras", nome: "Canecas e Xicaras" },
  { slug: "squeeze", nome: "Squeeze Personalizado" },
  { slug: "escritorio", nome: "Escritorio" },
  { slug: "bowls-potes", nome: "Bowls, Baldes e Potes" },
  { slug: "infantil", nome: "Infantil" },
  { slug: "to-go-viagem", nome: "To go e Viagem" },
  { slug: "cordoes", nome: "Cordoes e Costurados" },
  { slug: "datas-comemorativas", nome: "Datas Comemorativas" },
];

export function nomeCategoria(slug: string): string {
  return categorias.find((c) => c.slug === slug)?.nome ?? slug;
}
