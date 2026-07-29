"use client";

import { useState } from "react";
import type { ProdutoDetalhe } from "@/lib/types";

// Blocos de conteudo da PDP simulados no wireframe (S03-11), na ordem de
// docs/pdp-modelo-squeeze.md (Versao A). A descricao completa fica atras de um
// "Ver mais" para nao lotar a pagina. Itens marcados [a confirmar] sinalizam
// dado que ainda depende do cliente, para nao publicar informacao errada.
export default function ProdutoDetalheView({ detalhe }: { detalhe: ProdutoDetalhe }) {
  const [aberto, setAberto] = useState(false);

  return (
    <section className="mt-10 space-y-10 border-t border-wf-line pt-8">
      {/* A abertura foi movida para baixo do botao de orcamento (ProdutoView, revisao Plinio) */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Especificacoes */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-wf-ink">Especificações</h2>
          <dl className="divide-y divide-wf-line text-sm">
            {detalhe.especificacoes.map((e) => (
              <div key={e.rotulo} className="flex justify-between gap-4 py-2">
                <dt className="text-wf-muted">{e.rotulo}</dt>
                <dd className="text-right font-medium text-wf-ink">{e.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Beneficios */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-wf-ink">Principais benefícios</h2>
          <ul className="space-y-2 text-sm text-wf-text">
            {detalhe.beneficios.map((b) => (
              <li key={b} className="flex gap-2">
                <span aria-hidden className="text-wf-accent">
                  •
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ideal para */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Ideal para</h2>
        <div className="flex flex-wrap gap-2">
          {detalhe.idealPara.map((i) => (
            <span
              key={i}
              className="rounded-full border border-wf-line bg-wf-surface px-3 py-1 text-xs text-wf-text"
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Descricao completa com Ver mais */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Descrição completa</h2>
        <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-wf-text">
          <p>{detalhe.descricaoCompleta[0]}</p>
          {aberto &&
            detalhe.descricaoCompleta.slice(1).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {detalhe.descricaoCompleta.length > 1 && (
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="wf-btn-ghost mt-3"
            aria-expanded={aberto}
          >
            {aberto ? "Ver menos" : "Ver mais"}
          </button>
        )}
      </div>

      {/* Diferenciais e selos */}
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-wf-ink">Diferenciais da BB neste produto</h2>
          <ul className="space-y-2 text-sm text-wf-text">
            {detalhe.diferenciais.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden className="text-wf-accent">
                  •
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-wf-ink">Selos</h2>
          <div className="flex flex-wrap gap-2">
            {detalhe.selos.map((s) => (
              <span
                key={s}
                className="rounded-md border border-wf-accent/40 bg-wf-accent/10 px-3 py-1 text-xs font-medium text-wf-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Perguntas frequentes</h2>
        <div className="max-w-3xl divide-y divide-wf-line">
          {detalhe.faq.map((f) => (
            <details key={f.pergunta} className="group py-3">
              <summary className="cursor-pointer list-none text-sm font-medium text-wf-ink marker:hidden">
                <span className="inline-flex items-center gap-2">
                  {f.pergunta}
                  {f.aConfirmar && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      a confirmar
                    </span>
                  )}
                </span>
              </summary>
              <p className="mt-2 text-sm text-wf-text">{f.resposta}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Pendencias: uso interno do wireframe, dado que depende do cliente */}
      {detalhe.pendencias && detalhe.pendencias.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Pendências a confirmar com o cliente (nota do wireframe)
          </p>
          <ul className="space-y-1 text-sm text-amber-900">
            {detalhe.pendencias.map((p) => (
              <li key={p} className="flex gap-2">
                <span aria-hidden>⚠</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
