import type { SiteConfig } from "@/lib/types";

// Mock das configuracoes do site (FB-6): os valores que hoje estao hardcoded no
// Header, Footer e pagina de Contato. getConfig() (lib/content.ts) usa isto como
// fallback enquanto o global `configuracoes` do Payload nao estiver preenchido,
// pra nao regredir o visual. Quando o cliente cadastrar no admin, o global
// substitui estes valores.
//
// redes: vazias de proposito. Hoje o Footer aponta pra "#" (placeholder sem
// link); ao ligar o global (Fase 1), icone sem URL fica escondido. As URLs reais
// das redes sao input pendente do cliente.
export const configMock: SiteConfig = {
  telefone: "(71) 99416-0138",
  whatsapp: "5571994160138",
  email: "comercial@bbgrupo.com.br",
  endereco: "Lauro de Freitas / BA",
  horario: "A confirmar",
  cnpj: "11.158.637/0001-27",
  descricao:
    "BB Brindes, uma empresa Grupo BB. Indústria brasileira de brindes corporativos personalizados, com fábrica própria há 27 anos.",
  redes: {
    instagram: "",
    linkedin: "",
    facebook: "",
    pinterest: "",
    youtube: "",
  },
  selos: ["SGP", "PS&C", "GMP", "NM300", "SMETA 4 Pilares"],
};
