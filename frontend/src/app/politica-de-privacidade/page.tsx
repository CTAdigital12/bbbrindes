import type { Metadata } from "next";
import Link from "next/link";
import { getConfig } from "@/lib/content";

// Politica de Privacidade (LGPD) do site. Rascunho inicial para dar base legal ao
// formulario de orcamento (aceite obrigatorio no envio); o cliente refina o texto
// depois. Server component: le o e-mail de contato do getConfig (global do Payload,
// com fallback no mock), para o canal de solicitacoes ficar sempre correto.

export const metadata: Metadata = {
  title: "Política de Privacidade | BB Brindes",
  description:
    "Como a BB Brindes coleta, usa e protege os seus dados ao solicitar um orçamento, conforme a LGPD.",
};

const bloco: React.CSSProperties = { marginTop: 28 };

export default async function PoliticaPrivacidadePage() {
  const config = await getConfig();

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Política de Privacidade</span>
      </div>

      <div className="ptitle">
        <h1>Política de Privacidade</h1>
        <p>
          Esta política explica como a BB Brindes, empresa do Grupo BB, coleta, usa e protege os
          seus dados quando você solicita um orçamento ou entra em contato pelo site, em linha com a
          Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
        </p>
      </div>

      <div style={{ maxWidth: 760, lineHeight: 1.65, color: "var(--ink)" }}>
        <section style={bloco}>
          <h2>Quais dados coletamos</h2>
          <p>
            Ao enviar um pedido de orçamento, coletamos apenas os dados que você informa no
            formulário:
          </p>
          <ul>
            <li>Nome</li>
            <li>Empresa</li>
            <li>Telefone / WhatsApp</li>
            <li>E-mail</li>
            <li>Os itens do orçamento (produtos, cores e quantidades escolhidas)</li>
          </ul>
          <p>
            Não pedimos dados sensíveis nem dados de pagamento. O orçamento é apenas o primeiro
            contato: preço e condições são tratados depois, diretamente com o time comercial.
          </p>
        </section>

        <section style={bloco}>
          <h2>Para que usamos os seus dados</h2>
          <p>
            Usamos as informações só para atender ao seu pedido: elaborar a proposta comercial,
            entrar em contato pelo WhatsApp ou e-mail informado e acompanhar o atendimento até a
            entrega. Não usamos os seus dados para outras finalidades sem o seu consentimento.
          </p>
        </section>

        <section style={bloco}>
          <h2>Com quem compartilhamos</h2>
          <p>
            Os seus dados vão apenas para o time comercial da BB Brindes e para o sistema de gestão
            de relacionamento (CRM) usado internamente para registrar e dar andamento ao
            atendimento. Não vendemos nem cedemos os seus dados a terceiros para fins de
            publicidade.
          </p>
        </section>

        <section style={bloco}>
          <h2>Por quanto tempo guardamos</h2>
          <p>
            Mantemos os dados do seu pedido pelo tempo necessário para atender à solicitação e
            cumprir obrigações legais. Depois disso, eles são descartados ou anonimizados.
          </p>
        </section>

        <section style={bloco}>
          <h2>Os seus direitos</h2>
          <p>
            A LGPD garante a você o direito de confirmar o tratamento, acessar, corrigir, atualizar
            ou excluir os seus dados, e de revogar o consentimento a qualquer momento. Para exercer
            esses direitos, fale com a gente pelo canal abaixo.
          </p>
        </section>

        <section style={bloco}>
          <h2>Contato</h2>
          <p>
            Para solicitações sobre os seus dados, escreva para{" "}
            <a href={`mailto:${config.email}`}>{config.email}</a>. Respondemos no menor prazo
            possível.
          </p>
        </section>

        <p style={{ marginTop: 32, fontSize: 13, color: "var(--muted)" }}>
          Última atualização: outubro de 2026. Este texto é uma versão inicial e pode ser revisado.
        </p>
      </div>
    </div>
  );
}
