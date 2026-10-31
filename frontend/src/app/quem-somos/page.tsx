import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import FinalCta from "@/components/FinalCta";
import LinhaDoTempo from "@/components/LinhaDoTempo";
import { getConteudoInstitucional } from "@/lib/content";
import { img, imgSrc } from "@/lib/asset";
import { WA, nb, DIF } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Somos fábrica, não revenda: indústria brasileira de brindes corporativos do Grupo BB, com produção própria, escala nacional e atendimento comercial direto.",
};

// Numeros, sustentabilidade, certificacoes e galeria agora vem do global
// `conteudo-institucional` (getConteudoInstitucional), com fallback no mock. A
// linha do tempo (LinhaDoTempo) e os diferenciais (DIF, de home-joy) seguem no
// front por ora.
export default async function QuemSomosPage() {
  const { quemSomos } = await getConteudoInstitucional();
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Quem somos</span>
      </div>

      <div className="split">
        <div>
          <span className="eyebrow">{quemSomos.eyebrow}</span>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "40px",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              fontWeight: 600,
            }}
          >
            {nb(quemSomos.titulo)}
          </h1>
          <p>{quemSomos.paragrafo1}</p>
          <p>{quemSomos.paragrafo2}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
            <Link className="btn btn-cta" href="/catalogo">
              Ver todos os produtos
              <Icon name="arrow-right" />
            </Link>
            <a className="btn btn-ghost" href={WA} target="_blank" rel="noopener">
              <Icon name="brand-whatsapp" />
              Falar com o comercial
            </a>
          </div>
        </div>
        {/* Foto da fabrica: upload do painel (fotoFabrica) ou a padrao do site. */}
        <div className="ph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc(quemSomos.fotoFabrica)} alt="Fábrica própria da BB Brindes" />
        </div>
      </div>

      <div className="nums">
        {quemSomos.numeros.map((n) => (
          <div className="num" key={n.rotulo}>
            <b>{n.valor}</b>
            <span>{n.rotulo}</span>
          </div>
        ))}
      </div>

      <LinhaDoTempo />

      <section className="sec">
        <div className="shead">
          <div>
            <h2>Sustentabilidade</h2>
          </div>
        </div>
        <div className="dgrid">
          {quemSomos.sustentabilidade.map((s) => (
            <div className="dif" key={s.icone}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(`/img/icones/sustentabilidade-${s.icone}.svg`)} alt="" />
              <div>
                <b>{s.titulo}</b>
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
            <h2>Nossa fábrica</h2>
            <p>Produção própria em Lauro de Freitas (BA).</p>
          </div>
        </div>
        {/* Carrossel infinito: lista duplicada, anima ate -50% (a 2a metade e
            decorativa, aria-hidden). Pausa no hover; para em prefers-reduced-motion. */}
        <div className="fmq" aria-label="Fotos da fábrica">
          <div className="fmq-t">
            {[...quemSomos.galeria, ...quemSomos.galeria].map((g, i) => (
              <figure
                className="fab"
                key={`${g.imagem}-${i}`}
                aria-hidden={i >= quemSomos.galeria.length ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc(g.imagem)}
                  alt={i >= quemSomos.galeria.length ? "" : g.legenda}
                  loading="lazy"
                />
                <figcaption>{g.legenda}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="certbox">
          <div>
            <span className="eyebrow" style={{ color: "var(--lime)" }}>
              Certificações
            </span>
            <h2>Auditada no padrão SMETA 4 Pilares</h2>
            <p>
              Trabalho, saúde e segurança, meio ambiente e ética nos negócios.
              Somos uma das quatro empresas de brindes do Brasil com a SMETA 4
              Pilares, a auditoria que grandes compradores exigem dos seus
              fornecedores. Certificações globais, reconhecidas
              internacionalmente.
            </p>
          </div>
          <div className="selos">
            {quemSomos.selos.map((s) => (
              <div className="selo" key={s.sigla}>
                <i>{s.sigla}</i>
                <b>{s.desc}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
