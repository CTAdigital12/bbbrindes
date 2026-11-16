export type Campanha = {
  slug: string;
  nome: string;
  mes: string;
  // Campos ricos vindos do Payload (collection Campanhas). Opcionais: o mock so
  // registra slug/nome/mes; os campos ricos sao preenchidos pelo painel.
  chamada?: string; // subtitulo do hero
  imagem?: string; // URL da media (hero da campanha)
  conteudo?: string; // texto da landing (richText achatado em texto)
  produtos?: string[]; // slugs dos produtos em destaque
};

// Base historica usada apenas pela migracao seed-campanhas.ts. O site publico
// le os cadastros reais de Campanhas; esta lista nao e fallback de publicacao.
export const campanhas: Campanha[] = [
  { slug: "carnaval", nome: "Carnaval", mes: "Fevereiro" },
  { slug: "dia-da-mulher", nome: "Dia da Mulher", mes: "Março" },
  { slug: "pascoa", nome: "Páscoa", mes: "Março" },
  { slug: "dia-das-maes", nome: "Dia das Maes", mes: "Maio" },
  { slug: "festa-junina", nome: "Festa Junina", mes: "Junho" },
  { slug: "dia-dos-pais", nome: "Dia dos Pais", mes: "Agosto" },
  { slug: "dia-do-cliente", nome: "Dia do Cliente", mes: "Setembro" },
  { slug: "dia-das-criancas", nome: "Dia das Criancas", mes: "Outubro" },
  { slug: "outubro-rosa", nome: "Outubro Rosa", mes: "Outubro" },
  { slug: "black-friday", nome: "Black Friday", mes: "Novembro" },
  { slug: "natal", nome: "Natal", mes: "Dezembro" },
  { slug: "volta-as-aulas", nome: "Volta às Aulas", mes: "Janeiro" },
  { slug: "ano-novo", nome: "Ano Novo Corporativo", mes: "Janeiro" },
  // Datas comemorativas adicionais. Sem arte no CAMP_TILE ainda: o seed cria
  // sem imagem (fundo verde padrao do front) ate subirem o banner no painel.
  { slug: "dia-do-consumidor", nome: "Dia do Consumidor", mes: "Março" },
  { slug: "dia-mundial-da-agua", nome: "Dia Mundial da Água", mes: "Março" },
  { slug: "dia-mundial-da-saude", nome: "Dia Mundial da Saúde", mes: "Abril" },
  { slug: "dia-do-trabalhador", nome: "Dia do Trabalhador", mes: "Maio" },
  { slug: "dia-mundial-do-meio-ambiente", nome: "Dia Mundial do Meio Ambiente", mes: "Junho" },
  { slug: "dia-dos-namorados", nome: "Dia dos Namorados", mes: "Junho" },
  { slug: "inverno", nome: "Inverno", mes: "Junho" },
  { slug: "setembro-amarelo", nome: "Setembro Amarelo", mes: "Setembro" },
  { slug: "dia-do-vendedor", nome: "Dia do Vendedor", mes: "Outubro" },
  { slug: "novembro-azul", nome: "Novembro Azul", mes: "Novembro" },
  { slug: "final-de-ano", nome: "Final de Ano", mes: "Dezembro" },
  { slug: "verao", nome: "Verão", mes: "Dezembro" },
];

export function campanhaPorSlug(slug: string): Campanha | undefined {
  return campanhas.find((c) => c.slug === slug);
}
