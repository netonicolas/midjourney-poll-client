import {getSession} from "next-auth/react";
import {poll, vote} from "../api/strapi/strapi";
import styles from "../../styles/poll.module.css";
import Image from "next/image";
import secondImg from "../../asset/img/2.png";
import VotedImage from "../../component/poll/votedImage";
import firstImg from "../../asset/img/1.png";
import thirdImg from "../../asset/img/3.png";
import {redirectToPoll,redirectToSignIn} from "../../utils/redirect";

export default function result({poll,vote_groupBy,nbVoters}){  console.log("aze",vote_groupBy[1].image);
  return (
   <div className={styles.main}>
      <h1 >Résultat du sondage </h1>
      <h2>{poll.attributes.Titre}</h2>

      <div className={styles.vote}>
        <div className={[styles.voteImg,styles.voted].join(" ")}>
          <VotedImage img={vote_groupBy[1].image.Image.formats.medium.url} alt={vote_groupBy[1].image.Image.url} imgNumber={secondImg} />
          <div>{vote_groupBy[1].value}</div>
        </div>
        <div className={[styles.voteImg, styles.first].join(" ")}>
          <VotedImage img={vote_groupBy[0].image.Image.formats.medium.url} alt={vote_groupBy[0].image.Image.url} imgNumber={firstImg} />
          <div>{vote_groupBy[0].value}</div>
        </div>
        <div className={ [styles.voteImg,styles.voted].join(" ")}>
          <VotedImage img={vote_groupBy[2].image.Image.formats.medium.url} alt={vote_groupBy[2].image.Image.url} imgNumber={thirdImg} />
          <div>{vote_groupBy[2].value}</div>
        </div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"50px",marginBottom:"0"}}>
          <h2>Nombre de votant : {nbVoters}</h2>
        </div>
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
                <td><Image style={{borderRadius:"15px"}}  src={ process.env.STRAPI_URL + vote.image.Image.formats.medium.url} alt={"lourd"} width={100} height={100} /></td>
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

  if(session.id!==1  && !isClosed(p.data.attributes.heure_fin) ){
    return redirectToPoll(context.params.id);
  }
  return {
    props: {
      poll : p.data,
      vote_groupBy : groupBy_Vote(votes.data),
      nbVoters : countNbVoters(votes.data)
    }
  }
}

function groupBy_Vote(votes){
  return votes.reduce((acc,cur) => {
    const index = acc.findIndex((i)=>i.image.id===cur.Image.id);
    console.log("curr",cur);
    if(index === -1){
      acc.push({ value : cur.value, image : cur.Image});
    }else{
      acc[index].value += cur.value;
    }
    return acc;
  },[]).sort((d1,d2)=>d1.value-d2.value).reverse();
}

function countNbVoters(votes){
  return votes.reduce((acc,cur)=>{
    if(!acc.includes(cur.user.id)){
      acc.push(cur.user.id);
    }
    return acc;
  },[]).length;
}

function isClosed(dateClose){
  const now = new Date();
  const close = new Date(dateClose);
  return now >= close;
}


