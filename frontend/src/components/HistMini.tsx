import Link from "next/link";
import Icon from "@/components/Icon";
import { img } from "@/lib/asset";
import { HIST_MINI } from "@/data/historia";

// Teaser compacto da linha do tempo (mockup 28/10). Fica na pagina de produto e
// no catalogo digital. Cada card leva uma foto do ano (reusa o mesmo banco do
// mostrador do quem-somos: public/img/historia/<ano>.webp). A timeline completa
// (com mostrador) fica no quem-somos.
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hmph"
              src={img(`/img/historia/${m.ano}.webp`)}
              alt=""
              loading="lazy"
            />
            <div className="hmb">
              <b>{m.ano}</b>
              <span>{m.titulo}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
