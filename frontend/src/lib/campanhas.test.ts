import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCampanhas, getCampanhaBySlug, getCampanhaSlugs } from "./campanhas";
import { bannerCampanhaPublicado, imagemCampanha, ordenarCampanhas } from "./campanhas-vitrine";
import { payloadFind } from "./payload";

vi.mock("./payload", async (original) => ({
  ...await original<typeof import("./payload")>(), payloadFind: vi.fn(),
}));
const find = vi.mocked(payloadFind);
beforeEach(() => { find.mockReset(); });

describe("publicacao de campanhas do painel", () => {
  it("publica alteracoes de nome, mes, imagem e selecao, omitindo inativas", async () => {
    find.mockResolvedValue([
      { slug: "black-friday", nome: "Black da fabrica", mes: "Novembro", imagem: { url: "https://midia.test/black.webp" }, produtos: [{ slug: "copo" }], ativo: true },
      { slug: "natal", nome: "Natal", ativo: false },
    ]);
    const result = await getCampanhas();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ nome: "Black da fabrica", mes: "Novembro", imagem: "https://midia.test/black.webp", produtos: ["copo"] });
  });
  it.each([{ docs: [] }, { docs: [{ slug: "black-friday", nome: "Black Friday", ativo: false }] }])(
    "nao recria campanhas quando a lista publicada esta vazia: %j", async ({ docs }) => {
      find.mockResolvedValue(docs);
      expect(await getCampanhas()).toEqual([]);
      expect(await getCampanhaSlugs()).toEqual([]);
    },
  );
  it("interrompe o build em falha de API sem publicar a lista antiga", async () => {
    find.mockRejectedValue(new Error("API indisponivel"));
    await expect(getCampanhas()).rejects.toThrow("API indisponivel");
    await expect(getCampanhaBySlug("natal")).rejects.toThrow("API indisponivel");
  });
  it("campanha desativada nao reaparece na pagina individual", async () => {
    find.mockResolvedValue([{ slug: "black-friday", nome: "Black Friday", ativo: false }]);
    expect(await getCampanhaBySlug("black-friday")).toBeUndefined();
  });
  it("campanha removida nao reaparece pelo slug antigo", async () => {
    find.mockResolvedValue([]);
    expect(await getCampanhaBySlug("natal")).toBeUndefined();
  });
  it("selecao vazia preserva a escolha feita no painel", async () => {
    find.mockResolvedValue([{ slug: "natal", nome: "Natal", produtos: [] }]);
    expect((await getCampanhaBySlug("natal"))?.produtos).toEqual([]);
  });
  it("banner nao aponta para campanha desativada e preserva links de catalogo", () => {
    const publicadas = [{ slug: "natal", nome: "Natal", mes: "Dezembro" }];
    expect(bannerCampanhaPublicado("/campanha/black-friday?origem=home", publicadas)).toBe(false);
    expect(bannerCampanhaPublicado("/campanha/natal", publicadas)).toBe(true);
    expect(bannerCampanhaPublicado("/catalogo", [])).toBe(true);
  });
  it("imagem nova funciona para uma campanha que nao existe na base inicial", () => {
    expect(imagemCampanha({ slug: "nova", nome: "Nova", mes: "Maio", imagem: "https://midia.test/nova.webp" })).toBe("https://midia.test/nova.webp");
  });
  it("rotacao respeita o mes editado e a virada do ano", () => {
    const campanhas = [
      { slug: "jan", nome: "Janeiro", mes: "Janeiro" },
      { slug: "dez", nome: "Dezembro", mes: "Dezembro" },
      { slug: "mar", nome: "Marco", mes: "Mar?o" },
    ];
    expect(ordenarCampanhas(campanhas, 11).map(c => c.slug)).toEqual(["dez", "jan", "mar"]);
    expect(campanhas[0].slug).toBe("jan");
  });
});
