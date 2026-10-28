import type { SiteConfig } from "@/lib/types";

// Mock das configuracoes do site (FB-6): os valores que hoje estao hardcoded no
// Header, Footer e pagina de Contato. getConfig() (lib/content.ts) usa isto como
// fallback enquanto o global `configuracoes` do Payload nao estiver preenchido,
// pra nao regredir o visual. Quando o cliente cadastrar no admin, o global
// substitui estes valores.
//
// redes: URLs reais do site oficial bbbrindes.com.br (28/10). Com valor, o Footer
// mostra o icone com link; vazio fica escondido (ex. LinkedIn, que o site oficial
// nao tem). Quando o cliente preencher o global no admin, ele substitui isto.
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
    instagram: "https://www.instagram.com/grupobbbrindes/",
    linkedin: "",
    facebook: "https://www.facebook.com/grupobbbrindes",
    pinterest: "https://br.pinterest.com/grupobb/",
    youtube: "https://www.youtube.com/user/bbgrupo",
  },
  selos: ["SGP", "PS&C", "GMP", "NM300", "SMETA 4 Pilares"],
};
