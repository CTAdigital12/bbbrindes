import Link from "next/link";

const linksInstitucionais = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/blog", label: "Blog" },
  { href: "/catalogos", label: "Catalogos" },
  { href: "/revendedores", label: "Revendedores" },
  { href: "/sac", label: "SAC" },
  { href: "/contato", label: "Contato" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-wf-line bg-wf-surface">
      <div className="wf-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-wf-ink">
            bb<span className="text-wf-accent">brindes</span>
          </div>
          <p className="mt-2 text-sm text-wf-text">
            Industria 100% brasileira de brindes corporativos. Catalogo, orcamento e revenda.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-wf-ink">Institucional</h3>
          <ul className="space-y-1 text-sm text-wf-text">
            {linksInstitucionais.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-wf-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-wf-ink">Contato</h3>
          <ul className="space-y-1 text-sm text-wf-text">
            <li>WhatsApp: (71) 99999-9999</li>
            <li>contato@bbbrindes.com.br</li>
            <li>Lauro de Freitas / BA</li>
          </ul>
        </div>

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
          <span>2026 bbbrindes. Wireframe para aprovacao. Dados ficticios.</span>
          <Link href="/sac" className="hover:text-wf-accent">
            Politica de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
