"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categorias } from "@/data/categorias";
import { aplicacoes, faixaPrecoLabels, materiais } from "@/data/produtos";
import { adicionarManual } from "@/lib/lojista";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]?.slug ?? "");
  const [material, setMaterial] = useState(materiais[0] ?? "");
  const [faixaPreco, setFaixaPreco] = useState<string>("4-a-15");
  const [descricao, setDescricao] = useState("");
  const [aps, setAps] = useState<string[]>([]);
  const [cores, setCores] = useState<{ nome: string; hex: string }[]>([]);
  const [corNome, setCorNome] = useState("");
  const [corHex, setCorHex] = useState("#3f6212");
  const [personalizavel, setPersonalizavel] = useState(false);
  const [erro, setErro] = useState("");

  function toggleAp(a: string) {
    setAps((atual) => (atual.includes(a) ? atual.filter((x) => x !== a) : [...atual, a]));
  }

  function addCor() {
    const n = corNome.trim();
    if (!n) return;
    setCores((c) => [...c, { nome: n, hex: corHex }]);
    setCorNome("");
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }
    adicionarManual({
      nome: nome.trim(),
      categoria,
      descricao: descricao.trim(),
      material,
      aplicacoes: aps,
      cores,
      personalizavel,
      faixaPreco,
    });
    router.push("/gestao");
  }

  return (
    <div className="bg-wf-bg">
      <div className="border-b border-wf-line bg-wf-ink text-white">
        <div className="wf-container flex items-center justify-between py-3">
          <div>
            <span className="text-xs uppercase tracking-wide text-wf-muted">Area do lojista</span>
            <h1 className="text-lg font-semibold">Adicionar produto</h1>
          </div>
          <Link href="/gestao" className="wf-btn-ghost text-wf-ink">
            Voltar
          </Link>
        </div>
      </div>

      <div className="wf-container py-6">
        <form onSubmit={salvar} className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Coluna principal */}
          <div className="space-y-4">
            <div className="wf-card space-y-4 p-4">
              <div>
                <label className="wf-label">Nome do produto</label>
                <input className="wf-input" value={nome} onChange={(e) => setNome(e.target.value)} />
                {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="wf-label">Categoria</label>
                  <select className="wf-input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    {categorias.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="wf-label">Material</label>
                  <select className="wf-input" value={material} onChange={(e) => setMaterial(e.target.value)}>
                    {materiais.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="wf-label">Descricao</label>
                <textarea
                  className="wf-input min-h-[100px]"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div>
                <span className="wf-label">Aplicacoes</span>
                <div className="flex flex-wrap gap-2">
                  {aplicacoes.map((a) => (
                    <label key={a} className="flex items-center gap-1 text-sm text-wf-text">
                      <input type="checkbox" checked={aps.includes(a)} onChange={() => toggleAp(a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Variacoes de cor */}
            <div className="wf-card space-y-3 p-4">
              <span className="wf-label">Variacoes de cor</span>
              <div className="flex flex-wrap items-end gap-2">
                <input
                  className="wf-input w-40"
                  placeholder="Nome da cor"
                  value={corNome}
                  onChange={(e) => setCorNome(e.target.value)}
                />
                <input
                  type="color"
                  className="h-9 w-12 rounded border border-wf-line"
                  value={corHex}
                  onChange={(e) => setCorHex(e.target.value)}
                  aria-label="Cor"
                />
                <button type="button" onClick={addCor} className="wf-btn-ghost">
                  Adicionar cor
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cores.map((c, i) => (
                  <span key={i} className="wf-chip flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full border border-wf-line" style={{ backgroundColor: c.hex }} />
                    {c.nome}
                    <button
                      type="button"
                      onClick={() => setCores((cs) => cs.filter((_, idx) => idx !== i))}
                      className="ml-1 text-wf-muted hover:text-wf-accent"
                      aria-label={`Remover ${c.nome}`}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-4">
            <div className="wf-card space-y-4 p-4">
              <div>
                <label className="wf-label">Faixa de preco</label>
                <select className="wf-input" value={faixaPreco} onChange={(e) => setFaixaPreco(e.target.value)}>
                  {Object.entries(faixaPrecoLabels).map(([valor, rotulo]) => (
                    <option key={valor} value={valor}>
                      {rotulo}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-wf-text">
                <input
                  type="checkbox"
                  checked={personalizavel}
                  onChange={(e) => setPersonalizavel(e.target.checked)}
                />
                Personalizavel
              </label>

              <div>
                <span className="wf-label">Imagens</span>
                <div className="wf-img flex min-h-[110px] flex-col items-center justify-center rounded border border-dashed border-wf-muted text-center">
                  <span>Arraste imagens aqui</span>
                  <span className="text-[10px]">ou clique para selecionar</span>
                </div>
                <input type="file" multiple className="mt-2 text-xs text-wf-text" />
              </div>
            </div>

            <button type="submit" className="wf-btn-primary w-full">
              Salvar produto
            </button>
            <Link href="/gestao" className="wf-btn-ghost w-full">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
