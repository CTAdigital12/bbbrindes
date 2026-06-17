export type Campanha = {
  slug: string;
  nome: string;
  mes: string;
};

// Campanhas sazonais e datas comemorativas. Cada uma serve de destino para
// landing page / anuncio ("campanha do mes"). Editaveis via CMS na Sprint 5.
export const campanhas: Campanha[] = [
  { slug: "carnaval", nome: "Carnaval", mes: "Fevereiro" },
  { slug: "pascoa", nome: "Pascoa", mes: "Marco" },
  { slug: "dia-das-maes", nome: "Dia das Maes", mes: "Maio" },
  { slug: "festa-junina", nome: "Festa Junina", mes: "Junho" },
  { slug: "dia-dos-pais", nome: "Dia dos Pais", mes: "Agosto" },
  { slug: "dia-do-cliente", nome: "Dia do Cliente", mes: "Setembro" },
  { slug: "dia-das-criancas", nome: "Dia das Criancas", mes: "Outubro" },
  { slug: "outubro-rosa", nome: "Outubro Rosa", mes: "Outubro" },
  { slug: "black-friday", nome: "Black Friday", mes: "Novembro" },
  { slug: "natal", nome: "Natal", mes: "Dezembro" },
  { slug: "volta-as-aulas", nome: "Volta as Aulas", mes: "Janeiro" },
  { slug: "ano-novo", nome: "Ano Novo Corporativo", mes: "Janeiro" },
];

export function campanhaPorSlug(slug: string): Campanha | undefined {
  return campanhas.find((c) => c.slug === slug);
}
