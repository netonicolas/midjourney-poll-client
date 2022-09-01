import Image from "next/image";
import styles from "../../styles/votedImage.module.css";

export default function VotedImage({img,alt,imgNumber}) {

  return (
    <div>
      <div>
        <Image className={styles.voteImage} width={300} height={300} src={"http://localhost:1337"+img} alt={alt} />
      </div>
      <div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={imgNumber} /></div>
    </div>
  )
}
