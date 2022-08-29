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

export default function Poll({poll,img}) {
  const { data: session } = useSession();
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (session == null) return;
    console.log('session.jwt', session);
  }, [session]);



  const clickImage = (i) => {
    const v = [...votes];
    if(!v.includes(i)){
      v.push(i);
    }

    setVotes(v);
  }
  console.log("v",votes);
  return (
    <div className={styles.container}>
      <Head>
        <title>Poll {poll.attributes.Titre}</title>
      </Head>
      <h1 className={styles.title}>
        Sondage {poll.attributes.Titre} :
      </h1>
      <main className={styles.main}>
        <div className={styles.vote}>
          <div className={[styles.voteImg, styles.second].join(" ")}>
            {votes.length <= 1 && <div className={styles.emptyVote} />}
            {votes.length >1 && <Image className={styles.voteImage} width={290} height={290} src={"http://localhost:1337"+votes[1].attributes.Image.data.attributes.formats.small.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} width="50px" height="50px"   src={secondImg} /></div>
          </div>
          <div className={[styles.voteImg, styles.first].join(" ")}>
            {votes.length ===0 && <div className={styles.emptyVote} />}
            {votes.length >0 && <Image className={styles.voteImage} width={300} height={300} src={"http://localhost:1337"+votes[0].attributes.Image.data.attributes.formats.small.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} width="50px" height="50px"   src={firstImg} /></div>
          </div>
          <div className={[styles.voteImg, styles.third].join(" ")}>
            {votes.length <= 2 && <div className={styles.emptyVote} />}
            {votes.length >2 && <Image className={styles.voteImage} width={290} height={290} src={"http://localhost:1337"+votes[2].attributes.Image.data.attributes.formats.small.url} alt={poll.attributes.Titre} onClick={() => clickImage(poll.id)}/>}
            <div className={styles.containerNumber}><Image className={styles.numberImg} width="50px" height="50px"   src={thirdImg} /></div>
          </div>
        </div>
        <ul className={styles.list}>
          {img.map(img => (
            <li key={img.id} className={styles.cat}>
                  {img.img.map(i =>
                       <Image width={100} height={100} onClick={()=>clickImage(i)}  alt={i.attributes.Image.data.attributes.alternativeText} src={"http://localhost:1337"+i.attributes.Image.data.attributes.formats.thumbnail.url}/>
                  )}
            </li>
          ))}
        </ul>
      </main>
    </div>

  );
}

export const getServerSideProps = async (context) => {

  const session = await getSession(context);
  if (session == null) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: true,
      },
    };
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
