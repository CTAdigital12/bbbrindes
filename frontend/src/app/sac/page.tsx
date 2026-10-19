"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Icon from "@/components/Icon";

// Motivos do mockup sac() (chegam na pessoa certa).
const MOTIVOS = [
  "Status do pedido",
  "Problema com produto",
  "Divergência de quantidade ou item",
  "Prazo de entrega",
  "Nota fiscal e documentos",
  "Aprovação de arte",
  "Elogio",
  "Outro",
];

// Espelha sac(): form.form + toast de confirmacao + reset. Sem envio real
// (integracao com CRM entra depois), como no mockup (data-act="sacf").
export default function SacPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [toast, setToast] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    formRef.current?.reset();
    setToast(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(false), 2600);
  }

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>SAC</span>
      </div>
      <div className="ptitle">
        <h1>SAC BB Brindes</h1>
        <p>
          Conta o que aconteceu. Selecione o motivo abaixo para que a sua mensagem chegue direto na
          pessoa certa. Retornamos em até 24 horas úteis.
        </p>
      </div>

      <form
        ref={formRef}
        className="form"
        style={{ position: "static", maxWidth: "640px" }}
        noValidate
        onSubmit={enviar}
      >
        <div className="row2">
          <div className="fld">
            <label>Nome</label>
            <input required />
          </div>
          <div className="fld">
            <label>E-mail corporativo</label>
            <input type="email" required />
          </div>
        </div>
        <div className="row2">
          <div className="fld">
            <label>Telefone / WhatsApp</label>
            <input required inputMode="tel" />
          </div>
          <div className="fld">
            <label>Empresa</label>
            <input />
          </div>
        </div>
        <div className="row2">
          <div className="fld">
            <label>Número do pedido (opcional)</label>
            <input />
          </div>
          <div className="fld">
            <label>Motivo</label>
            <select>
              {MOTIVOS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="fld">
          <label>Mensagem</label>
          <textarea required />
        </div>
        <button type="submit" className="btn btn-deep btn-lg">
          Enviar
        </button>
      </form>

      <div className={`toast${toast ? " on" : ""}`} role="status" aria-live="polite">
        <Icon name="circle-check" />
        <span>Mensagem enviada. Retornamos em até 24 horas úteis.</span>
      </div>
    </div>
  );
}
