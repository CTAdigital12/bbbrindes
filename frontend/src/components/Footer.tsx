import Link from "next/link";
import Icon from "@/components/Icon";
import type { SiteConfig } from "@/lib/types";

// Rodape da identidade da Joy (mockup funcional, 16/10). 4 colunas + selos + barra
// inferior. A logo usa a classe .logo.white (mascara inline no design-system.css).
// Contato, redes, selos, CNPJ e blurb vem do Global `configuracoes` (getConfig no
// layout), editaveis no admin (FB-6). Links apontam pras rotas reais.
export default function Footer({ config }: { config: SiteConfig }) {
  const wa = `https://wa.me/${config.whatsapp}`;

  // Redes sociais: so entram as que tem URL cadastrada (vazia = icone escondido).
  const redes: { url: string; icon: string; label: string }[] = [
    { url: config.redes.instagram, icon: "brand-instagram", label: "Instagram" },
    { url: config.redes.linkedin, icon: "brand-linkedin", label: "LinkedIn" },
    { url: config.redes.facebook, icon: "brand-facebook", label: "Facebook" },
    { url: config.redes.pinterest, icon: "brand-pinterest", label: "Pinterest" },
    { url: config.redes.youtube, icon: "brand-youtube", label: "YouTube" },
  ].filter((r) => r.url);

  return (
    <>
      <footer className="site">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <span className="logo white" style={{ width: 140, height: 36 }} aria-label="BB Brindes" />
              <p style={{ margin: "14px 0 0", maxWidth: "36ch" }}>{config.descricao}</p>
              <div className="fcon">
                <a href={wa} target="_blank" rel="noopener">
                  <Icon name="brand-whatsapp" />
                  {config.telefone}
                </a>
                <a href={`mailto:${config.email}`}>
                  <Icon name="mail" />
                  {config.email}
                </a>
                <span>
                  <Icon name="map-pin" />
                  {config.endereco}
                </span>
              </div>
              {redes.length > 0 && (
                <div className="soc">
                  {redes.map((r) => (
                    <a key={r.label} href={r.url} target="_blank" rel="noopener" aria-label={r.label}>
                      <Icon name={r.icon} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4>Institucional</h4>
              <ul>
                <li><Link href="/quem-somos">Quem somos</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/catalogos">Catalogos</Link></li>
                <li><Link href="/contato">Contato</Link></li>
                <li><Link href="/sac">SAC</Link></li>
              </ul>
            </div>

            <div>
              <h4>Revenda</h4>
              <ul>
                <li><Link href="/revendedores">Seja revendedor</Link></li>
                <li><Link href="/revendedor/login">Area do revendedor</Link></li>
              </ul>
              <h4 style={{ marginTop: 22 }}>Compre</h4>
              <ul>
                <li><Link href="/catalogo">Catalogo completo</Link></li>
                <li><Link href="/orcamento">Meu orcamento</Link></li>
              </ul>
            </div>

            <div>
              <h4>Cases e imprensa</h4>
              <ul>
                <li><Link href="/cases">Cases</Link></li>
                <li><Link href="/imprensa">Imprensa</Link></li>
              </ul>
            </div>
          </div>

          {config.selos.length > 0 && (
            <div className="certs">
              {config.selos.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}

          <div className="fbot">
            <span>&copy; 2026 BB Brindes, uma empresa Grupo BB, CNPJ {config.cnpj}</span>
            <span><Link href="/politica-de-privacidade">Politica de privacidade</Link></span>
          </div>
        </div>
      </footer>

      <a
        className="wa-f"
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp"
      >
        {/* Mensagem revelada no hover (expande o botao numa pilula); aria-hidden
            porque o aria-label ja da o nome acessivel do link. */}
        <span className="wa-msg" aria-hidden="true">
          Com urgência? Fala no WhatsApp
        </span>
        <Icon name="brand-whatsapp" />
      </a>
    </>
  );
}
