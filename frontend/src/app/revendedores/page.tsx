import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { img } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Revendedores",
  description:
    "Seja um revendedor BB Brindes: área exclusiva com preços, estoque e pedido online, com produção nacional.",
};

const BENEFICIOS = [
  "Preços tabelados exclusivos",
  "Consulta de estoque em tempo real",
  "Fechamento de pedido online",
  "Histórico e segunda via de pedidos",
  "Upload de arquivos e notas por pedido",
  "Atendimento comercial dedicado",
];

export default function RevendedoresPage() {
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Revendedores</span>
      </div>

      <div className="urg" style={{ marginTop: "18px" }}>
        <div className="tx">
          <span className="chip chip-lime" style={{ alignSelf: "flex-start" }}>
            <Icon name="building-store" />
            Revenda
          </span>
          <h2>Seja um revendedor BB&nbsp;Brindes</h2>
          <p>
            Tenha acesso a uma área exclusiva com preços, estoque e pedido online. Amplie seu mix de
            brindes com produção nacional.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link className="btn btn-cta btn-lg" href="/contato">
              Quero me cadastrar
              <Icon name="arrow-right" />
            </Link>
            <Link className="btn btn-ghost-w btn-lg" href="/revendedor/login">
              Já sou revendedor
            </Link>
          </div>
        </div>
        <div className="ph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("/img/foto/MV02142G-copo-cancun-ecologico-green-fibras-mug-320ml.webp")}
            alt=""
          />
        </div>
        <span className="deco" />
      </div>

      <section className="sec">
        <div className="shead">
          <div>
            <h2>Benefícios</h2>
          </div>
        </div>
        <div className="dgrid">
          {BENEFICIOS.map((b) => (
            <div className="dif" key={b}>
              <span
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: "var(--deep)",
                  color: "var(--lime)",
                  display: "grid",
                  placeItems: "center",
                  flex: "none",
                }}
              >
                <Icon name="check" />
              </span>
              <div>
                <b>{b}</b>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
