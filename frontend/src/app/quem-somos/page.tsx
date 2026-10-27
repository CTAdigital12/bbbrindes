import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import FinalCta from "@/components/FinalCta";
import { img } from "@/lib/asset";
import { WA, nb, DIF } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Somos fábrica, não revenda: indústria brasileira de brindes corporativos do Grupo BB, com produção própria, escala nacional e atendimento comercial direto.",
};

// Numeros institucionais (mockup quem()): 27 anos / 500 un. / 100% / 5.
const NUMS: [valor: string, rotulo: string][] = [
  ["27 anos", "de mercado"],
  ["500 un.", "pedido mínimo"],
  ["100%", "produção nacional"],
  ["5", "certificações de qualidade"],
];

// Sustentabilidade (icone sustentabilidade-<slug>.svg, titulo).
const SUST: [slug: string, titulo: string][] = [
  ["livres-de-bpa-e-reciclados", "Produtos livres de BPA e materiais reciclados"],
  ["menos-plastico-virgem", "Redução de plástico virgem na linha ecológica"],
  ["controle-de-qualidade", "Produção própria com controle de qualidade"],
];

// Galeria institucional (fotos reais do cliente, extraidas do PDF): fabrica,
// maquinario, producao em escala e presenca em feiras.
const GALERIA: [arquivo: string, alt: string][] = [
  ["inst-05.webp", "Máquina de injeção e sopro na fábrica"],
  ["inst-04.webp", "Produção de squeezes da linha ecológica"],
  ["inst-02.webp", "Lote de squeezes personalizados"],
  ["inst-03.webp", "Produtos em In Mold Label"],
  ["inst-06.webp", "Estande da BB Brindes em feira do setor"],
  ["inst-07.webp", "BB Brindes em feira do setor"],
];

export default function QuemSomosPage() {
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Quem somos</span>
      </div>

      <div className="split">
        <div>
          <span className="eyebrow">Quem somos</span>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "40px",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              fontWeight: 600,
            }}
          >
            Somos fábrica, não&nbsp;revenda.
          </h1>
          <p>
            A BB Brindes, empresa do Grupo BB, é uma indústria brasileira de brindes corporativos.
            Produção própria, escala nacional e atendimento comercial direto.
          </p>
          <p>
            Atendemos empresas e revendedores em todo o país, com catálogo amplo, personalização da
            sua marca e compromisso com prazo e qualidade.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <Link className="btn btn-cta" href="/catalogo">
              Ver catálogo
              <Icon name="arrow-right" />
            </Link>
            <a className="btn btn-ghost" href={WA} target="_blank" rel="noopener">
              <Icon name="brand-whatsapp" />
              Falar com o comercial
            </a>
          </div>
        </div>
        {/* Foto real da fabrica (extraida do PDF institucional do cliente). */}
        <div className="ph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("/img/institucional/inst-01.webp")} alt="Fábrica própria da BB Brindes" />
        </div>
      </div>

      <div className="nums">
        {NUMS.map(([valor, rotulo]) => (
          <div className="num" key={rotulo}>
            <b>{valor}</b>
            <span>{rotulo}</span>
          </div>
        ))}
      </div>

      <section className="sec">
        <div className="shead">
          <div>
            <h2>Sustentabilidade</h2>
          </div>
        </div>
        <div className="dgrid">
          {SUST.map(([slug, titulo]) => (
            <div className="dif" key={slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(`/img/icones/sustentabilidade-${slug}.svg`)} alt="" />
              <div>
                <b>{titulo}</b>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="shead">
          <div>
            <h2>Nossos diferenciais</h2>
          </div>
        </div>
        <div className="dgrid">
          {DIF.map(([slug, titulo, sub]) => (
            <div className="dif" key={slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(`/img/icones/diferencial-${slug}.svg`)} alt="" />
              <div>
                <b>{titulo}</b>
                <span>{nb(sub)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="shead">
          <div>
            <h2>Por dentro da BB Brindes</h2>
          </div>
        </div>
        <div className="inst-gal">
          {GALERIA.map(([arquivo, alt]) => (
            <div className="inst-ph" key={arquivo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(`/img/institucional/${arquivo}`)} alt={alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
