import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { campanhaPorSlug, campanhas } from "@/data/campanhas";
import { getProdutos } from "@/lib/produtos";
import { CAMP_TILE, nb } from "@/data/home-joy";
import { img } from "@/lib/asset";
import type { Produto } from "@/lib/types";
import ProductCardJoy from "@/components/ProductCardJoy";
import FinalCta from "@/components/FinalCta";
import Icon from "@/components/Icon";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return campanhas.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = campanhaPorSlug(slug);
  if (!c) return { title: "Campanha" };
  return {
    title: `Campanha ${c.nome}`,
    description: `Brindes corporativos para a campanha ${c.nome} (${c.mes}).`,
  };
}

// Cabecalho de secao (shead do mockup): titulo, subtitulo e link opcionais.
function SectionHead({
  title,
  sub,
  link,
  linkText,
}: {
  title: string;
  sub?: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="shead">
      <div>
        <h2>{title}</h2>
        {sub ? <p>{nb(sub)}</p> : null}
      </div>
      {link ? (
        <Link className="link" href={link}>
          {linkText}
          <Icon name="arrow-right" />
        </Link>
      ) : null}
    </div>
  );
}

// Meses por extenso para calcular o mes de corte (~2 meses antes da data), como
// o mockup (mesN[(mi+10)%12]). Normaliza acentos para casar com o mes da campanha
// (os dados usam "Marco" sem cedilha; aqui comparamos sem acento).
const MESES_NOME = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Como funciona: 4 passos (steps do mockup), VERBATIM.
const PASSOS: [titulo: string, texto: string][] = [
  ["Escolha os produtos", "Adicione ao orçamento os itens e as quantidades."],
  ["Envie sua marca", "O especialista recebe o pedido e pede a sua logomarca."],
  ["Aprove a arte", "Você aprova o layout antes da produção."],
  ["Receba no prazo", "Fabricamos e entregamos em todo o Brasil."],
];

// Landing de campanha (destino de anuncios/LPs). Espelha a campanha() do mockup
// funcional da Joy. Server component: le os produtos reais (getProdutos) e mostra
// uma curadoria sensata, ja que ainda NAO existe mapeamento campanha->produto no
// dado real (ver relatorio da F7). Mantem generateStaticParams/metadata.
export default async function CampanhaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = campanhaPorSlug(slug);
  if (!c) notFound();

  // Mes de corte (~40 a 60 dias antes): 2 meses antes da data, como o mockup.
  const mi = MESES_NOME.findIndex((m) => semAcento(m) === semAcento(c.mes));
  const fecha = mi >= 0 ? MESES_NOME[(mi + 10) % 12].toLowerCase() : "";

  // Imagem de topo: mesma base do tile (CAMP_TILE). Campanhas sem arte (ex.:
  // ano-novo) renderizam o hero so com o fundo escuro.
  const base = CAMP_TILE[slug];
  const heroImg = base ? img(`/img/banners/campanha-topo-${base}.webp`) : "";

  // Curadoria campanha -> produto: sem mapeamento no dado real, prioriza
  // ecologicos (carro-chefe da marca) e lancamentos, depois completa, 8 itens.
  const todos = await getProdutos();
  const peso = (p: Produto) =>
    ((p.tags ?? []).includes("ecologico") ? 2 : 0) +
    ((p.destaques ?? []).includes("lancamento") ? 1 : 0);
  const itens = [...todos].sort((a, b) => peso(b) - peso(a)).slice(0, 8);

  return (
    <div>
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <span>Campanhas</span>
          <span>/</span>
          <span>{c.nome}</span>
        </div>
      </div>

      <div className="chero">
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImg} alt="" />
        ) : null}
        <div className="wrap">
          <span className="chip chip-lime" style={{ alignSelf: "flex-start" }}>
            <Icon name="alarm" />
            Campanha · {c.mes}
          </span>
          <h1>Brindes para {c.nome}</h1>
          <p>Brindes selecionados para a data, com a sua marca aplicada. Monte seu orçamento.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="when">
          <span className="ib">
            <Icon name="clock" />
          </span>
          <div>
            <b>
              Para chegar a tempo, feche o pedido
              {fecha ? ` até ${fecha}` : " com antecedência"}.
            </b>
            <span>
              Recomendamos 40 a 60 dias de antecedência entre o pedido e a data. O especialista
              confirma o prazo na proposta.
            </span>
          </div>
          <Link className="btn btn-cta" href="/orcamento">
            Montar orçamento
            <Icon name="arrow-right" />
          </Link>
        </div>

        <section className="sec">
          <SectionHead
            title={`Mais pedidos para ${c.nome}`}
            sub="Produtos do catálogo com o apelo da data."
            link="/catalogo"
            linkText="Ver catálogo completo"
          />
          <div className="pgrid">
            {itens.map((p) => (
              <ProductCardJoy key={p.slug} produto={p} />
            ))}
          </div>
        </section>

        <section className="sec">
          <SectionHead title="Como funciona" />
          <div className="steps">
            {PASSOS.map(([titulo, texto], i) => (
              <div className="stp" key={titulo}>
                <i>{i + 1}</i>
                <b>{titulo}</b>
                <span>{texto}</span>
              </div>
            ))}
          </div>
        </section>

        <FinalCta />
      </div>
    </div>
  );
}
