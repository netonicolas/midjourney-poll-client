import Link from "next/link";
import styles from "../../styles/error.module.css";

export default function isClose(){
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trop tard le sondage est fermé</h1>
      <span class={styles.link}><Link  href={'/'} >Retour à l'accueil</Link></span>
    </div>
  );
}
