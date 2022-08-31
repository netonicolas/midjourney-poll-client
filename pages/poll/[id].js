import {getSession, useSession} from "next-auth/react";
import {poll,category} from "../api/strapi/strapi";
import {useEffect, useState} from "react";
import styles from "../../styles/poll.module.css";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import firstImg from '../../asset/img/1.png';
import secondImg from '../../asset/img/2.png';
import thirdImg from '../../asset/img/3.png';
import pictureIcon from '../../asset/icon/picture.png';
import {date} from "../../utils/date";
import {redirectToHome} from "../../utils/redirect";

export default function Poll({poll,img}) {
  const { data: session } = useSession();
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (session == null) return;
    console.log('session.jwt', session);
  }, [session]);

  const cancelVote = () =>{
    setVotes([]);
  }

  const clickImage = (i) => {
    const v = [...votes];
    if(!v.includes(i)){
      v.push(i);
    }
    setVotes(v);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Poll {poll.attributes.Titre}</title>
      </Head>
      <h1 className={styles.title}>
        Sondage {poll.attributes.Titre} :
      </h1>

      <a href={"http://localhost:1337"+poll.attributes.Full_image.data.attributes.url} target='_blank'>
        <div className={styles.fullImageContainer}>

            <Image src={pictureIcon} className={styles.pictureIcon} width={25} height={25}/>

        </div>
      </a>
      <div className={styles.datesContainer}>
        <div className={styles.dateContainer}>
          <p className={styles.dateSentence}>Heure de debut : <span className={styles.dateFormat}>{date.format(new Date(poll.attributes.heure_debut))}</span> </p>
        </div>
        <div className={styles.dateContainer}>
          <p className={styles.dateSentence}>Heure de fin : <span className={styles.dateFormat}>{date.format(new Date(poll.attributes.heure_fin))} </span></p>
        </div>
      </div>
      <main className={styles.main}>
        <div onClick={scrollToTop}  className={styles.containerFixedButton}>
          {votes.length<3 && <div className={styles.fixedButton}>&#x2191;</div>}
          {votes.length>2 && <div  className={[styles.fixedButton,styles.fixedButtonConfirm].join(" ")}>&#x2713;</div>}
        </div>
        <div className={styles.vote}>
          <div className={[styles.voteImg, styles.second,votes.length>1?styles.voted:''].join(" ")}>
            {votes.length <= 1 && <div className={styles.emptyVote} />}
            {votes.length >1 && <div><Image className={styles.voteImage} width={300} height={300} src={"http://localhost:1337"+votes[1].attributes.Image.data.attributes.formats.medium.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/></div>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={secondImg} /></div>
          </div>
          <div className={[styles.voteImg, styles.first].join(" ")}>
            {votes.length ===0 && <div className={styles.emptyVote} />}
            {votes.length >0 && <Image className={styles.voteImage} width={300} height={300} src={"http://localhost:1337"+votes[0].attributes.Image.data.attributes.formats.medium.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={firstImg} /></div>
          </div>
          <div className={ [styles.voteImg, styles.third,votes.length>2?styles.voted:''].join(" ")}>
            {votes.length <= 2 && <div className={styles.emptyVote} />}
            {votes.length >2 && <Image className={styles.voteImage} width={300} height={290} src={"http://localhost:1337"+votes[2].attributes.Image.data.attributes.formats.medium.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain' src={thirdImg} /></div>
          </div>
        </div>
        {votes.length>0 && <div className={styles.buttonContainer}>
          <div onClick={cancelVote} className={[styles.cancelButton,styles.button].join(" ") }>Annuler</div>
          {votes.length>2 && <div className={[styles.confirmer, styles.button].join(" ")}>Confirmer</div>}
        </div>
        }

        <h2 className={styles.subTitle}> Cliquer sur une Image pour voter : </h2>
        <p className={styles.consigne}>Il faut choisir 3 images pour voter pour le sondage, la première images auras 3 points, la deuxième aura deux points et la troisième aura 1 points.<br/>
          Dans les 3 images que vous choisirez, vous ne pouvez choisir qu'une image de même type c'est à dire qu'une seul image par ligne. Chaque theme est séparé par un séparateur </p>
        <div className={styles.list}>
          {img.map(img => (
            <div>
            <div key={img.id} className={styles.cat}>
                  {img.img.map(i =>
                    <div className={styles.imgCatContainer}>
                      <Image className={styles.imgCat} width={156}  height={156} onClick={()=>clickImage(i)}  alt={i.attributes.Image.data.attributes.alternativeText} src={"http://localhost:1337"+i.attributes.Image.data.attributes.formats.thumbnail.url}/>
                    </div>
                  )}
            </div>
            <hr class={styles.divider} />
            </div>
          ))}
        </div>
      </main>
    </div>

  );
}

export const getServerSideProps = async (context) => {

  const session = await getSession(context);
  if (session == null) {
    return redirectToHome();
  }
  const p = await poll.findWithImages(context.params.id);
  const c = await category.all();
  const votes = await poll.all();
   const img = c.data.map(cat => {
     const i = p.data.attributes.images.data.filter((a)=>a.attributes.category.data.id === cat.id);
     return {id : cat.id, img: i};
   });
  return {
    props: {
      poll : p.data,
      img : img
    },
  };
};


