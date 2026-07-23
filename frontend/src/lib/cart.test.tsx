import type { ReactNode } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, type ItemOrcamento } from "./cart";

// Carrinho de orcamento e funcionalidade critica (CLAUDE.md regra 19). Estes
// testes exercitam o hook real dentro do CartProvider, incluindo a persistencia
// em localStorage.

const STORAGE_KEY = "bbbrindes:orcamento";

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

function item(over: Partial<ItemOrcamento> = {}): ItemOrcamento {
  return { produtoSlug: "squeeze-300ml", nome: "Squeeze 300ml", cor: "Azul", quantidade: 1, ...over };
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
    expect(result.current.totalItens).toBe(1);
  });

  it("soma a quantidade quando o mesmo produto e cor entram de novo", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ quantidade: 2 })));
    act(() => result.current.adicionar(item({ quantidade: 3 })));
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].quantidade).toBe(5);
    expect(result.current.totalItens).toBe(5);
  });

  it("mantem itens separados quando a cor difere", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ cor: "Azul" })));
    act(() => result.current.adicionar(item({ cor: "Verde" })));
    expect(result.current.itens).toHaveLength(2);
    expect(result.current.totalItens).toBe(2);
  });

  it("altera a quantidade e nunca deixa abaixo de 1", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item()));
    act(() => result.current.alterarQuantidade(0, 7));
    expect(result.current.itens[0].quantidade).toBe(7);
    act(() => result.current.alterarQuantidade(0, 0));
    expect(result.current.itens[0].quantidade).toBe(1);
    act(() => result.current.alterarQuantidade(0, -5));
    expect(result.current.itens[0].quantidade).toBe(1);
  });

  it("remove um item pelo indice", () => {
    const { result } = montar();
    act(() => result.current.adicionar(item({ cor: "Azul" })));
    act(() => result.current.adicionar(item({ cor: "Verde" })));
    act(() => result.current.remover(0));
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].cor).toBe("Verde");
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
    act(() => primeira.result.current.adicionar(item({ quantidade: 4 })));
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain("squeeze-300ml");
    primeira.unmount();

    const segunda = montar();
    expect(segunda.result.current.itens).toHaveLength(1);
    expect(segunda.result.current.totalItens).toBe(4);
  });

  it("ignora dados corrompidos no localStorage sem quebrar", () => {
    window.localStorage.setItem(STORAGE_KEY, "{isto-nao-e-json");
    const { result } = montar();
    expect(result.current.itens).toHaveLength(0);
  });
});
