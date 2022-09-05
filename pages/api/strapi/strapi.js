const domain = process.env.STRAPI_URL;


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
  findByUserIdAndPollId: async (userId, pollId) => {
    const res = await fetch(domain+'/api/votes?filter[$and][0][user][$eq]='+userId+'&filter[$and][1][poll][$eq]='+pollId+'&populate[Image][populate]=*&populate[user][populate]=*');
    return await res.json();
  }
}
