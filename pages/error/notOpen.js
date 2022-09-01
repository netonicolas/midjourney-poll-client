import Link from "next/link";
import styles from "../../styles/error.module.css";
export default function notOpen(){
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trop tôt le sondage le sondage n'est pas encore ouvert</h1>
      <span class={styles.link}><Link href={'/'} >Retour à l'accueil</Link></span>
    </div>
  );
}
