// Linha do tempo do Grupo BB (Catalogo 2027). Fonte: mockup da Joy (28/10).
// Usada no teaser compacto (histMini, pagina de produto) e na linha do tempo
// completa do quem-somos. As fotos ficam em public/img/historia/<ano>.webp.

export type Marco = { ano: string; titulo: string; texto: string };

// 2000: abertura da historia (so aparece como passo inicial da timeline).
export const HIST_INTRO =
  "A trajetória do Grupo BB nasceu de uma decisão corajosa. Em Curitiba, no ano 2000, Plínio Bevervanso transformou a compra da flauta de formatura em capital inicial, alugando uma pequena sala de 30 m² por três meses. Um pequeno passo que deu início a uma grande história de sucesso empresarial.";

export const HISTORIA: Marco[] = [
  { ano: "2001", titulo: "BB Business", texto: "A partir de uma parceria especial na sala de aula do curso de administração, nasce a BB Business." },
  { ano: "2002", titulo: "Ecossistema Grupo BB", texto: "O Ecossistema Grupo BB é desenhado e os primeiros funcionários começam a assumir os desafios do empreendimento." },
  { ano: "2003", titulo: "Primeira expansão", texto: "Com crescimento contínuo e busca por inovação e pioneirismo, o Grupo BB conclui sua primeira fase de expansão." },
  { ano: "2004", titulo: "Atuação nacional", texto: "A nova sede e a expansão dos negócios marcam o início da atuação nacional do Grupo, com equipe comercial presente em 9 estados." },
  { ano: "2006", titulo: "Expansão internacional", texto: "Parcerias de negócios para importação de produtos, insumos e equipamentos industriais." },
  { ano: "2007", titulo: "Fábrica na Bahia", texto: "Instalação da unidade na Bahia, consolidando a mudança de portfólio e a produção própria no mercado promocional." },
  { ano: "2010", titulo: "Liga da Esperança", texto: "O Grupo BB cria o projeto social Liga da Esperança para ampliar a empregabilidade, incentivar o desenvolvimento acadêmico e fortalecer a integração comunitária." },
  { ano: "2012", titulo: "Primeiro copo ecossustentável", texto: "Com parceiros de ensino e pesquisa, lança o primeiro copo ecossustentável do Brasil e consolida a construção da Linha Green." },
  { ano: "2015", titulo: "Reconhecimento nos EUA", texto: "O Grupo BB avança na internacionalização em feiras globais e é reconhecido no Going Green Design Point pela Linha Green." },
  { ano: "2022", titulo: "Plasticaria", texto: "Lança a startup cleantech Plasticaria, com a Lowtech, focada em educação ambiental, economia circular e mobiliário de plástico reciclado." },
  { ano: "2024", titulo: "BB Store", texto: "O Grupo lança a BB Store, com e-commerce e presença em marketplaces para atuar em utilidades, giftware e licensing." },
  { ano: "2026", titulo: "BB Plastics", texto: "A BB Plastics amplia sua capacidade produtiva e fortalece a atuação em eletrodomésticos, cosméticos e automotivo." },
];

// Passos da linha do tempo completa: 2000 (abertura) + os 12 marcos.
export const HIST_STEPS: Marco[] = [
  { ano: "2000", titulo: "Como tudo começou", texto: HIST_INTRO },
  ...HISTORIA,
];

// Anos destacados no teaser compacto (histMini) da pagina de produto.
// 2000 nao esta em HISTORIA, entao o teaser mostra 6 marcos.
const HIST_MINI_ANOS = ["2000", "2001", "2004", "2007", "2012", "2022", "2026"];
export const HIST_MINI = HISTORIA.filter((m) => HIST_MINI_ANOS.includes(m.ano));
