"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthError, login } from "@/lib/auth";

export default function RevendedorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await login(email, senha);
      router.push("/revendedor/painel");
    } catch (err) {
      setErro(
        err instanceof AuthError
          ? err.message
          : "Nao foi possivel entrar. Tente de novo.",
      );
      setEnviando(false);
    }
  }

  return (
    <div className="wf-container flex justify-center py-16">
      <div className="wf-card w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold text-wf-ink">Area do revendedor</h1>
        <p className="mt-1 text-sm text-wf-text">
          Acesso exclusivo a precos tabelados, estoque e fechamento de pedido.
        </p>

        <form onSubmit={entrar} className="mt-6 space-y-4">
          <div>
            <label className="wf-label">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="wf-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="wf-label">Senha</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="wf-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="rounded bg-red-50 p-2 text-sm text-red-700"
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="wf-btn-primary w-full disabled:opacity-50"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-xs text-wf-muted">
          <Link href="/revendedores" className="hover:text-wf-accent">
            Quero ser revendedor
          </Link>
          <Link
            href="/revendedor/esqueci-senha"
            className="hover:text-wf-accent"
          >
            Esqueci a senha
          </Link>
        </div>
      </div>
    </div>
  );
}
