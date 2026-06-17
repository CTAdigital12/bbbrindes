import type { Banner } from "@/lib/types";

// Banners do carrossel rotativo do topo (editaveis via CMS na Sprint 5).
// Cada um trabalha uma estrategia diferente.
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
    titulo: "Linha Green",
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
  {
    id: "datas",
    titulo: "Campanhas do mes",
    subtitulo: "Datas comemorativas e sazonais prontas para sua marca.",
    cta: "Ver campanhas",
    href: "/cases",
  },
];

// Banners secundarios (estaticos, tamanhos menores) ao lado do carrossel.
export const miniBanners: Banner[] = [
  {
    id: "infantil",
    titulo: "Linha Infantil",
    subtitulo: "Livre de BPA",
    cta: "Ver linha",
    href: "/catalogo?categoria=infantil",
  },
  {
    id: "to-go",
    titulo: "To go e Viagem",
    subtitulo: "Garrafas e squeezes",
    cta: "Ver linha",
    href: "/catalogo?categoria=to-go-viagem",
  },
];

// Diferenciais (cada um vira link para o destino relacionado).
export const diferenciais: { nome: string; href: string }[] = [
  { nome: "Industria Brasileira", href: "/quem-somos" },
  { nome: "Melhor custo-beneficio", href: "/catalogo?faixa=ate-3-99" },
  { nome: "Entrega garantida", href: "/quem-somos" },
  { nome: "Industria Sustentavel", href: "/catalogo?categoria=ecologicos" },
  { nome: "Atoxidade Certificada", href: "/quem-somos" },
  { nome: "Cores Inovadoras", href: "/catalogo" },
  { nome: "Qualidade Certificada", href: "/quem-somos" },
  { nome: "Livre de BPA", href: "/catalogo?categoria=infantil" },
  { nome: "Uso em Microondas e Lava-loucas", href: "/catalogo" },
];
