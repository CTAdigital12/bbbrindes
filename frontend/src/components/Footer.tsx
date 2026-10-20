import Link from "next/link";
import Icon from "@/components/Icon";

// Rodape da identidade da Joy (mockup funcional, 16/10). 4 colunas + selos + barra
// inferior. A logo usa a classe .logo.white (mascara inline no design-system.css). Contatos
// e CNPJ vem do mockup (fonte da verdade do visual). Links apontam pras rotas reais.
export default function Footer() {
  return (
    <>
      <footer className="site">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <span className="logo white" style={{ width: 140, height: 36 }} aria-label="BB Brindes" />
              <p style={{ margin: "14px 0 0", maxWidth: "36ch" }}>
                BB Brindes, uma empresa Grupo BB. Industria brasileira de brindes corporativos
                personalizados, com fabrica propria ha&nbsp;27&nbsp;anos.
              </p>
              <div className="fcon">
                <a href="https://wa.me/5571994160138" target="_blank" rel="noopener">
                  <Icon name="brand-whatsapp" />
                  (71) 99416-0138
                </a>
                <a href="mailto:comercial@bbgrupo.com.br">
                  <Icon name="mail" />
                  comercial@bbgrupo.com.br
                </a>
                <span>
                  <Icon name="map-pin" />
                  Lauro de Freitas / BA
                </span>
              </div>
              <div className="soc">
                <a href="#" aria-label="Instagram">
                  <Icon name="brand-instagram" />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Icon name="brand-linkedin" />
                </a>
                <a href="#" aria-label="Facebook">
                  <Icon name="brand-facebook" />
                </a>
                <a href="#" aria-label="Pinterest">
                  <Icon name="brand-pinterest" />
                </a>
                <a href="#" aria-label="YouTube">
                  <Icon name="brand-youtube" />
                </a>
              </div>
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

          <div className="certs">
            <span>SGP</span>
            <span>PS&amp;C</span>
            <span>GMP</span>
            <span>NM300</span>
            <span>SMETA 4 Pilares</span>
          </div>

          <div className="fbot">
            <span>&copy; 2026 BB Brindes, uma empresa Grupo BB, CNPJ 11.158.637/0001-27</span>
            <span><Link href="/sac">Politica de privacidade</Link></span>
          </div>
        </div>
      </footer>

      <a
        className="wa-f"
        href="https://wa.me/5571994160138"
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp"
      >
        <Icon name="brand-whatsapp" />
      </a>
    </>
  );
}
