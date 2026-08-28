import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getProdutoBySlug } from "./produtos";
import { produtoPorSlug } from "@/data/produtos";

// Loader de produto (S03-02 piloto). Contrato: mapear o produto do Payload para
// o tipo da PDP e, quando a API falha OU o slug nao existe no Payload, cair no
// mock. O fetch e mockado para exercitar os dois caminhos.

function mockFetchJson(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

function mockFetchError() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("backend fora do ar");
    }),
  );
}

beforeEach(() => vi.restoreAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe("getProdutoBySlug", () => {
  it("mapeia o produto do Payload para o tipo da PDP", async () => {
    mockFetchJson({
      docs: [
        {
          slug: "squeeze-teste",
          nome: "Squeeze Teste",
          subtitulo: "Subtitulo",
          headline: "Headline curta",
          descricaoCurta: "Resumo curto",
          descricaoCompleta: {
            root: { children: [{ children: [{ text: "Paragrafo unico." }] }] },
          },
          beneficios: ["b1", "b2"],
          idealPara: ["evento"],
          diferenciais: ["fabricacao propria"],
          especificacoes: [{ rotulo: "Material", valor: "PEAD" }],
          categorias: [{ slug: "squeezes", nome: "Squeezes" }],
          ecologico: false,
          selos: { livreDeBpa: true, usoPermanente: false },
          cores: [{ nome: "Standard" }, { nome: "Azul", hex: "#0000ff" }],
          imagens: [{ url: "http://x/1.webp" }, { url: "http://x/2.webp" }],
          faixaPreco: "4-a-15",
          logistica: { materiaPrima: "PEAD + PEBD" },
        },
      ],
    });

    const p = await getProdutoBySlug("squeeze-teste");
    expect(p).toBeDefined();
    expect(p!.categoria).toBe("squeezes");
    expect(p!.material).toBe("PEAD + PEBD");
    expect(p!.imagens).toEqual(["http://x/1.webp", "http://x/2.webp"]);
    // Cor sem hex ganha um tom padrao; com hex mantem o informado.
    expect(p!.cores[0]).toEqual({ nome: "Standard", hex: "#e5e7eb" });
    expect(p!.cores[1]).toEqual({ nome: "Azul", hex: "#0000ff" });
    // detalhe montado a partir dos campos ricos.
    expect(p!.detalhe?.beneficios).toEqual(["b1", "b2"]);
    expect(p!.detalhe?.selos).toEqual(["Livre de BPA"]);
    expect(p!.detalhe?.descricaoCompleta).toEqual(["Paragrafo unico."]);
  });

  it("cai no mock quando a API falha", async () => {
    mockFetchError();
    const p = await getProdutoBySlug("squeeze-300ml-personalizado");
    expect(p).toEqual(produtoPorSlug("squeeze-300ml-personalizado"));
  });

  it("cai no mock quando o slug nao existe no Payload", async () => {
    mockFetchJson({ docs: [] });
    const p = await getProdutoBySlug("squeeze-300ml-personalizado");
    expect(p).toEqual(produtoPorSlug("squeeze-300ml-personalizado"));
  });
});
