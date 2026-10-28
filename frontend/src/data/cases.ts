import type { Case } from "@/lib/types";

// Cases REAIS do cliente (doc "ok_cases de sucesso", Drive). Este arquivo e o
// fallback de getCases() (lib/content.ts): so aparece se a collection `cases`
// do Payload vier vazia ou o backend cair. Espelha os 19 cases publicados no
// backend (mesmos clientes/titulos/resumos), pra nunca mostrar case que o
// cliente nao aprovou. Os exemplos ILUSTRATIVOS antigos (Ambev, Natura, Sicredi,
// Localiza, Prefeitura) foram removidos em 28/10. Os 13 ultimos foram semeados
// via REST (seed-cases-rest.mjs) a partir do mesmo doc; textos condensados em 1
// frase no mesmo estilo, nada inventado.
export const cases: Case[] = [
  {
    slug: "abridor-contour-personalizado",
    cliente: "Coca-Cola",
    segmento: "Bebidas · Brinde funcional",
    titulo: "Abridor Contour personalizado",
    resumo:
      "A identidade da garrafa Contour aplicada a um acessório funcional em ABS, unindo referência visual reconhecível e utilidade.",
  },
  {
    slug: "replica-da-taca-personalizada",
    cliente: "Stella Artois",
    segmento: "Bebidas · Ativação de marca",
    titulo: "Réplica da taça personalizada",
    resumo:
      "Desenvolvimento industrial em SAN (injeção e sopro) com acabamento em hot stamping, para levar a taça da marca a ambientes onde o vidro não era permitido.",
  },
  {
    slug: "bowl-coracao-personalizado",
    cliente: "Nestlé",
    segmento: "Alimentos · Relacionamento",
    titulo: "Bowl Coração personalizado",
    resumo:
      "Um formato diferenciado para unir utilidade e expressão de marca, onde a própria geometria do produto participa da comunicação.",
  },
  {
    slug: "porta-capsulas-para-o-e-commerce-oficial",
    cliente: "Nescafé Dolce Gusto",
    segmento: "Bebidas · E-commerce",
    titulo: "Porta-cápsulas para o e-commerce oficial",
    resumo:
      "Design e organização como parte da experiência de consumo de café: diversos formatos de porta-cápsulas desenvolvidos para o e-commerce oficial da marca.",
  },
  {
    slug: "mini-bowl-colecionavel-para-volta-as-aulas",
    cliente: "Del Valle",
    segmento: "Bebidas · Volta às Aulas",
    titulo: "Mini bowl colecionável para Volta às Aulas",
    resumo:
      "Funcionalidade e identidade visual em um produto conectado à rotina escolar, para uma campanha sazonal da Del Valle.",
  },
  {
    slug: "talheres-personalizados-para-campanha-de-natal",
    cliente: "Coca-Cola",
    segmento: "Bebidas · Campanha de Natal",
    titulo: "Talheres personalizados para campanha de Natal",
    resumo:
      "Um utensílio do cotidiano integrado à experiência de uma campanha sazonal, parte de uma relação com a Coca-Cola construída ao longo de mais de 25 anos.",
  },
  {
    slug: "forma-de-gelo-personalizada",
    cliente: "Sprite",
    segmento: "Bebidas · Projeto especial",
    titulo: "Forma de gelo personalizada",
    resumo:
      "Forma de gelo em ABS com a identidade visual da Sprite, conectando o produto promocional ao momento de preparo e consumo das bebidas.",
  },
  {
    slug: "copo-personalizado-para-campanha-de-iogurtes",
    cliente: "Batavo",
    segmento: "Alimentos · Campanha nacional",
    titulo: "Copo personalizado para campanha de iogurtes",
    resumo:
      "Copos mini roma cristal personalizados para uma campanha nacional da linha de iogurtes Batavo, unindo utilidade e valor percebido ao contexto da ação.",
  },
  {
    slug: "super-bowl-colecionavel",
    cliente: "Vono / Ajinomoto",
    segmento: "Alimentos · Coleção",
    titulo: "Super Bowl colecionável",
    resumo:
      "Uma linha completa de Super Bowl colecionável desenvolvida ao longo de 4 anos para a Vono, marca da Ajinomoto, ligando a campanha a um utensílio de alimentação.",
  },
  {
    slug: "estojo-porta-escova-green-fibras",
    cliente: "Todynho",
    segmento: "Alimentos · Linha Green Fibras",
    titulo: "Estojo porta-escova Green Fibras",
    resumo:
      "Estojo porta-escova dental da Linha Green Fibras para um projeto da Todynho (Pepsico), unindo organização e fibras naturais incorporadas ao polipropileno.",
  },
  {
    slug: "bolhao-de-sabao-para-campanha-compre-e-ganhe",
    cliente: "Giraffas",
    segmento: "Food service · Compre e Ganhe",
    titulo: "Bolhão de sabão para campanha Compre e Ganhe",
    resumo:
      "Bolhão de sabão para campanhas nacionais de Compre e Ganhe da rede Giraffas, somando uma atividade lúdica à ação promocional voltada ao público familiar.",
  },
  {
    slug: "estojo-personalizado",
    cliente: "Neodent",
    segmento: "Odontologia · Projeto especial",
    titulo: "Estojo personalizado",
    resumo:
      "Estojos premium para aparelhos ortodônticos fornecidos ao longo de 4 anos à Neodent, em ABS com coinjeção de berço emborrachado interno personalizado.",
  },
  {
    slug: "brindes-corporativos-personalizados",
    cliente: "Itaú",
    segmento: "Financeiro · Brindes corporativos",
    titulo: "Brindes corporativos personalizados",
    resumo:
      "Espelho de bolsa, porta comprimidos, copos, chaveiros, mariner box e porta cartões fornecidos em diversas campanhas nacionais do Banco Itaú.",
  },
  {
    slug: "canecas-colecionaveis-personalizadas",
    cliente: "Lilica Ripilica",
    segmento: "Varejo · Coleção",
    titulo: "Canecas colecionáveis personalizadas",
    resumo:
      "Canecas colecionáveis personalizadas com embalagens especiais para a Lilica Ripilica, unindo aplicação gráfica da marca e proposta colecionável.",
  },
  {
    slug: "copos-cancun-ecologicos-green-fibras",
    cliente: "Lojas Renner",
    segmento: "Varejo · Linha Green Fibras",
    titulo: "Copos Cancun ecológicos Green Fibras",
    resumo:
      "Copos Cancun da Linha Green Fibras para as Lojas Renner, em fibras naturais e polipropileno, concebidos para uso permanente em substituição aos descartáveis.",
  },
  {
    slug: "copos-e-canecas-ecologicas-para-instituicoes-de-ensino",
    cliente: "Institutos Federais",
    segmento: "Educação · Linha Green Fibras",
    titulo: "Copos e canecas ecológicas para instituições de ensino",
    resumo:
      "Copos e canecas da Linha Green Fibras para diversos Institutos Federais, apoiando a substituição de utensílios descartáveis no ambiente educacional.",
  },
  {
    slug: "chaveiro-polvo-green-plasticaria",
    cliente: "PRIO",
    segmento: "Energia · Linha Green Plasticaria",
    titulo: "Chaveiro Polvo Green Plasticaria",
    resumo:
      "Chaveiro Polvo da Linha Green Plasticaria para um projeto com a PRIO, feito com plástico reciclado equivalente ao consumo de 1 hora de um adulto no Brasil.",
  },
  {
    slug: "abridor-green-plasticaria",
    cliente: "Heineken",
    segmento: "Bebidas · Linha Green Plasticaria",
    titulo: "Abridor Green Plasticaria",
    resumo:
      "Abridor de garrafas personalizado para a Heineken na proposta da Linha Green Plasticaria, incorporando plástico reciclado a um acessório ligado ao universo da marca.",
  },
  {
    slug: "trofeus-e-medalhas-ecologicos-personalizados",
    cliente: "FBCA",
    segmento: "Esporte · Premiação",
    titulo: "Troféus e medalhas ecológicos personalizados",
    resumo:
      "Troféus e medalhas do circuito da Federação Baiana de Corrida de Aventura (FBCA), fabricados 100% com plástico reciclado da Linha Green Plasticaria.",
  },
];
