const domain = process.env.STRAPI_URL;
import {getSession, useSession} from "next-auth/react";

export const poll = {
  all: async () => {
    const res = await fetch(domain+'/api/polls');
    return await res.json();
  },
  allWithImages: async () => {
    const res = await fetch(domain+'/api/polls?populate[Full_image][populate]=*&populate[images][populate]=*');
    return await res.json();
  },
  findWithImages: async (id) => {
    const res = await fetch(domain+'/api/polls/'+id+'?populate[Full_image][populate]=*&populate[images][populate]=*');
    return await res.json();
  }
}

export const category = {
  all: async () => {
    const res = await fetch(domain+'/api/categories');
    return await res.json();
  }
}

export const vote = {
  create: async (pollId, img,userId,value) => {

    const res = await fetch(domain+'/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data:{
        poll: pollId,
        Image: img,
        user: userId,
        value:value
      }})
    });
    return await res.json();
  },
  all: async () => {
    const res = await fetch(domain+'/api/votes');
    return await res.json();
  },
  findByUserIdAndPollId: async (session, pollId) => {
    const res = await fetch(domain+`/api/votes/poll/${pollId}/user/${session.id}`,{
      headers: {
        'authorization': `Bearer ${session.jwt}`
      }
    });
    return await res.json();
  },
  findByPollId: async (pollId) => {
   const res = await fetch(domain+`/api/votes/poll/${pollId}`);
   return await res.json();
  }
}
