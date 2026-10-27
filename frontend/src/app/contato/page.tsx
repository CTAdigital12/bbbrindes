import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { getConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a BB Brindes: WhatsApp, e-mail, SAC e orçamento. Fábrica em Lauro de Freitas / BA.",
};

// Canais de contato (mockup contato()): .cbox com os canais + .map placeholder.
// Sem formulario: o fluxo de orcamento tem pagina propria (/orcamento).
export default async function ContatoPage() {
  // Contato vem do global `configuracoes` (FB-6), editavel no admin, com fallback
  // no mock. Unifica a fonte do WhatsApp/telefone/email/endereco/horario/CNPJ.
  const config = await getConfig();
  const wa = `https://wa.me/${config.whatsapp}`;
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Contato</span>
      </div>
      <div className="ptitle">
        <h1>Fale com a BB Brindes</h1>
        <p>
          Escolha o canal que preferir. Se o assunto for orçamento, o caminho mais rápido é o
          formulário de orçamento, que já chega com os dados do seu projeto para o time comercial.
        </p>
      </div>
      <div className="split" style={{ alignItems: "start" }}>
        <div className="cbox">
          <a href={wa} target="_blank" rel="noopener">
            <span className="ib">
              <Icon name="brand-whatsapp" />
            </span>
            <span>
              <b>Comercial (WhatsApp)</b>
              <br />
              {config.telefone}
            </span>
          </a>
          <a href={`mailto:${config.email}`}>
            <span className="ib">
              <Icon name="mail" />
            </span>
            <span>
              <b>E-mail</b>
              <br />
              {config.email}
            </span>
          </a>
          <Link href="/sac">
            <span className="ib">
              <Icon name="headset" />
            </span>
            <span>
              <b>SAC / pós-venda</b>
              <br />
              Retorno em até 24 horas úteis
            </span>
          </Link>
          {/* Endereco editavel no admin (global configuracoes); cliente poe o completo. */}
          <span>
            <span className="ib">
              <Icon name="map-pin" />
            </span>
            <span>
              <b>Fábrica</b>
              <br />
              {config.endereco}
            </span>
          </span>
          {/* Horario editavel no admin (global configuracoes). */}
          <span>
            <span className="ib">
              <Icon name="clock" />
            </span>
            <span>
              <b>Horário de atendimento</b>
              <br />
              {config.horario}
            </span>
          </span>
          <Link className="btn btn-cta" href="/orcamento">
            Solicitar orçamento
            <Icon name="arrow-right" />
          </Link>
          <small style={{ color: "var(--muted)" }}>CNPJ {config.cnpj}</small>
        </div>
        {/* PENDENTE cliente: mapa / endereco da fabrica. */}
        <div className="map">
          <Icon name="map-2" className="big" />
          Mapa da fábrica
        </div>
      </div>
    </div>
  );
}
