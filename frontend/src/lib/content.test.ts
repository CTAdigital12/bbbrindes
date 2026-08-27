import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getBanners,
  getCampanhas,
  getCases,
  getCategorias,
  getMaterias,
  getPosts,
} from "./content";
import { posts as postsMock } from "@/data/blog";
import { cases as casesMock } from "@/data/cases";
import { banners as bannersMock, miniBanners as miniBannersMock } from "@/data/banners";
import { campanhas as campanhasMock } from "@/data/campanhas";
import { categorias as categoriasMock } from "@/data/categorias";

// Loaders de conteudo (S03-04). O contrato-chave e: mapear os docs do Payload
// para os tipos da UI e, quando a API falha OU vem vazia, cair no mock. O fetch
// e mockado para exercitar os dois caminhos sem subir o backend.

function mockFetchJson(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      new Response(JSON.stringify(body), {
        status,
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

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getPosts", () => {
  it("mapeia docs do Payload, normaliza data e extrai texto do richText", async () => {
    mockFetchJson({
      docs: [
        {
          slug: "post-real",
          titulo: "Post real",
          resumo: "Resumo",
          data: "2026-06-01T00:00:00.000Z",
          conteudo: {
            root: {
              children: [
                { children: [{ text: "Primeiro paragrafo." }] },
                { children: [{ text: "Segundo paragrafo." }] },
              ],
            },
          },
        },
      ],
    });

    const posts = await getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("post-real");
    expect(posts[0].data).toBe("2026-06-01");
    expect(posts[0].conteudo).toBe("Primeiro paragrafo.\n\nSegundo paragrafo.");
  });

  it("cai no mock quando o Payload vem vazio", async () => {
    mockFetchJson({ docs: [] });
    expect(await getPosts()).toBe(postsMock);
  });

  it("cai no mock quando o fetch falha", async () => {
    mockFetchError();
    expect(await getPosts()).toBe(postsMock);
  });
});

describe("getCases", () => {
  it("so inclui depoimento quando ha texto", async () => {
    mockFetchJson({
      docs: [
        { slug: "com", cliente: "A", titulo: "T1", depoimento: { texto: "Otimo", autor: "X" } },
        { slug: "sem", cliente: "B", titulo: "T2", depoimento: { autor: "Y" } },
      ],
    });

    const cases = await getCases();
    expect(cases[0].depoimento).toEqual({ texto: "Otimo", autor: "X" });
    expect(cases[1].depoimento).toBeUndefined();
  });

  it("cai no mock em erro", async () => {
    mockFetchError();
    expect(await getCases()).toBe(casesMock);
  });
});

describe("getBanners", () => {
  it("separa por posicao (carrossel x mini) e ignora inativos", async () => {
    mockFetchJson({
      docs: [
        { id: 1, titulo: "Carro 1", posicao: "carrossel", href: "/a", ativo: true },
        { id: 2, titulo: "Mini 1", posicao: "mini", href: "", ativo: true },
        { id: 3, titulo: "Oculto", posicao: "carrossel", ativo: false },
      ],
    });

    const { carrossel, mini } = await getBanners();
    expect(carrossel).toHaveLength(1);
    expect(carrossel[0].id).toBe("1");
    expect(mini).toHaveLength(1);
    expect(mini[0].href).toBe("#");
  });

  it("cai no mock (carrossel e mini) quando a colecao esta vazia", async () => {
    mockFetchJson({ docs: [] });
    const { carrossel, mini } = await getBanners();
    expect(carrossel).toBe(bannersMock);
    expect(mini).toBe(miniBannersMock);
  });
});

describe("getCampanhas", () => {
  it("filtra inativas e mapeia slug/nome/mes", async () => {
    mockFetchJson({
      docs: [
        { slug: "natal", nome: "Natal", mes: "Dezembro", ativo: true },
        { slug: "off", nome: "Desligada", ativo: false },
      ],
    });
    const campanhas = await getCampanhas();
    expect(campanhas).toEqual([{ slug: "natal", nome: "Natal", mes: "Dezembro" }]);
  });

  it("cai no mock quando nao ha campanha ativa", async () => {
    mockFetchJson({ docs: [] });
    expect(await getCampanhas()).toBe(campanhasMock);
  });
});

describe("getCategorias", () => {
  it("mapeia slug/nome do Payload", async () => {
    mockFetchJson({ docs: [{ slug: "copos", nome: "Copos" }] });
    expect(await getCategorias()).toEqual([{ slug: "copos", nome: "Copos" }]);
  });

  it("cai no mock em erro", async () => {
    mockFetchError();
    expect(await getCategorias()).toBe(categoriasMock);
  });
});

describe("getMaterias", () => {
  it("normaliza data, converte id para string e usa # quando nao ha url", async () => {
    mockFetchJson({
      docs: [
        { id: 7, veiculo: "Valor", data: "2026-04-12T00:00:00.000Z", titulo: "M", url: "" },
      ],
    });

    const materias = await getMaterias();
    expect(materias[0].id).toBe("7");
    expect(materias[0].data).toBe("2026-04-12");
    expect(materias[0].url).toBe("#");
  });
});
