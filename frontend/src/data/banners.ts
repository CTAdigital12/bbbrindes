import type { Banner } from "@/lib/types";

// Banners de campanha (editaveis via CMS na Sprint 5). Espelham as campanhas do site atual.
export const banners: Banner[] = [
  {
    id: "copa-2026",
    titulo: "Copa do Mundo 2026",
    subtitulo: "Linha tematica para ativar sua marca no maior evento do ano.",
    cta: "Ver linha",
    href: "/catalogo",
  },
  {
    id: "ecologicos",
    titulo: "Brindes Ecologicos",
    subtitulo: "Industria sustentavel, produtos livres de BPA e cores inovadoras.",
    cta: "Conhecer Linha Green",
    href: "/catalogo?categoria=ecologicos",
  },
  {
    id: "economicos",
    titulo: "Brindes ate R$ 3,99",
    subtitulo: "Custo-beneficio para acoes de grande volume.",
    cta: "Ver ofertas",
    href: "/catalogo?faixa=ate-3-99",
  },
];

// Blocos de diferenciais (nove pilares do site atual).
export const diferenciais: string[] = [
  "Industria Brasileira",
  "Melhor custo-beneficio",
  "Entrega garantida",
  "Industria Sustentavel",
  "Atoxidade Certificada",
  "Cores Inovadoras",
  "Qualidade Certificada",
  "Livre de BPA",
  "Uso em Microondas e Lava-loucas",
];

// Linhas visuais de produto destacadas na home.
export const linhasVisuais: { nome: string; href: string }[] = [
  { nome: "Linha Green", href: "/catalogo?categoria=ecologicos" },
  { nome: "Casa e Escritorio", href: "/catalogo?categoria=escritorio" },
  { nome: "Dia a Dia", href: "/catalogo" },
  { nome: "Festa", href: "/catalogo?categoria=copos-tacas" },
  { nome: "Infantil", href: "/catalogo?categoria=infantil" },
  { nome: "Datas Comemorativas", href: "/catalogo?categoria=datas-comemorativas" },
];
