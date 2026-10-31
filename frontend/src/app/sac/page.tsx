import Link from "next/link";
import SacForm from "@/components/SacForm";
import { getConteudoInstitucional } from "@/lib/content";

// Pagina do SAC. A copy (titulo/intro) e os motivos vem do global
// `conteudo-institucional` (getConteudoInstitucional), com fallback no mock. O
// form em si (interativo) fica no client component SacForm.
export default async function SacPage() {
  const { sac } = await getConteudoInstitucional();

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>SAC</span>
      </div>
      <div className="ptitle">
        <h1>{sac.titulo}</h1>
        <p>{sac.texto}</p>
      </div>

      <SacForm motivos={sac.motivos} />
    </div>
  );
}
