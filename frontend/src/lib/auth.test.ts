import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AuthError, login, me, forgotPassword } from "./auth";

// Login do revendedor e funcionalidade critica (CLAUDE.md regra 19). O cliente
// fala com a REST API do Payload; aqui o fetch e mockado para exercitar o
// contrato (endpoint, credenciais, tratamento de erro) sem subir o backend.

const BASE = "http://localhost:3001/api/revendedores";

function mockFetch(impl: (url: string, init?: RequestInit) => Response) {
  const spy = vi.fn(async (url: string, init?: RequestInit) => impl(url, init));
  vi.stubGlobal("fetch", spy);
  return spy;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login do revendedor", () => {
  it("envia email/senha ao endpoint com credenciais e retorna o usuario", async () => {
    const fetchSpy = mockFetch(() =>
      json({ user: { id: "r1", email: "rev@ex.com", empresa: "Rev Ltda", ativo: true } }),
    );

    const user = await login("rev@ex.com", "segredo123");

    expect(user.empresa).toBe("Rev Ltda");
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe(`${BASE}/login`);
    expect(init?.method).toBe("POST");
    expect(init?.credentials).toBe("include");
    expect(JSON.parse(init?.body as string)).toEqual({
      email: "rev@ex.com",
      password: "segredo123",
    });
  });

  it("localiza o 401 do Payload (que vem em ingles) para pt-BR", async () => {
    mockFetch(() =>
      json({ errors: [{ message: "The email or password provided is incorrect." }] }, 401),
    );

    await expect(login("rev@ex.com", "errada")).rejects.toMatchObject({
      name: "AuthError",
      status: 401,
      message: "Email ou senha invalidos.",
    });
    await expect(login("rev@ex.com", "errada")).rejects.toBeInstanceOf(AuthError);
  });

  it("propaga o bloqueio de conta inativa (403 do beforeLogin)", async () => {
    mockFetch(() =>
      json({ errors: [{ message: "Cadastro em analise. O acesso e liberado apos a aprovacao." }] }, 403),
    );

    await expect(login("novo@ex.com", "segredo123")).rejects.toMatchObject({
      status: 403,
      message: "Cadastro em analise. O acesso e liberado apos a aprovacao.",
    });
  });
});

describe("me (guarda de rota)", () => {
  it("retorna o usuario quando ha sessao", async () => {
    mockFetch(() => json({ user: { id: "r1", email: "rev@ex.com" } }));
    const user = await me();
    expect(user?.id).toBe("r1");
  });

  it("retorna null quando nao ha sessao (401)", async () => {
    mockFetch(() => json({ errors: [{ message: "Unauthorized" }] }, 401));
    expect(await me()).toBeNull();
  });

  it("retorna null quando o backend esta fora do ar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    expect(await me()).toBeNull();
  });
});

describe("forgotPassword", () => {
  it("dispara o reset e nunca lanca (anti-enumeracao)", async () => {
    const fetchSpy = mockFetch(() => json({ message: "ok" }));
    await expect(forgotPassword("rev@ex.com")).resolves.toBeUndefined();
    expect(fetchSpy.mock.calls[0][0]).toBe(`${BASE}/forgot-password`);
  });
});
