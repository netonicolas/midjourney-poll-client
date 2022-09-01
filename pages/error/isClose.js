import Link from "next/link";

export default function isClose(){
  return (
    <div>
      <h1>Trop tard le sondage est fermé</h1>
      <Link href={'/'} >Retour à l'accueil</Link>
    </div>
  );
}
