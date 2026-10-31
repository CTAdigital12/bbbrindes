"use client";

import { useRef, useState } from "react";
import { mascaraTelefone } from "@/lib/mask";
import Icon from "@/components/Icon";

// Form do SAC (parte interativa da pagina /sac). A copy (titulo/intro) e os
// motivos vem do global `conteudo-institucional` (getConteudoInstitucional) na
// pagina server; aqui recebe so `motivos`. Espelha sac() do mockup: form + toast
// de confirmacao + reset, sem envio real (integracao com CRM entra depois).
export default function SacForm({ motivos }: { motivos: string[] }) {
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
    <>
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
            <input required maxLength={80} />
          </div>
          <div className="fld">
            <label>E-mail corporativo</label>
            <input type="email" required maxLength={120} />
          </div>
        </div>
        <div className="row2">
          <div className="fld">
            <label>Telefone / WhatsApp</label>
            {/* Mascara BR (00) 00000-0000; input nao controlado, formata no proprio value. */}
            <input
              required
              inputMode="tel"
              maxLength={15}
              placeholder="(00) 00000-0000"
              onChange={(e) => {
                e.currentTarget.value = mascaraTelefone(e.currentTarget.value);
              }}
            />
          </div>
          <div className="fld">
            <label>Empresa</label>
            <input maxLength={80} />
          </div>
        </div>
        <div className="row2">
          <div className="fld">
            <label>Número do pedido (opcional)</label>
            <input maxLength={40} />
          </div>
          <div className="fld">
            <label>Motivo</label>
            <select>
              {motivos.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="fld">
          <label>Mensagem</label>
          <textarea required maxLength={1000} />
        </div>
        <button type="submit" className="btn btn-deep btn-lg">
          Enviar
        </button>
      </form>

      <div className={`toast${toast ? " on" : ""}`} role="status" aria-live="polite">
        <Icon name="circle-check" />
        <span>Mensagem enviada. Retornamos em até 24 horas úteis.</span>
      </div>
    </>
  );
}
