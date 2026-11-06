import type { Campanha } from "@/data/campanhas";
import { CAMP_TILE } from "@/data/home-joy";

const MESES = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function imagemCampanha(campanha: Campanha): string | undefined {
  const base = CAMP_TILE[campanha.slug];
  return campanha.imagem || (base ? `/img/banners/home-campanha-${base}.webp` : undefined);
}

// Usa o mes editado no painel, incluindo a virada dezembro/janeiro.
export function ordenarCampanhas(campanhas: Campanha[], monthIdx: number): Campanha[] {
  const atual = ((monthIdx % 12) + 12) % 12;
  const distancia = (campanha: Campanha) => {
    const mes = MESES.indexOf(campanha.mes.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase());
    return mes < 0 ? 12 : (mes - atual + 12) % 12;
  };
  return [...campanhas].sort((a, b) => distancia(a) - distancia(b));
}

// Banners que levam a uma campanha acompanham sua publicacao. Banners de
// catalogo e institucionais mantem seu controle proprio no painel.
export function bannerCampanhaPublicado(href: string, campanhas: Campanha[]): boolean {
  const slug = /^\/campanha\/([^/?#]+)/.exec(href)?.[1];
  return !slug || campanhas.some((campanha) => campanha.slug === slug);
}
