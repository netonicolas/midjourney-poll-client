import {getSession} from "next-auth/react";
import {poll, vote} from "../api/strapi/strapi";
import styles from "../../styles/poll.module.css";
import Image from "next/image";
import secondImg from "../../asset/img/2.png";
import VotedImage from "../../component/poll/votedImage";
import firstImg from "../../asset/img/1.png";
import thirdImg from "../../asset/img/3.png";
import {redirectToPoll} from "../../utils/redirect";

export default function result({poll,vote_groupBy}){

  return (
    <div className={styles.main}>
      <h1 >Résultat du sondage</h1>
      <h2>{poll.attributes.title}</h2>

      <div className={styles.vote}>
        <div className={[styles.voteImg,styles.voted].join(" ")}>
          <VotedImage img={vote_groupBy[1].image.attributes.Image.data.attributes.formats.medium.url} alt={vote_groupBy[1].image.attributes.Image.data.attributes.url} imgNumber={secondImg} />
          <div>{vote_groupBy[1].value}</div>
        </div>
        <div className={[styles.voteImg, styles.first].join(" ")}>
          <VotedImage img={vote_groupBy[0].image.attributes.Image.data.attributes.formats.medium.url} alt={vote_groupBy[0].image.attributes.Image.data.attributes.url} imgNumber={firstImg} />
          <div>{vote_groupBy[0].value}</div>
        </div>
        <div className={ [styles.voteImg,styles.voted].join(" ")}>
          <VotedImage img={vote_groupBy[2].image.attributes.Image.data.attributes.formats.medium.url} alt={vote_groupBy[2].image.attributes.Image.data.attributes.url} imgNumber={thirdImg} />
          <div>{vote_groupBy[2].value}</div>
        </div>
      </div>

      <div>
        <div className={styles.vote}>
          <table>
            <thead>
            <tr>
              <th>Position</th>
              <th>Image</th>
              <th>Nombre de Point</th>
            </tr>
            </thead>
            <tbody>
            {vote_groupBy.map((vote,index)=>(
              <tr key={index}>
                <td>{index + 1}</td>
                <td><Image style={{borderRadius:"15px"}}  src={ process.env.STRAPI_URL + vote.image.attributes.Image.data.attributes.formats.medium.url} alt={"lourd"} width={100} height={100} /></td>
                <td>{vote.value}</td>
              </tr>
            ))}
            </tbody>
          </table>
      </div>
      </div>
    </div>
  )


}

export const getServerSideProps = async (context) => {
  const session  = await getSession(context);
  if(session == null){
    return redirectToSignIn();
  }

  const p = await poll.findWithImages(context.params.id);
  const votes = await vote.findByPollId(context.params.id);
  if(!isClosed(p.data.attributes.heure_fin)){
    return redirectToPoll(context.params.id);
  }
  return {
    props: {
      poll : p.data,
      vote_groupBy : groupBy_Vote(votes.data)
    }
  }
}

function groupBy_Vote(votes){
  return votes.reduce((acc,cur) => {
    const index = acc.findIndex((i)=>i.image.id===cur.attributes.Image.data.id);
    if(index === -1){
      acc.push({ value : cur.attributes.value, image : cur.attributes.Image.data});
    }else{
      acc[index].value += cur.attributes.value;
    }
    return acc;
  },[]).sort((d1,d2)=>d1.value-d2.value).reverse();
}

function isClosed(dateClose){
  const now = new Date();
  const close = new Date(dateClose);
  return now >= close;
}


