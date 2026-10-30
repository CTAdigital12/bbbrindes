import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import HeroSlider from "@/components/HeroSlider";
import Countdown from "@/components/Countdown";
import RevealInit from "@/components/RevealInit";
import Rail from "@/components/Rail";
import ProductCardJoy from "@/components/ProductCardJoy";
import { getProdutos, getProdutosEcologicos } from "@/lib/produtos";
import { getCampanhas, getCases, getCategorias, getMaterias, getPosts } from "@/lib/content";
import { img, imgSrc } from "@/lib/asset";
import {
  WA,
  nb,
  orderedHeroSlides,
  nextCamps,
  TRUST,
  LOGOS,
  DIF,
  QUOTES,
  POSTS,
  FAQ,
  CAT_ICON,
  CAMP_TILE,
} from "@/data/home-joy";

// Capas ilustrativas (POSTS do mockup) cicladas sobre os posts reais na home,
// mesmo criterio da pagina /blog (o Post do Payload nao carrega imagem).
const COVERS = POSTS.map(([, , imagem]) => imagem);

// Cabecalho de secao (shead do mockup): titulo, subtitulo opcional e link opcional.
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

export default async function HomePage() {
  // Marketing (hero, trust, logos, campanhas-tiles, urgencia, eco-lead,
  // diferenciais, faq, cta) = conteudo do mockup (porta de data/home-joy.ts).
  // Dado REAL do Payload: categorias (faixa), produtos (rail Lancamentos),
  // produtos ecologicos (pgrid Eco), campanhas e agora cases/imprensa/blog
  // (getCases/getMaterias/getPosts, com fallback no mock) = FB6-3.3.
  const [categorias, campanhas, produtos, produtosEco, cases, materias, posts] =
    await Promise.all([
      getCategorias(),
      getCampanhas(),
      getProdutos(),
      getProdutosEcologicos(),
      getCases(),
      getMaterias(),
      getPosts(),
    ]);

  // Mes corrente resolvido no build (export estatico): ordena o hero e aponta as
  // 2 proximas campanhas.
  const monthIdx = new Date().getMonth();
  const slides = orderedHeroSlides(monthIdx);
  const nx = nextCamps(monthIdx);

  const lancamentos = produtos.slice(0, 8);
  const eco = produtosEco.slice(0, 6);
  const camposComTile = campanhas.filter((c) => CAMP_TILE[c.slug]);

  // Cases/imprensa/blog reais, limitados ao que a home exibe (3 cada). Os
  // loaders ja caem no mock quando a collection esta vazia. A /cases mostra
  // todos; a home destaca 3 marcas fortes (por slug) pra nao depender da ordem
  // de criacao no backend. Se nenhum destaque bater, cai nos 3 primeiros.
  const DESTAQUE_CASES = new Set([
    "abridor-contour-personalizado", // Coca-Cola
    "replica-da-taca-personalizada", // Stella Artois
    "bowl-coracao-personalizado", // Nestle
  ]);
  const destaques = cases.filter((c) => DESTAQUE_CASES.has(c.slug));
  const casesHome = (destaques.length ? destaques : cases).slice(0, 3);
  const materiasHome = materias.slice(0, 3);
  const postsHome = posts.slice(0, 3);

  const contagem = (slug: string) => produtos.filter((p) => p.categoria === slug).length;

  return (
    <div>
      <h1 className="sr-only">BB Brindes - brindes corporativos personalizados</h1>

      {/* Hero: slider rotativo + 2 banners laterais */}
      <section className="hero">
        <div className="wrap hgrid">
          <HeroSlider slides={slides} />
          <div className="side">
            <Link className="sbn" href="/catalogo?categoria=infantil">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("/img/banners/home-lateral-linha-infantil.webp")} alt="" />
              <div className="ov" style={{ color: "var(--deep)" }}>
                <b>Linha infantil</b>
                <small>Livre de BPA</small>
              </div>
              <span className="go">
                <Icon name="arrow-right" />
              </span>
            </Link>
            <Link className="sbn" href="/catalogo?categoria=to-go-viagem">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("/img/banners/home-lateral-to-go-e-viagem.webp")} alt="" />
              <div className="ov" style={{ color: "#fff" }}>
                <b>To go e viagem</b>
                <small>Garrafas e squeezes</small>
              </div>
              <span className="go">
                <Icon name="arrow-right" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Faixa de confianca */}
      <section className="trust">
        <div className="wrap tgrid">
          {TRUST.map(([icon, titulo, sub]) => (
            <div className="titem" key={titulo}>
              <span className="ib">
                <Icon name={icon} />
              </span>
              <div>
                <b>{nb(titulo)}</b>
                <span>{nb(sub)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logos de clientes em movimento */}
      <div className="logos">
        <div className="lab">
          Marcas que já escolheram a <b>BB Brindes</b>
        </div>
        <div className="mq">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${l}-${i}`} src={img(`/img/logos/${l}.svg`)} alt={l} />
          ))}
        </div>
      </div>

      {/* Categorias (dado REAL: getCategorias) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Categorias"
            sub="Encontre o brinde certo para cada ação da sua marca."
            link="/catalogo"
            linkText="Ver todos os produtos"
          />
          <div className="cgrid">
            {categorias.map((c) => {
              const n = contagem(c.slug);
              const iconFile = CAT_ICON[c.slug];
              return (
                <Link className="cat" href={`/catalogo?categoria=${c.slug}`} key={c.slug}>
                  {c.icone ? (
                    // Icone cadastrado no painel (Payload) tem prioridade.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc(c.icone)} alt="" />
                  ) : iconFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img(`/img/icones/${iconFile}.svg`)} alt="" />
                  ) : (
                    <Icon name="package" className="big" />
                  )}
                  <div>
                    <b>{nb(c.nome)}</b>
                    <small>
                      {n > 0 ? n : "Ver"} {n === 1 ? "produto" : "produtos"}
                    </small>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lancamentos (dado REAL: getProdutos) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Lançamentos"
            sub="Novidades da linha Green Fibras."
            link="/catalogo"
            linkText="Ver todos"
          />
          <Rail id="tr-lanc">
            {lancamentos.map((p) => (
              <ProductCardJoy key={p.slug} produto={p} />
            ))}
          </Rail>
        </div>
      </section>

      {/* Urgencia + countdown */}
      <div className="wrap reveal">
        <div className="urg">
          <div className="tx">
            <span className="chip chip-lime" style={{ alignSelf: "flex-start" }}>
              <Icon name="alarm" />
              Agenda de fim de ano
            </span>
            <h2>
              Dezembro tem prazo.{" "}
              <span style={{ color: "var(--lime)" }}>A produção do seu brinde também.</span>
            </h2>
            <p>
              A produção de fim de ano é o pico do setor. Feche seu pedido de Natal até o fim de
              outubro e garanta a entrega antes das festas.
            </p>
            <Countdown />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link className="btn btn-cta btn-lg" href="/campanha/natal">
                Garantir meu prazo
                <Icon name="arrow-right" />
              </Link>
              <a className="btn btn-ghost-w btn-lg" href={WA} target="_blank" rel="noopener">
                <Icon name="brand-whatsapp" />
                Falar com especialista
              </a>
            </div>
          </div>
          <div className="ph">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img("/img/foto/MV02406GC-super-bowl-green-fibras-colors-500ml.webp")}
              alt="Bowl personalizado Coca-Cola"
              loading="lazy"
            />
          </div>
          <span className="deco" />
        </div>
      </div>

      {/* Campanhas e datas (dado REAL: getCampanhas, filtrado pelos que tem tile) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Campanhas e datas"
            sub="Cada data tem uma página com os brindes mais pedidos. O pedido sai melhor quando fecha com 40 a 60 dias de antecedência."
          />
          <div className="tgrid6">
            {camposComTile.map((c) => (
              <Link className="tile" href={`/campanha/${c.slug}`} key={c.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(`/img/banners/home-campanha-${CAMP_TILE[c.slug]}.webp`)} alt="" loading="lazy" />
                <span className="lb">{c.nome}</span>
                {nx.includes(c.slug) ? <span className="nx">PRÓXIMA</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Eco: lead escuro + pgrid de produtos ecologicos (dado REAL) */}
      <section className="sec reveal">
        <div className="wrap">
          {/* Eco banner (Linha Green) - mockup 28/10 */}
          <Link className="eco-bn" href="/catalogo?categoria=green-fibras">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img("/img/banners/home-hero-fixo-2-linha-ecologica.webp")}
              alt=""
              loading="lazy"
            />
            <div className="ebt">
              <span className="eyebrow" style={{ color: "var(--green)" }}>
                Linha Green
              </span>
              <h2>A nova geração dos brindes&nbsp;ecológicos</h2>
              <p>Mais design. Menos impacto. Mais&nbsp;futuro.</p>
              <span className="btn btn-deep">
                Ver linha ecológica
                <Icon name="arrow-right" />
              </span>
            </div>
          </Link>
          <div className="eco">
            <div className="lead">
              <span className="eyebrow" style={{ color: "var(--lime)" }}>
                Brindes ecológicos
              </span>
              <h2>Brindes que duram, não&nbsp;descartáveis</h2>
              <p>
                Fabricados com fibras naturais de coco e madeira de reflorestamento. Produto
                reciclável, de uso permanente, livre&nbsp;de&nbsp;BPA.
              </p>
              <div className="lines">
                <span>Premium</span>
                <span>Green Fibras</span>
                <span>Green Plasticaria</span>
                <span>Green Reversa</span>
              </div>
              <Link className="btn btn-lime" href="/catalogo?categoria=green-fibras">
                Ver linha ecológica
                <Icon name="arrow-right" />
              </Link>
              <span className="bub" />
              <span className="bub3" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lph"
                src={img("/img/foto/MV02146G-copo-mini-roma-ecologico-green-fibras-300ml.webp")}
                alt="Copo Green Fibras personalizado"
                loading="lazy"
              />
              <span className="bub2" />
            </div>
            <div className="pgrid">
              {eco.map((p) => (
                <ProductCardJoy key={p.slug} produto={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por que a BB Brindes (diferenciais do mockup) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Por que a BB Brindes"
            sub="Fabricante com 27 anos de mercado: o que muda no seu pedido."
          />
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
        </div>
      </section>

      {/* Cases e prova social (REAIS: getCases) + depoimentos */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Cases e prova social"
            sub="Projetos de diferentes setores."
            link="/cases"
            linkText="Ver cases"
          />
          <div className="cases">
            {casesHome.map((c) => (
              // Mesmo tratamento da pagina /cases: sem foto por case (decisao
              // 27/10), faixa de marca com o nome do cliente. Clique -> /cases.
              <Link className="case case-text" href="/cases" key={c.slug}>
                <div className="ph ph-brand">
                  <span className="cli">{c.cliente}</span>
                </div>
                <div className="bd">
                  {c.segmento ? <small>{c.segmento}</small> : null}
                  <h3>{nb(c.titulo)}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="quotes">
            {QUOTES.map(([texto, autor]) => (
              <div className="qt" key={autor}>
                <Icon name="quote" />
                <div>
                  <p>{texto}</p>
                  <span>{autor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Na imprensa (REAL: getMaterias) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead title="Na imprensa" link="/imprensa" linkText="Ver imprensa" />
          <div className="press">
            {materiasHome.map((m) => (
              <Link className="pr" href="/imprensa" key={m.id}>
                <small>{m.veiculo}</small>
                <b>{nb(m.titulo)}</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Do blog (REAL: getPosts; capa ilustrativa ciclada, igual a /blog) */}
      <section className="sec reveal">
        <div className="wrap">
          <SectionHead
            title="Do blog"
            sub="Conteúdo para quem compra brindes."
            link="/blog"
            linkText="Ver blog"
          />
          <div className="blog">
            {postsHome.map((p, i) => (
              <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
                <div className="ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(COVERS[i % COVERS.length])} alt="" loading="lazy" />
                </div>
                <div className="bd">
                  <span className="chip chip-sage" style={{ alignSelf: "flex-start" }}>
                    Artigo
                  </span>
                  <h3>{nb(p.titulo)}</h3>
                  <p>{p.resumo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec reveal">
        <div className="wrap faq">
          <div>
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2
              style={{
                margin: 0,
                fontSize: "30px",
                lineHeight: 1.15,
                letterSpacing: "-.025em",
                fontWeight: 600,
              }}
            >
              Antes de pedir seu&nbsp;orçamento
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Não achou sua resposta? Um especialista responde no WhatsApp.
            </p>
            <a className="btn btn-wa" href={WA} target="_blank" rel="noopener">
              <Icon name="brand-whatsapp" />
              Falar no WhatsApp
            </a>
          </div>
          <div>
            {FAQ.map(([pergunta, resposta], i) => (
              <details className="q" key={pergunta} open={i === 0}>
                <summary>
                  {pergunta}
                  <Icon name="plus" />
                </summary>
                <div className="a">{resposta}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <div className="wrap reveal">
        <FinalCta />
      </div>

      <RevealInit />
    </div>
  );
}

// CTA final (finalCTA do mockup).
function FinalCta(): ReactNode {
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
