import Link from "next/link";
import Icon from "@/components/Icon";
import { HIST_MINI } from "@/data/historia";

// Teaser compacto da linha do tempo (mockup 28/10). Fica na pagina de produto,
// entre o detalhe do produto e os relacionados. So texto; a timeline completa
// (com fotos e mostrador) fica no quem-somos.
export default function HistMini() {
  return (
    <section className="sec hmini">
      <div className="hmh">
        <h2 className="h">27 anos fabricando brindes</h2>
        <Link className="link" href="/quem-somos">
          Conheça a nossa história
          <Icon name="arrow-right" />
        </Link>
      </div>
      <ol>
        {HIST_MINI.map((m) => (
          <li key={m.ano}>
            <b>{m.ano}</b>
            <span>{m.titulo}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
