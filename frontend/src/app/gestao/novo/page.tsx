"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categorias } from "@/data/categorias";
import { aplicacoes, faixaPrecoLabels, materiais } from "@/data/produtos";
import { adicionarManual } from "@/lib/lojista";

// Pagina sem equivalente no mockup: so reaplica o tema Joy. Toda a logica de
// cadastro (estado do form, cores/SKU, salvar via lojista) mantida intacta.
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
    <div className="bg-joy-paper">
      <div className="bg-joy-deep text-white">
        <div className="wrap flex items-center justify-between py-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-white/60">
              Administração do site
            </span>
            <h1 className="text-lg font-semibold">Adicionar produto</h1>
          </div>
          <Link href="/gestao" className="btn btn-ghost-w btn-sm">
            Voltar
          </Link>
        </div>
      </div>

      <div className="wrap py-6">
        <form onSubmit={salvar} className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Coluna principal */}
          <div className="space-y-4">
            <div className="space-y-4 rounded-joy bg-white p-5 shadow-joy1">
              <div className="fld">
                <label>Nome do produto</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} />
                {erro && <span className="mt-1 block text-xs text-[#c8202c]">{erro}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="fld">
                  <label>Categoria</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    {categorias.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="fld">
                  <label>Material</label>
                  <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                    {materiais.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="fld">
                <label>Descrição</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>

              <div className="fld">
                <label>Aplicações</label>
                <div className="flex flex-wrap gap-3">
                  {aplicacoes.map((a) => (
                    <label
                      key={a}
                      className="flex items-center gap-1.5 text-sm font-normal text-[#3e5148]"
                    >
                      <input type="checkbox" checked={aps.includes(a)} onChange={() => toggleAp(a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Variacoes de cor */}
            <div className="space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <span className="block text-[12.5px] font-semibold text-[#3e5148]">
                Variações de cor (cada cor é um SKU)
              </span>
              <div className="flex flex-wrap items-end gap-2">
                <input
                  className="h-11 w-40 rounded-[12px] border-0 bg-[#f3f5ec] px-3.5 text-sm text-joy-ink outline-none"
                  placeholder="Nome da cor"
                  value={corNome}
                  onChange={(e) => setCorNome(e.target.value)}
                />
                <input
                  type="color"
                  className="h-11 w-12 rounded-[12px] border border-joy-line"
                  value={corHex}
                  onChange={(e) => setCorHex(e.target.value)}
                  aria-label="Cor"
                />
                <button type="button" onClick={addCor} className="btn btn-ghost btn-sm">
                  Adicionar cor
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cores.map((c, i) => (
                  <span key={i} className="chip">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)" }}
                    />
                    {c.nome}
                    <button
                      type="button"
                      onClick={() => setCores((cs) => cs.filter((_, idx) => idx !== i))}
                      className="ml-1 text-joy-muted hover:text-joy-deep"
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
            <div className="space-y-4 rounded-joy bg-white p-5 shadow-joy1">
              <div className="fld">
                <label>Faixa de preço</label>
                <select value={faixaPreco} onChange={(e) => setFaixaPreco(e.target.value)}>
                  {Object.entries(faixaPrecoLabels).map(([valor, rotulo]) => (
                    <option key={valor} value={valor}>
                      {rotulo}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#3e5148]">
                <input
                  type="checkbox"
                  checked={personalizavel}
                  onChange={(e) => setPersonalizavel(e.target.checked)}
                />
                Personalizável
              </label>

              <div className="fld">
                <label>Imagens</label>
                <div className="flex min-h-[110px] flex-col items-center justify-center rounded-joy-sm border border-dashed border-joy-line bg-[#f3f5ec] text-center text-sm text-joy-muted">
                  <span>Arraste imagens aqui</span>
                  <span className="text-[10px]">ou clique para selecionar</span>
                </div>
                <input type="file" multiple className="mt-2 text-xs text-[#3e5148]" />
              </div>
            </div>

            <button type="submit" className="btn btn-cta btn-block">
              Salvar produto
            </button>
            <Link href="/gestao" className="btn btn-ghost btn-block">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
