import Link from "next/link";

export default function notOpen(){
  return (
    <div>
      <h1>Trop tôt le sondage le sondage n'est pas encore ouvert</h1>
      <Link href={'/'} >Retour à l'accueil</Link>
    </div>
  );
}
