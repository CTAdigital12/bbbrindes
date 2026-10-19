import Link from "next/link";
import Icon from "@/components/Icon";
import { WA } from "@/data/home-joy";

// CTA final (finalCTA do mockup), compartilhado pelas paginas institucionais
// (quem-somos, cases). Server component estatico. Espelha o .final verbatim.
export default function FinalCta() {
  return (
    <div className="final">
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2>
          Monte seu orçamento.
          <br />
          Um especialista responde com a&nbsp;proposta.
        </h2>
        <p>
          Sem pagamento online. Você escolhe os produtos e a quantidade, e o time comercial retorna.
        </p>
      </div>
      <div className="bt">
        <Link className="btn btn-cta btn-lg" href="/catalogo">
          Começar meu orçamento
          <Icon name="arrow-right" />
        </Link>
        <a className="btn btn-ghost-w btn-lg" href={WA} target="_blank" rel="noopener">
          <Icon name="brand-whatsapp" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
