import Link from "next/link";

// Rodape reorganizado conforme a revisao do Plinio (S01-12): institucional,
// revenda e a coluna de cases/imprensa, mantendo versao e contato.
const colunas: { titulo: string; links: { href: string; label: string }[] }[] = [
  {
    titulo: "Institucional",
    links: [
      { href: "/quem-somos", label: "Quem Somos" },
      { href: "/blog", label: "Blog" },
      { href: "/catalogos", label: "Catalogos" },
      { href: "/contato", label: "Contato" },
      { href: "/sac", label: "SAC" },
    ],
  },
  {
    titulo: "Revenda",
    links: [
      { href: "/revendedores", label: "Revendedores" },
      { href: "/revendedor/login", label: "Area do revendedor" },
    ],
  },
  {
    titulo: "Cases e imprensa",
    links: [
      { href: "/cases", label: "Cases" },
      { href: "/imprensa", label: "Imprensa" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-wf-line bg-wf-surface">
      <div className="wf-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="text-lg font-bold text-wf-ink">
            bb<span className="text-wf-accent">brindes</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-wf-text">
            Industria 100% brasileira de brindes corporativos. Catalogo, orcamento e revenda.
          </p>
          <div className="mt-4 text-sm text-wf-text">
            <p>WhatsApp: (71) 99999-9999</p>
            <p>contato@bbbrindes.com.br</p>
            <p>Lauro de Freitas / BA</p>
          </div>
        </div>

        {colunas.map((col) => (
          <div key={col.titulo}>
            <h3 className="mb-2 text-sm font-semibold text-wf-ink">{col.titulo}</h3>
            <ul className="space-y-1 text-sm text-wf-text">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-wf-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-wf-ink">Redes</h3>
          <ul className="space-y-1 text-sm text-wf-text">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-wf-line">
        <div className="wf-container flex flex-col gap-2 py-4 text-xs text-wf-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            2026 bbbrindes. Wireframe para aprovacao. Dados ficticios.{" "}
            {`v${process.env.NEXT_PUBLIC_APP_VERSION ?? ""}`}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/gestao" className="hover:text-wf-accent">
              Admin do site
            </Link>
            <Link href="/sac" className="hover:text-wf-accent">
              Politica de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
