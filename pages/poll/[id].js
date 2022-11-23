import {getSession, useSession} from "next-auth/react";
import {poll, category, vote} from "../api/strapi/strapi";
import {useEffect, useState} from "react";
import styles from "../../styles/poll.module.css";
import Head from "next/head";
import Image from "next/image";
import firstImg from '../../asset/img/1.png';
import secondImg from '../../asset/img/2.png';
import thirdImg from '../../asset/img/3.png';
import pictureIcon from '../../asset/icon/picture.png';
import {date} from "../../utils/date";
import {
  redirectToHome,
  redirectToIsClose,
  redirectToNotOpen,
  redirectToResult,
  redirectToSignIn
} from "../../utils/redirect";
import VotedImage from "../../component/poll/votedImage";
import {scrollToTop} from "../../utils/utils";
import { useRouter } from 'next/router'


export default function Poll({poll,img,votesInit}) {
  const { data: session } = useSession();
  const [votes, setVotes] = useState(votesInit);
  const [fullScreenImg, setFullScreenImg] = useState(null);
  const hasVoted = votesInit.length > 0;
  const router = useRouter();
  const domain = process.env.STRAPI_URL;

  useEffect(() => {
    if (session == null) return;
  }, [session]);

  const cancelVote = () =>{
    setVotes([]);
  }

  const clickImage = (i) => {
    const url = [i.attributes.Image.data.attributes.formats.medium.url];
    if(hasVoted)return;
    const v = [...votes];
    i.value = v.length;
    i.url = url;
    const index = v.findIndex(vote => vote.attributes.category.data.id === i.attributes.category.data.id);
    if(!v.includes(i) && index===-1){
      v.push(i);
    } else if(index !== -1){
      v[index] = i;
    }
    if(v.length>3)return;
    setVotes(v);
  }

  const displayIsVoted = (votes,i) => {
    const index = votes.indexOf(i);
    if(index !== -1){
      switch (index) {
        case 0:
          return (<div className={styles.containerIsVoted}><Image className={styles.imgIsvoted} src={firstImg} width={25} height={50} /></div>)
        case 1:
          return (<div className={styles.containerIsVoted}><div className={styles.imgIsvoted}><Image src={secondImg} width={35} height={50} /></div></div>)
        case 2:
          return (<div className={styles.containerIsVoted}><div className={styles.imgIsvoted}><Image src={thirdImg} width={30} height={50} /></div></div>)
      }
      return null;
    }
  }

  const confirmVote = () => {
    if(votes.length === 0){
      alert("Veuillez choisir au moins une image");
      return;
    }
    const promises = votes.map((v) => vote.create(poll.id, v.id,session.id,votes.length - v.value));

    Promise.all(promises).then(() => {
      setVotes([]);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
          router.reload()
        }
    );
  }
  const fullScreen = (img) => {
    setFullScreenImg(img);
  }

  return (
      <div className={styles.container}>
        <Head>

        </Head>
        <h1 className={styles.title}>

          Sondage {poll.attributes.Titre} :
        </h1>
        <a href={domain+poll.attributes.Full_image.data.attributes.url} rel="noreferrer" target='_blank'>
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
            {(votes.length<3  || hasVoted) && <div className={styles.fixedButton}>&#x2191;</div>}
            {votes.length>2 && !hasVoted && <div  className={[styles.fixedButton,styles.fixedButtonConfirm].join(" ")}>&#x2713;</div>}
          </div>
          <div className={styles.vote}>
            <div className={[styles.voteImg, styles.second,votes.length>1?styles.voted:''].join(" ")}>
              {votes.length <= 1 && <div><div className={styles.emptyVote} /><div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={secondImg} /></div></div>}
              {votes.length >1 && <VotedImage img={votes[1].url}  imgNumber={secondImg} />}
            </div>
            <div className={[styles.voteImg, styles.first].join(" ")}>
              {votes.length === 0 && <div><div className={styles.emptyVote} /><div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={firstImg} /></div></div>}
              {votes.length >0 &&<VotedImage img={votes[0].url} imgNumber={firstImg} />}
            </div>
            <div className={ [styles.voteImg, styles.third,votes.length>2?styles.voted:''].join(" ")}>
              {votes.length <= 2 && <div><div className={styles.emptyVote} /><div className={styles.containerNumber}><Image className={styles.numberImg} layout='fill' objectFit='contain'  src={thirdImg} /></div></div>}
              {votes.length >2 && <VotedImage img={votes[2].url}  imgNumber={thirdImg} />}
            </div>
          </div>
          {!hasVoted && votes.length>0 && <div className={styles.buttonContainer}>
            <div onClick={cancelVote} className={[styles.cancelButton,styles.button].join(" ") }>Annuler</div>
            {votes.length>2 && <div onClick={confirmVote} className={[styles.confirmer, styles.button].join(" ")}>Confirmer</div>}
          </div>
          }
          {hasVoted && <h2 className={styles.subTitle}>Merci Beaucoup de votre vote. </h2>}
          {!hasVoted && <div>
            <h2 className={styles.subTitle}> Cliquer sur une Image pour voter : </h2>
            <p className={styles.consigne}>Ce sondage a pour but d&lsquo;élire la meilleur photo de profil que j&lsquo;ai généré par l&lsquo;IA. Ce sondage a pour uniquement pour le fun, le gagnant de ce sondage ne SERA PAS LA PHOTO DE PROFIL. Il faut choisir 3 images pour voter pour le sondage, la première image auras 3 points, la deuxième aura deux points et la troisième aura 1 point.
              Dans les 3 images que vous choisirez, vous ne pouvez choisir qu&lsquo;une image de même type c&lsquo;est à dire qu&lsquo;une seul image par ligne. Chaque thème est séparé par un séparateur </p></div>}

          <div className={styles.list}>
            {img.map(img => (
                <div key={img.id +20}>
                  <div key={img.id} className={styles.cat}>
                    {img.img.map(i =>
                        <div key={i.id} className={styles.imgCatContainer}
                        >
                          <Image className={styles.imgCat} width={156}  height={156} onClick={()=>clickImage(i)}  alt={i.attributes.Image.data.attributes.alternativeText} src={process.env.STRAPI_URL+i.attributes.Image.data.attributes.formats.thumbnail.url}/>
                          { displayIsVoted(votes,i)}
                          {votes.indexOf(i)===-1 && <div className={styles.fullScreenContainerButton}><div onClick={()=>{fullScreen(i)}} className={styles.fullScreenButton}></div></div>}
                        </div>
                    )}
                  </div>
                  <hr className={styles.divider} />
                </div>
            ))}
          </div>
          { fullScreenImg &&
              <div className={styles.fullScreenImgContainer}>
                <div onClick={()=>setFullScreenImg(null)} className={styles.closeBtn}>+</div>
                <div className={styles.fullScreenImg}>
                  <Image src={`${domain}${fullScreenImg.attributes.Image.data.attributes.formats.large.url}`} width={fullScreenImg.attributes.Image.data.attributes.formats.large.width}   layout={"fill"}  objectFit="contain" quality={100}  height={fullScreenImg.attributes.Image.data.attributes.formats.large.height} />
                </div>
              </div> }
        </main>
      </div>

  );
}

export const getServerSideProps = async (context) => {

  const session = await getSession(context);
  if (session == null) {
    return redirectToSignIn();
  }
  const p = await poll.findWithImages(context.params.id);
  const c = [... new Set(p.data.attributes.images.data.map((img)=>img.attributes.category.data.id))];

  if(!isOpen(p.data.attributes.heure_debut)){
    return redirectToNotOpen();
  }
  if(isClosed(p.data.attributes.heure_fin)){
    return redirectToResult(context.params.id);
  }
  const votes= await vote.findByUserIdAndPollId(session,p.data.id);
  const votesSorted = votes.data.sort((a,b)=>{
    return a.value>b.value;
  });
  const votesInit = votesSorted.map(vote=>{
    return {
      url:vote.Image.Image.formats.medium.url,
      id:vote.Image.id,
      value:vote.value
    }
  });

  const img = c.map(cat => {
    const i = p.data.attributes.images.data.filter((a)=>a.attributes.category.data.id === cat);
    return {id : cat, img: i};
  });

  return {
    props: {
      poll : p.data,
      img : img,
      votesInit:votesInit
    },
  };
};

function isOpen(dateStart){
  const now = new Date();
  const start = new Date(dateStart);
  return now >= start;
}

function isClosed(dateClose){
  const now = new Date();
  const close = new Date(dateClose);
  return now >= close;
}

