import type { Metadata } from "next";
import Link from "next/link";
import { diferenciais } from "@/data/banners";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Industria 100% brasileira de brindes corporativos, parte do Grupo BB, com foco em sustentabilidade, escala e qualidade.",
};

const numeros = [
  { valor: "20+ anos", rotulo: "de mercado" },
  { valor: "1200+", rotulo: "produtos no catalogo" },
  { valor: "Milhoes", rotulo: "de pecas por ano" },
  { valor: "100%", rotulo: "producao nacional" },
];

const sustentabilidade = [
  "Produtos livres de BPA e materiais reciclados",
  "Reducao de plastico virgem na linha ecologica",
  "Producao propria com controle de qualidade",
];

export default function QuemSomosPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Quem Somos</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm text-wf-text">
          <p>
            Industria 100% brasileira de brindes corporativos e parte do Grupo BB, um grupo
            consolidado no mercado. Producao propria, escala nacional e atendimento comercial
            direto.
          </p>
          <p>
            Atendemos empresas e revendedores em todo o pais, com catalogo amplo, personalizacao e
            compromisso com prazo e qualidade.
          </p>
          <p className="text-xs text-wf-muted">Texto de exemplo. Conteudo final via CMS (Sprint 5).</p>
        </div>
        <div className="wf-img flex aspect-video w-full items-center justify-center rounded-lg text-sm text-wf-ink">
          Imagem institucional / Grupo BB
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {numeros.map((n) => (
          <div key={n.rotulo} className="wf-card p-4 text-center">
            <div className="text-xl font-bold text-wf-ink">{n.valor}</div>
            <div className="mt-1 text-xs text-wf-text">{n.rotulo}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-wf-ink">Sustentabilidade</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {sustentabilidade.map((s) => (
          <div key={s} className="wf-card flex items-start gap-3 p-4">
            <span className="wf-img h-9 w-9 shrink-0 rounded-full" aria-hidden="true" />
            <span className="text-sm text-wf-ink">{s}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-wf-ink">Nossos diferenciais</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {diferenciais.map((d) => (
          <div key={d.nome} className="wf-card flex items-center gap-3 p-3">
            <span className="wf-img h-9 w-9 rounded-full" />
            <span className="text-sm font-medium text-wf-ink">{d.nome}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link href="/cases" className="wf-card flex items-center justify-between p-6 hover:shadow-md">
          <div>
            <h3 className="text-sm font-semibold text-wf-ink">Cases e prova social</h3>
            <p className="mt-1 text-xs text-wf-text">Clientes, campanhas e depoimentos.</p>
          </div>
          <span className="text-sm font-medium text-wf-accent">Ver</span>
        </Link>
        <Link href="/imprensa" className="wf-card flex items-center justify-between p-6 hover:shadow-md">
          <div>
            <h3 className="text-sm font-semibold text-wf-ink">Imprensa</h3>
            <p className="mt-1 text-xs text-wf-text">A bbbrindes e o Grupo BB na midia.</p>
          </div>
          <span className="text-sm font-medium text-wf-accent">Ver</span>
        </Link>
      </div>
    </div>
  );
}
