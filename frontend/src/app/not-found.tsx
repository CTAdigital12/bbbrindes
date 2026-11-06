import Link from "next/link";
import Icon from "@/components/Icon";
import RetryPageButton from "@/components/RetryPageButton";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`wrap ${styles.page}`} aria-labelledby="unavailable-title">
      <div className={styles.card}>
        <span className={styles.icon}><Icon name="search" /></span>
        <p className={styles.eyebrow}>BB Brindes</p>
        <h1 id="unavailable-title">Esta página ainda não está disponível</h1>
        <p>Se você acabou de cadastrar ou publicar um produto, o site pode estar sendo atualizado. Aguarde alguns minutos e tente novamente.</p>
        <p className={styles.secondary}>Se não for um cadastro recente, confira o endereço ou encontre o produto no catálogo.</p>
        <div className={styles.actions}>
          <RetryPageButton />
          <Link className="btn btn-ghost" href="/catalogo">Ver catálogo</Link>
        </div>
        <Link className={`link ${styles.home}`} href="/">Ir para a página inicial</Link>
      </div>
    </section>
  );
}
