import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getProdutoBySlug, getProdutos, getProdutoSlugs, getProdutosEcologicos } from "./produtos";
import { produtoPorSlug } from "@/data/produtos";

// Loader de produto (S03-02 piloto). Contrato: mapear o produto do Payload para
// o tipo da PDP e usar o fallback apenas se a API falha. Respostas vazias ou
// produtos nao publicados nao ressuscitam o mock.

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
          imagemDimensoes: { url: "http://x/dim.webp" },
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
    // Imagem de dimensoes (upload unico) resolve para a URL do Payload.
    expect(p!.imagemDimensoes).toBe("http://x/dim.webp");
    // Cor sem hex ganha um tom padrao; com hex mantem o informado.
    expect(p!.cores[0]).toEqual({ nome: "Standard", hex: "#e5e7eb" });
    expect(p!.cores[1]).toEqual({ nome: "Azul", hex: "#0000ff" });
    // detalhe montado a partir dos campos ricos.
    expect(p!.detalhe?.beneficios).toEqual(["b1", "b2"]);
    expect(p!.detalhe?.selos).toEqual(["Livre de BPA"]);
    expect(p!.detalhe?.descricaoCompleta).toEqual(["Paragrafo unico."]);
  });

  it("preserva codigo e monta os blocos base x acessorio (modelo cor, item 5)", async () => {
    mockFetchJson({
      docs: [
        {
          slug: "squeeze-duas-cores",
          nome: "Squeeze Duas Cores",
          codigoSite: "233CL",
          cores: [{ nome: "Preto", codigo: "02", hex: "#000000" }],
          variacao: {
            baseRotulo: "Garrafa",
            acessorioRotulo: "Tampa",
            baseNaoPreencher: false,
            acessorioNaoPreencher: false,
            coresAcessorio: [{ nome: "Creme", codigo: "07", hex: "#f5f5dc" }],
          },
        },
      ],
    });

    const p = await getProdutoBySlug("squeeze-duas-cores");
    expect(p).toBeDefined();
    // codigoSite chega ao front (posicao visual pos-Joy).
    expect(p!.codigoSite).toBe("233CL");
    // `codigo` da cor nao e mais descartado.
    expect(p!.cores[0].codigo).toBe("02");
    // base = o mesmo dado de `cores`; acessorio = variacao.coresAcessorio.
    expect(p!.variacao?.base).toEqual({
      rotulo: "Garrafa",
      naoPreencher: false,
      cores: [{ nome: "Preto", codigo: "02", hex: "#000000" }],
    });
    expect(p!.variacao?.acessorio).toEqual({
      rotulo: "Tampa",
      naoPreencher: false,
      cores: [{ nome: "Creme", codigo: "07", hex: "#f5f5dc" }],
    });
  });

  it("produto sem variacao nasce base-only (acessorio nao preencher)", async () => {
    mockFetchJson({
      docs: [{ slug: "legado-cor-unica", nome: "Legado", cores: [{ nome: "Azul", hex: "#0000ff" }] }],
    });
    const p = await getProdutoBySlug("legado-cor-unica");
    expect(p!.variacao?.base.naoPreencher).toBe(false);
    expect(p!.variacao?.acessorio.naoPreencher).toBe(true);
    expect(p!.variacao?.acessorio.cores).toEqual([]);
  });

  it("cai no mock quando a API falha", async () => {
    mockFetchError();
    const p = await getProdutoBySlug("squeeze-300ml-personalizado");
    expect(p).toEqual(produtoPorSlug("squeeze-300ml-personalizado"));
  });

  it("nao ressuscita um produto removido pela base inicial", async () => {
    mockFetchJson({ docs: [] });
    expect(await getProdutoBySlug("squeeze-300ml-personalizado")).toBeUndefined();
  });
});


describe("visibilidade editada no painel", () => {
  it("retira da pagina um produto despublicado", async () => {
    mockFetchJson({ docs: [{ slug: "squeeze-300ml-personalizado", canais: { site: false } }] });
    expect(await getProdutoBySlug("squeeze-300ml-personalizado")).toBeUndefined();
    expect(await getProdutos()).toEqual([]);
    expect(await getProdutoSlugs()).toEqual([]);
    expect(await getProdutosEcologicos()).toEqual([]);
  });
  it("base vazia nao volta ao catalogo inicial", async () => {
    mockFetchJson({ docs: [] });
    expect(await getProdutos()).toEqual([]);
    expect(await getProdutoSlugs()).toEqual([]);
    expect(await getProdutosEcologicos()).toEqual([]);
  });
  it("produtos antigos sem flag continuam publicados", async () => {
    mockFetchJson({ docs: [{ slug: "legado", nome: "Legado" }, { slug: "oculto", canais: { site: false } }] });
    expect(await getProdutoSlugs()).toEqual(["legado"]);
    expect((await getProdutos()).map(p => p.slug)).toEqual(["legado"]);
  });
});
