"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";

type Form = { nome: string; empresa: string; telefone: string; email: string };
type Erros = Partial<Record<keyof Form, string>>;

export default function OrcamentoPage() {
  const { itens, alterarQuantidade, remover, limpar } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Form>({ nome: "", empresa: "", telefone: "", email: "" });
  const [erros, setErros] = useState<Erros>({});

  function validar(): boolean {
    const e: Erros = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome.";
    if (!form.empresa.trim()) e.empresa = "Informe a empresa.";
    if (!form.telefone.trim()) e.telefone = "Informe o telefone.";
    if (!form.email.trim()) e.email = "Informe o email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalido.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (itens.length === 0 || !validar()) return;
    // Snapshot para a tela de confirmacao (integracao real com Leads2b/CRM e Sprint 3).
    const resumo = {
      solicitante: form,
      itens,
      total: itens.reduce((a, i) => a + i.quantidade, 0),
    };
    window.localStorage.setItem("bbbrindes:ultimo-pedido", JSON.stringify(resumo));
    limpar();
    router.push("/orcamento/sucesso");
  }

  function setCampo<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="wf-container py-6">
      <h1 className="mb-4 text-xl font-semibold text-wf-ink">Orcamento</h1>

      {itens.length === 0 ? (
        <div className="wf-card p-10 text-center">
          <p className="text-sm text-wf-text">Seu orcamento esta vazio.</p>
          <Link href="/catalogo" className="wf-btn-primary mt-4">
            Ir para o catalogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Itens */}
          <div className="space-y-3">
            {itens.map((item, i) => (
              <div key={`${item.produtoSlug}-${item.cor}`} className="wf-card flex gap-3 p-3">
                <div className="wf-img h-20 w-20 shrink-0 rounded">Img</div>
                <div className="flex flex-1 flex-col">
                  <Link href={`/produto/${item.produtoSlug}`} className="text-sm font-medium text-wf-ink hover:text-wf-accent">
                    {item.nome}
                  </Link>
                  <span className="text-xs text-wf-muted">Cor: {item.cor}</span>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={(e) => alterarQuantidade(i, Number(e.target.value) || 1)}
                      className="wf-input w-20"
                      aria-label="Quantidade"
                    />
                    <button type="button" onClick={() => remover(i)} className="text-xs text-wf-muted hover:text-wf-accent">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={enviar} className="wf-card h-fit space-y-4 p-4" noValidate>
            <h2 className="text-sm font-semibold text-wf-ink">Dados para contato</h2>
            <Campo label="Nome" valor={form.nome} erro={erros.nome} onChange={(v) => setCampo("nome", v)} />
            <Campo label="Empresa" valor={form.empresa} erro={erros.empresa} onChange={(v) => setCampo("empresa", v)} />
            <Campo label="Telefone / WhatsApp" valor={form.telefone} erro={erros.telefone} onChange={(v) => setCampo("telefone", v)} />
            <Campo label="Email" tipo="email" valor={form.email} erro={erros.email} onChange={(v) => setCampo("email", v)} />

            <button type="submit" className="wf-btn-primary w-full">
              Enviar pedido de orcamento
            </button>
            <p className="text-xs text-wf-muted">
              Ao enviar, seus dados sao usados apenas para o contato comercial (LGPD). Sem pagamento online.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

function Campo({
  label,
  valor,
  erro,
  tipo = "text",
  onChange,
}: {
  label: string;
  valor: string;
  erro?: string;
  tipo?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="wf-label">{label}</label>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="wf-input"
        aria-invalid={!!erro}
      />
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </div>
  );
}
