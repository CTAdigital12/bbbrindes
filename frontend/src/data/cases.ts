import type { Case } from "@/lib/types";

// Cases mock (wireframe). Exemplos ilustrativos; nomes, depoimentos e numeros
// sao ficticios. Conteudo real via CMS em sprint futura.
export const cases: Case[] = [
  {
    slug: "coca-cola-campanha-verao",
    cliente: "Coca-Cola",
    segmento: "Bebidas",
    titulo: "Squeezes personalizados para campanha de verao",
    resumo:
      "Producao de grande volume com personalizacao em multiplas cores e entrega nacional dentro de um prazo agressivo.",
    depoimento: {
      texto: "Cumpriram um prazo apertado sem abrir mao do acabamento. Viramos cliente recorrente.",
      autor: "Equipe de Trade Marketing",
    },
  },
  {
    slug: "ambev-lancamento-copos",
    cliente: "Ambev",
    segmento: "Bebidas",
    titulo: "Copos termicos para lancamento de produto",
    resumo:
      "Brindes de ativacao para evento de lancamento, com gravacao da marca e embalagem individual.",
    depoimento: {
      texto: "O brinde virou item desejado pelos convidados. Superou a expectativa.",
      autor: "Coordenacao de Eventos",
    },
  },
  {
    slug: "natura-kits-consultoras",
    cliente: "Natura",
    segmento: "Cosmeticos",
    titulo: "Kits ecologicos para consultoras",
    resumo:
      "Linha de brindes sustentaveis, com materiais reciclados, alinhada ao posicionamento da marca.",
  },
  {
    slug: "sicredi-rede-agencias",
    cliente: "Sicredi",
    segmento: "Financeiro",
    titulo: "Cadernos e canetas para a rede de agencias",
    resumo:
      "Padronizacao de brindes institucionais para distribuicao nas agencias de todo o pais.",
    depoimento: {
      texto: "Logistica e padrao de qualidade consistentes em centenas de pontos.",
      autor: "Area de Marketing",
    },
  },
  {
    slug: "localiza-pos-venda",
    cliente: "Localiza",
    segmento: "Mobilidade",
    titulo: "Brindes de pos-venda para fidelizacao",
    resumo:
      "Itens de viagem personalizados para clientes, com foco em utilidade e durabilidade.",
  },
  {
    slug: "prefeitura-campanha-saude",
    cliente: "Prefeitura Municipal",
    segmento: "Setor publico",
    titulo: "Ecobags para campanha de saude publica",
    resumo:
      "Producao de ecobags e squeezes para acao de conscientizacao, atendendo prazo de licitacao.",
  },
];
