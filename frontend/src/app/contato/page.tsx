"use client";

import { useState } from "react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Contato</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="wf-card space-y-2 p-4 text-sm">
            <p className="font-semibold text-wf-ink">Fale com a gente</p>
            <p className="text-wf-text">WhatsApp: (71) 99999-9999</p>
            <p className="text-wf-text">Email: contato@bbbrindes.com.br</p>
            <p className="text-wf-text">Lauro de Freitas / BA</p>
          </div>
          <div className="wf-img flex aspect-video w-full items-center justify-center rounded-lg">
            Mapa (placeholder)
          </div>
        </div>

        {enviado ? (
          <div className="wf-card p-6 text-sm text-wf-text">
            Mensagem enviada. Retornaremos em breve. (Wireframe: sem envio real.)
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEnviado(true);
            }}
            className="wf-card space-y-4 p-6"
          >
            <div>
              <label className="wf-label">Nome</label>
              <input className="wf-input" required />
            </div>
            <div>
              <label className="wf-label">Empresa</label>
              <input className="wf-input" />
            </div>
            <div>
              <label className="wf-label">Email</label>
              <input type="email" className="wf-input" required />
            </div>
            <div>
              <label className="wf-label">Mensagem</label>
              <textarea className="wf-input min-h-[120px]" required />
            </div>
            <button type="submit" className="wf-btn-primary w-full">
              Enviar mensagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
