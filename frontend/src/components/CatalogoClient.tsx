"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/lib/types";
import { categorias } from "@/data/categorias";
import { aplicacoes, faixaPrecoLabels, materiais, produtos } from "@/data/produtos";
import ProductCard from "@/components/ProductCard";

type Filtros = {
  q: string;
  categoria: string;
  material: string;
  aplicacao: string;
  faixa: string;
  cor: string;
  somentePersonalizavel: boolean;
};

const coresFiltro = ["Branco", "Preto", "Azul", "Verde", "Vermelho", "Amarelo", "Laranja", "Natural"];

export default function CatalogoClient({ inicial }: { inicial: Partial<Filtros> }) {
  const [f, setF] = useState<Filtros>({
    q: inicial.q ?? "",
    categoria: inicial.categoria ?? "",
    material: inicial.material ?? "",
    aplicacao: inicial.aplicacao ?? "",
    faixa: inicial.faixa ?? "",
    cor: inicial.cor ?? "",
    somentePersonalizavel: inicial.somentePersonalizavel ?? false,
  });

  const resultados = useMemo(() => filtrar(produtos, f), [f]);

  function set<K extends keyof Filtros>(chave: K, valor: Filtros[K]) {
    setF((atual) => ({ ...atual, [chave]: valor }));
  }

  function limpar() {
    setF({ q: "", categoria: "", material: "", aplicacao: "", faixa: "", cor: "", somentePersonalizavel: false });
  }

  return (
    <div className="wf-container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-wf-ink">Catalogo</h1>
        <span className="text-sm text-wf-muted">{resultados.length} produto(s)</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filtros */}
        <aside className="wf-card h-fit space-y-4 p-4">
          <div>
            <label className="wf-label" htmlFor="busca">
              Busca
            </label>
            <input
              id="busca"
              className="wf-input"
              placeholder="Nome ou palavra-chave"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>

          <Select label="Categoria" valor={f.categoria} onChange={(v) => set("categoria", v)}
            opcoes={categorias.map((c) => ({ valor: c.slug, rotulo: c.nome }))} />

          <Select label="Material" valor={f.material} onChange={(v) => set("material", v)}
            opcoes={materiais.map((m) => ({ valor: m, rotulo: m }))} />

          <Select label="Aplicacao" valor={f.aplicacao} onChange={(v) => set("aplicacao", v)}
            opcoes={aplicacoes.map((a) => ({ valor: a, rotulo: a }))} />

          <Select label="Faixa de preco" valor={f.faixa} onChange={(v) => set("faixa", v)}
            opcoes={Object.entries(faixaPrecoLabels).map(([valor, rotulo]) => ({ valor, rotulo }))} />

          <Select label="Cor" valor={f.cor} onChange={(v) => set("cor", v)}
            opcoes={coresFiltro.map((c) => ({ valor: c, rotulo: c }))} />

          <label className="flex items-center gap-2 text-sm text-wf-text">
            <input
              type="checkbox"
              checked={f.somentePersonalizavel}
              onChange={(e) => set("somentePersonalizavel", e.target.checked)}
            />
            Somente personalizaveis
          </label>

          <button type="button" onClick={limpar} className="wf-btn-ghost w-full">
            Limpar filtros
          </button>
        </aside>

        {/* Resultados */}
        <div>
          {resultados.length === 0 ? (
            <div className="wf-card p-10 text-center text-sm text-wf-muted">
              Nenhum produto encontrado com esses filtros.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {resultados.map((p) => (
                <ProductCard key={p.slug} produto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  valor,
  onChange,
  opcoes,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  opcoes: { valor: string; rotulo: string }[];
}) {
  return (
    <div>
      <label className="wf-label">{label}</label>
      <select className="wf-input" value={valor} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

function filtrar(lista: Produto[], f: Filtros): Produto[] {
  const q = f.q.trim().toLowerCase();
  return lista.filter((p) => {
    if (q && !`${p.nome} ${p.descricao} ${p.material}`.toLowerCase().includes(q)) return false;
    if (f.categoria && p.categoria !== f.categoria) return false;
    if (f.material && p.material !== f.material) return false;
    if (f.aplicacao && !p.aplicacoes.includes(f.aplicacao)) return false;
    if (f.faixa && p.faixaPreco !== f.faixa) return false;
    if (f.cor && !p.cores.some((c) => c.nome === f.cor)) return false;
    if (f.somentePersonalizavel && !p.personalizavel) return false;
    return true;
  });
}
