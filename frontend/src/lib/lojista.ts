// Armazenamento client-side (localStorage) dos produtos adicionados manualmente
// pelo lojista. Wireframe: simula o CRUD sem backend. Na producao isso vira a
// coleção Produtos no Payload, com origem "manual" convivendo com a "import".

export type ProdutoManual = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  material: string;
  aplicacoes: string[];
  cores: { nome: string; hex: string }[];
  personalizavel: boolean;
  faixaPreco: string;
  criadoEm: string; // ISO
};

const KEY = "bbbrindes:lojista:produtos";

export function listarManuais(): ProdutoManual[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProdutoManual[]) : [];
  } catch {
    return [];
  }
}

export function adicionarManual(dados: Omit<ProdutoManual, "id" | "criadoEm">): ProdutoManual {
  const novo: ProdutoManual = {
    ...dados,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
  };
  const atual = listarManuais();
  window.localStorage.setItem(KEY, JSON.stringify([novo, ...atual]));
  return novo;
}

export function removerManual(id: string): void {
  const atual = listarManuais().filter((p) => p.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(atual));
}
