import type { ReactNode } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, coresDoItem, somaQtds, normalizarItem, type ItemOrcamento } from "./cart";

// Carrinho de orcamento e funcionalidade critica (CLAUDE.md regra 19). Estes
// testes exercitam o hook real dentro do CartProvider, incluindo a persistencia
// em localStorage e a MIGRACAO do shape antigo (cor unica + 1 quantidade) para o
// novo (cores base x acessorio + ate 3 quantidades).

const STORAGE_KEY = "bbbrindes:orcamento";

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

function item(over: Partial<ItemOrcamento> = {}): ItemOrcamento {
  return { produtoSlug: "squeeze-300ml", nome: "Squeeze 300ml", corBase: "Azul", qtds: [500], ...over };
}

function montar() {
  return renderHook(() => useCart(), { wrapper });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("carrinho de orcamento", () => {
  it("comeca vazio", () => {
    const { result } = montar();
    expect(result.current.itens).toHaveLength(0);
    expect(result.current.totalItens).toBe(0);
  });

  it("adiciona um item novo", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item()));
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.totalItens).toBe(500);
  });

  it("substitui as quantidades quando o mesmo produto e cores entram de novo", () => {
    // Faixas de quantidade nao somam: a ultima configuracao vence.
    const { result } = montar();
    act(() => result.current.adicionar(item({ qtds: [500] })));
    act(() => result.current.adicionar(item({ qtds: [1000, 3000] })));
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].qtds).toEqual([1000, 3000]);
    expect(result.current.totalItens).toBe(4000);
  });

  it("mantem itens separados quando a cor base difere", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ corBase: "Azul" })));
    act(() => result.current.adicionar(item({ corBase: "Verde" })));
    expect(result.current.itens).toHaveLength(2);
    expect(result.current.totalItens).toBe(1000);
  });

  it("mantem itens separados quando so a cor acessorio difere", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ corBase: "Preto", corAcessorio: "Creme" })));
    act(() => result.current.adicionar(item({ corBase: "Preto", corAcessorio: "Verde" })));
    expect(result.current.itens).toHaveLength(2);
  });

  it("altera uma faixa de quantidade por slot e nunca fica negativa", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ qtds: [500] })));
    act(() => result.current.alterarQuantidade(0, 0, 700));
    expect(result.current.itens[0].qtds[0]).toBe(700);
    // Preenche a 2a faixa (slot 1).
    act(() => result.current.alterarQuantidade(0, 1, 1000));
    expect(result.current.itens[0].qtds).toEqual([700, 1000]);
    // Valor negativo e preso em 0 (faixa vazia); a UI cuida do minimo.
    act(() => result.current.alterarQuantidade(0, 0, -5));
    expect(result.current.itens[0].qtds[0]).toBe(0);
  });

  it("remove um item pelo indice", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ corBase: "Azul" })));
    act(() => result.current.adicionar(item({ corBase: "Verde" })));
    act(() => result.current.remover(0));
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].corBase).toBe("Verde");
  });

  it("limpa o carrinho", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item()));
    act(() => result.current.limpar());
    expect(result.current.itens).toHaveLength(0);
    expect(result.current.totalItens).toBe(0);
  });

  it("persiste no localStorage e recarrega numa nova montagem", () => {
    const primeira = montar();
    act(() => primeira.result.current.adicionar(item({ qtds: [4000] })));
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain("squeeze-300ml");
    primeira.unmount();

    const segunda = montar();
    expect(segunda.result.current.itens).toHaveLength(1);
    expect(segunda.result.current.totalItens).toBe(4000);
  });

  it("migra itens no formato antigo salvos no localStorage", () => {
    // Orcamento salvo antes da reuniao Joy: cor unica string + 1 quantidade.
    const antigo = [
      { produtoSlug: "squeeze-300ml", nome: "Squeeze 300ml", cor: "Azul", quantidade: 1000 },
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(antigo));
    const { result } = montar();
    expect(result.current.itens).toHaveLength(1);
    const it = result.current.itens[0];
    expect(it.corBase).toBe("Azul");
    expect(it.corAcessorio).toBeUndefined();
    expect(it.qtds).toEqual([1000]);
    expect(result.current.totalItens).toBe(1000);
  });

  it("ignora dados corrompidos no localStorage sem quebrar", () => {
    window.localStorage.setItem(STORAGE_KEY, "{isto-nao-e-json");
    const { result } = montar();
    expect(result.current.itens).toHaveLength(0);
  });
});

describe("helpers de exibicao do item", () => {
  it("somaQtds soma apenas as faixas positivas", () => {
    expect(somaQtds([500, 0, 1000])).toBe(1500);
    expect(somaQtds([])).toBe(0);
  });

  it("coresDoItem formata rotulo + cor em minusculo juntados por ponto", () => {
    expect(
      coresDoItem(
        item({ corBase: "Preto", corAcessorio: "Creme", rotuloBase: "Garrafa", rotuloAcessorio: "Tampa" }),
      ),
    ).toBe("Garrafa preto · Tampa creme");
    // Sem rotulo, cai em "Cor"; sem cor acessorio, so a base.
    expect(coresDoItem(item({ corBase: "Azul", corAcessorio: undefined, rotuloBase: undefined }))).toBe(
      "Cor azul",
    );
    // Sem nenhuma cor, string vazia.
    expect(coresDoItem(item({ corBase: undefined, corAcessorio: undefined }))).toBe("");
  });

  it("normalizarItem deriva qtds do campo legado quantidade", () => {
    const n = normalizarItem({ produtoSlug: "p", nome: "P", cor: "Azul", quantidade: 500 });
    expect(n.corBase).toBe("Azul");
    expect(n.qtds).toEqual([500]);
  });
});
