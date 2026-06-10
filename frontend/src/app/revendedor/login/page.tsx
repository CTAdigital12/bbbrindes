"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RevendedorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    // Wireframe: sem auth real (entra na Sprint 4). Qualquer dado segue para o painel.
    router.push("/revendedor/painel");
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
            <input type="email" className="wf-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="wf-label">Senha</label>
            <input type="password" className="wf-input" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <button type="submit" className="wf-btn-primary w-full">
            Entrar
          </button>
        </form>

        <div className="mt-4 flex justify-between text-xs text-wf-muted">
          <Link href="/revendedores" className="hover:text-wf-accent">
            Quero ser revendedor
          </Link>
          <span className="cursor-default">Esqueci a senha</span>
        </div>

        <p className="mt-4 rounded bg-wf-bg p-2 text-center text-[10px] uppercase tracking-wide text-wf-muted">
          Wireframe: login sem validacao real
        </p>
      </div>
    </div>
  );
}
