"use client";

import { type CSSProperties, useState } from "react";
import Link from "next/link";
import type { Produto } from "@/lib/types";
import Icon from "@/components/Icon";

// Blocos de conteudo da PDP (specs + beneficios, ideal para, descricao completa
// com "Ler mais", diferenciais e FAQ), espelhando a funcao produto() do mockup
// funcional com as classes verbatim do design-system.css (.specs, table.sp, ul.ben,
// .ideal, .desc.clamp, details.q). Dado REAL do detalhe (montarDetalhe); onde o
// detalhe vier vazio cai no fallback curto do mockup, para nada ficar em branco.

type Faq = { pergunta: string; resposta: string; aConfirmar?: boolean };

// Estilo do selo "a confirmar" (sem classe propria no design-system.css): reusa a paleta
// do .chip-orange (fundo #ffe9d1 / texto #9a4b00) num selo pequeno inline.
const BADGE: CSSProperties = {
  fontSize: "10.5px",
  fontWeight: 700,
  letterSpacing: ".04em",
  textTransform: "uppercase",
  color: "#9a4b00",
  background: "#ffe9d1",
  padding: "2px 7px",
  borderRadius: "999px",
};

export default function ProdutoDetalheView({ produto }: { produto: Produto }) {
  const [aberto, setAberto] = useState(false);
  const d = produto.detalhe;

  const livreBpa =
    (d?.selos ?? []).some((s) => /bpa/i.test(s)) ||
    (produto.tags ?? []).some((t) => /bpa/i.test(t));
  const fibra = /fibra/i.test(produto.material);

  // Dado REAL quando existe; fallback curto do mockup quando o campo vem vazio.
  const specs =
    d?.especificacoes && d.especificacoes.length
      ? d.especificacoes
      : [
          {
            rotulo: "Material",
            valor: fibra
              ? "Fibras naturais de coco e madeira de reflorestamento"
              : produto.material || "Plástico de alta resistência",
          },
          { rotulo: "Personalização", valor: "Transfer ou serigrafia" },
          { rotulo: "Pedido mínimo", valor: "500 unidades" },
        ];

  const ben =
    d?.beneficios && d.beneficios.length
      ? d.beneficios
      : [
          "Produto de uso permanente, não descartável",
          "Excelente área para personalização",
          "Produção nacional com qualidade premium",
          livreBpa ? "Atoxidade certificada para contato com alimento" : "Garantia de fábrica",
        ];

  const idealPara =
    d?.idealPara && d.idealPara.length
      ? d.idealPara
      : ["Endomarketing", "Eventos corporativos", "Ações promocionais", "Datas comemorativas"];

  const descricao =
    d?.descricaoCompleta && d.descricaoCompleta.length
      ? d.descricaoCompleta
      : [
          `Pequenos gestos geram grandes conexões. O ${produto.nome} foi desenvolvido para transformar um hábito simples, como manter-se hidratado ou fazer uma pausa para o café, em uma oportunidade permanente de aproximação entre a sua marca e as pessoas.`,
          `Produzido na fábrica da BB Brindes, com controle de qualidade em cada etapa e personalização da sua logomarca. Um brinde de uso diário, que continua com a sua marca muito depois da ação.`,
        ];

  const diferenciais =
    d?.diferenciais && d.diferenciais.length
      ? d.diferenciais
      : [
          "Fabricação própria",
          "Indústria nacional",
          "Personalização de alta qualidade",
          "Produção para pequenos e grandes volumes",
          "27 anos de experiência em brindes promocionais",
          "Projetos especiais sob demanda",
        ];

  const faq: Faq[] =
    d?.faq && d.faq.length
      ? d.faq
      : [
          { pergunta: "Qual o pedido mínimo?", resposta: "500 unidades por item." },
          {
            pergunta: "Quanto tempo leva a produção?",
            resposta:
              "O prazo é informado na proposta. Recomendamos fechar com 40 a 60 dias de antecedência.",
          },
          {
            pergunta: "Posso ver a arte antes da produção?",
            resposta: "Sim. Você aprova o layout com a sua marca antes de produzirmos.",
          },
          {
            pergunta: "O produto é atóxico?",
            resposta: livreBpa
              ? "Sim. Tem atoxidade certificada e é livre de BPA."
              : "Este item não tem contato com alimento; ele tem garantia de fábrica.",
          },
        ];

  return (
    <>
      <div className="specs">
        <div>
          <h2 className="h">Especificações</h2>
          <table className="sp">
            <tbody>
              {specs.map((s) => (
                <tr key={s.rotulo}>
                  <td>{s.rotulo}</td>
                  <td>{s.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="h">Principais benefícios</h2>
          <ul className="ben">
            {ben.map((b) => (
              <li key={b}>
                <Icon name="check" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="sec">
        <h2 className="h">Ideal para</h2>
        <div className="ideal">
          {idealPara.map((x) => (
            <Link key={x} className="chip" href={`/catalogo?categoria=${produto.categoria}`}>
              {x}
            </Link>
          ))}
        </div>
      </section>

      <section className="sec">
        <h2 className="h">Descrição completa</h2>
        <div className={`desc${aberto ? "" : " clamp"}`} id="desc">
          {descricao.map((p, i) => (
            <p key={i} style={{ margin: i === descricao.length - 1 ? 0 : "0 0 10px" }}>
              {p}
            </p>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          style={{ marginTop: 12 }}
        >
          {aberto ? "Ler menos" : "Ler mais"}
        </button>
      </section>

      <section className="sec specs" style={{ marginTop: 0, paddingTop: 40 }}>
        <div>
          <h2 className="h">Diferenciais da BB neste produto</h2>
          <ul className="ben">
            {diferenciais.map((b) => (
              <li key={b}>
                <Icon name="check" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="h">Perguntas frequentes</h2>
          {faq.map((f, i) => (
            <details className="q" key={f.pergunta} open={i === 0}>
              <summary>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {f.pergunta}
                  {f.aConfirmar && <span style={BADGE}>a confirmar</span>}
                </span>
                <Icon name="plus" />
              </summary>
              <div className="a">{f.resposta}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
