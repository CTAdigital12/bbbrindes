import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Revendedores",
  description: "Seja um revendedor bbbrindes: acesso a precos tabelados, estoque e fechamento de pedido online.",
};

const beneficios = [
  "Precos tabelados exclusivos",
  "Consulta de estoque em tempo real",
  "Fechamento de pedido online",
  "Historico e segunda via de pedidos",
  "Upload de arquivos e notas por pedido",
  "Atendimento comercial dedicado",
];

export default function RevendedoresPage() {
  return (
    <div className="wf-container py-8">
      <div className="wf-card flex flex-col items-start gap-4 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-wf-ink">Seja um revendedor bbbrindes</h1>
          <p className="mt-2 text-sm text-wf-text">
            Tenha acesso a uma area exclusiva com precos, estoque e pedido online. Amplie seu mix de
            brindes com producao nacional.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/revendedor/login" className="wf-btn-primary">
            Ja sou revendedor
          </Link>
          <Link href="/contato" className="wf-btn-ghost">
            Quero me cadastrar
          </Link>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-wf-ink">Beneficios</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {beneficios.map((b) => (
          <div key={b} className="wf-card p-4 text-sm font-medium text-wf-ink">
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}
