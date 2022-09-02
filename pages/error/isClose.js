import Link from "next/link";
import styles from "../../styles/error.module.css";
import {getSession} from "next-auth/react";
import {redirectToSignIn} from "../../utils/redirect";

export default function isClose(){
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trop tard le sondage est fermé</h1>
      <span className={styles.link}><Link  href={'/'} >Retour à l&apos;accueil</Link></span>
    </div>
  );
}


export const getServerSideProps = async (context) => {

  const session = await getSession(context);
  if (session == null) {
    return redirectToSignIn();
  }
}
