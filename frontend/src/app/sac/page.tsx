"use client";

import { useState } from "react";

const motivos = [
  "Duvida sobre produto",
  "Acompanhamento de pedido",
  "Reclamacao",
  "Troca ou devolucao",
  "Elogio",
  "Outro",
];

export default function SacPage() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", motivo: motivos[0], mensagem: "" });

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    // Wireframe: sem envio real. Integracao com CRM entra na Sprint 5.
    setEnviado(true);
  }

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">SAC / Atendimento</h1>
      <p className="mt-1 text-sm text-wf-text">
        Selecione o motivo do contato e envie sua mensagem. Sua solicitacao vai para o atendimento.
      </p>

      {enviado ? (
        <div className="wf-card mt-6 max-w-xl p-6 text-sm text-wf-text">
          Mensagem registrada. Nosso time retornara em breve. (Wireframe: sem envio real.)
        </div>
      ) : (
        <form onSubmit={enviar} className="wf-card mt-6 max-w-xl space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="wf-label">Nome</label>
              <input className="wf-input" value={form.nome} onChange={(e) => set("nome", e.target.value)} required />
            </div>
            <div>
              <label className="wf-label">Email</label>
              <input type="email" className="wf-input" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="wf-label">Motivo do contato</label>
            <select className="wf-input" value={form.motivo} onChange={(e) => set("motivo", e.target.value)}>
              {motivos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="wf-label">Mensagem</label>
            <textarea
              className="wf-input min-h-[120px]"
              value={form.mensagem}
              onChange={(e) => set("mensagem", e.target.value)}
              required
            />
          </div>

          <button type="submit" className="wf-btn-primary w-full">
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
