"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthError, login } from "@/lib/auth";

// Visual na identidade Joy (mockup login(): .done reusado, text-align left), com
// a logica real de auth (lib/auth) mantida intacta.
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
        err instanceof AuthError ? err.message : "Nao foi possivel entrar. Tente de novo.",
      );
      setEnviando(false);
    }
  }

  return (
    <div className="wrap">
      <div className="done" style={{ textAlign: "left" }}>
        <h1 style={{ fontSize: "28px" }}>Área do revendedor</h1>
        <p style={{ color: "var(--muted)" }}>
          Acesso exclusivo a preços tabelados, estoque e fechamento de pedido.
        </p>

        <form onSubmit={entrar}>
          <div className="fld">
            <label>E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="fld" style={{ marginTop: "10px" }}>
            <label>Senha</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p role="alert" style={{ marginTop: "12px", color: "#9a4b00", fontSize: "13.5px" }}>
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="btn btn-deep btn-lg btn-block"
            style={{ marginTop: "16px", opacity: enviando ? 0.5 : 1 }}
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "14px",
            fontSize: "13.5px",
          }}
        >
          <Link className="link" href="/revendedores">
            Quero ser revendedor
          </Link>
          <Link className="link" href="/revendedor/esqueci-senha">
            Esqueci a senha
          </Link>
        </div>
      </div>
    </div>
  );
}
