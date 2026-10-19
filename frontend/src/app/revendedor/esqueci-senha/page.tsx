"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/auth";

// Pagina sem equivalente no mockup: so reaplica o tema Joy (card .done). Logica
// de recuperacao (lib/auth, anti-enumeracao) mantida intacta.
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
    <div className="wrap">
      <div className="done" style={{ textAlign: "left" }}>
        <h1 style={{ fontSize: "28px" }}>Recuperar senha</h1>

        {enviado ? (
          <p style={{ color: "var(--muted)", marginTop: "12px" }}>
            Se este e-mail estiver cadastrado, enviamos um link para redefinir a senha. Verifique
            sua caixa de entrada.
          </p>
        ) : (
          <>
            <p style={{ color: "var(--muted)" }}>
              Informe o e-mail do seu acesso. Enviaremos um link para redefinir a senha.
            </p>
            <form onSubmit={enviar}>
              <div className="fld" style={{ marginTop: "8px" }}>
                <label>E-mail</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="btn btn-deep btn-lg btn-block"
                style={{ marginTop: "16px", opacity: enviando ? 0.5 : 1 }}
              >
                {enviando ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          </>
        )}

        <div style={{ marginTop: "14px", fontSize: "13.5px" }}>
          <Link className="link" href="/revendedor/login">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
