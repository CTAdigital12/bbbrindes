import type { Metadata } from "next";
import { diferenciais } from "@/data/banners";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "Industria 100% brasileira de brindes corporativos, com foco em sustentabilidade e qualidade.",
};

export default function QuemSomosPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Quem Somos</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm text-wf-text">
          <p>
            Industria 100% brasileira de brindes corporativos. Producao propria, controle de
            qualidade e compromisso com a sustentabilidade.
          </p>
          <p>
            Atendemos empresas e revendedores em todo o pais, com catalogo amplo, personalizacao e
            atendimento comercial direto.
          </p>
          <p className="text-xs text-wf-muted">Texto de exemplo. Conteudo final via CMS (Sprint 5).</p>
        </div>
        <div className="wf-img aspect-video w-full rounded-lg">Imagem institucional</div>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-wf-ink">Nossos diferenciais</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {diferenciais.map((d) => (
          <div key={d} className="wf-card flex items-center gap-3 p-3">
            <span className="wf-img h-9 w-9 rounded-full" />
            <span className="text-sm font-medium text-wf-ink">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
