// Cliente de auth do revendedor (S03-03). O site e export estatico (sem
// runtime de servidor), entao nao ha middleware nem route handler: o login
// chama a REST API do Payload direto, e a protecao de rota do painel e
// client-side (ver /revendedor/painel). O cookie de sessao (httpOnly,
// SameSite=Lax) e emitido pelo Payload; por isso todo fetch usa
// `credentials: "include"`. Backend e frontend sao same-site (mesmo dominio em
// prod, via subdominio; localhost em dev), entao o cookie viaja normalmente.

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const BASE = `${BACKEND}/api/revendedores`;

export type RevendedorUser = {
  id: string;
  email: string;
  empresa?: string;
  nomeFantasia?: string;
  nivel?: "1" | "2" | "3" | "4";
  ativo?: boolean;
};

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

// Extrai a mensagem de erro do payload da resposta do Payload, que vem como
// { errors: [{ message }] }. Nunca vaza detalhes internos para a UI.
async function mensagemDeErro(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    const msg = data?.errors?.[0]?.message;
    if (typeof msg === "string" && msg.length > 0) return msg;
  } catch {
    // corpo nao-JSON: usa o fallback
  }
  return fallback;
}

export async function login(
  email: string,
  senha: string,
): Promise<RevendedorUser> {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha }),
  });

  if (!res.ok) {
    // 401 do Payload vem em ingles ("The email or password provided is
    // incorrect."); localizamos. Nos demais casos (ex.: 403 de conta inativa,
    // que ja vem em pt-BR do beforeLogin) usamos a mensagem do backend.
    const message =
      res.status === 401
        ? "Email ou senha invalidos."
        : await mensagemDeErro(res, "Nao foi possivel entrar. Tente de novo.");
    throw new AuthError(message, res.status);
  }

  const data = await res.json();
  return data.user as RevendedorUser;
}

// Retorna o revendedor logado, ou null se nao houver sessao. Usado para
// proteger a rota do painel no client.
export async function me(): Promise<RevendedorUser | null> {
  try {
    const res = await fetch(`${BASE}/me`, { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.user as RevendedorUser | null) ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Sem rede: o cookie expira sozinho; a UI segue para o login de qualquer forma.
  }
}

// Recuperacao de senha basica: dispara o e-mail de reset do Payload. Sempre
// resolve sem erro para nao revelar se o e-mail existe (anti-enumeracao).
export async function forgotPassword(email: string): Promise<void> {
  try {
    await fetch(`${BASE}/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    // silencioso de proposito
  }
}
