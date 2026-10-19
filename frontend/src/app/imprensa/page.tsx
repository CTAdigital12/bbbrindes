import type { Metadata } from "next";
import Link from "next/link";
import { getMaterias } from "@/lib/content";
import { nb } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Imprensa",
  description: "A BB Brindes e o Grupo BB na mídia: matérias, releases e menções na imprensa.",
};

// Espelha imprensa() (.press). Dado REAL: getMaterias() (Payload com fallback no
// mock data/imprensa). O mockup usava "Matéria a confirmar" como placeholder;
// aqui preenchemos com o veiculo + titulo reais, mantendo o layout .pr do mockup.
export default async function ImprensaPage() {
  const materias = await getMaterias();
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Imprensa</span>
      </div>
      <div className="ptitle">
        <h1>Na imprensa</h1>
        <p>A BB Brindes e o Grupo BB na mídia.</p>
      </div>
      <div className="press">
        {materias.map((m) => (
          <div className="pr" key={m.id}>
            <small>{m.veiculo}</small>
            <b>{nb(m.titulo)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
