"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/auth";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    // Sempre confirma sem revelar se o e-mail existe (anti-enumeracao).
    await forgotPassword(email);
    setEnviado(true);
    setEnviando(false);
  }

  return (
    <div className="wf-container flex justify-center py-16">
      <div className="wf-card w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold text-wf-ink">Recuperar senha</h1>

        {enviado ? (
          <p className="mt-4 text-sm text-wf-text">
            Se este e-mail estiver cadastrado, enviamos um link para redefinir a
            senha. Verifique sua caixa de entrada.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-wf-text">
              Informe o e-mail do seu acesso. Enviaremos um link para redefinir
              a senha.
            </p>
            <form onSubmit={enviar} className="mt-6 space-y-4">
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
              <button
                type="submit"
                disabled={enviando}
                className="wf-btn-primary w-full disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-xs text-wf-muted">
          <Link href="/revendedor/login" className="hover:text-wf-accent">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
