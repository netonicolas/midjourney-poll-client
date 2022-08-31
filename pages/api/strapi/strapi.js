const domain = 'http://localhost:1337';


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
  create: async (pollId, categoryId) => {
    const res = await fetch(domain+'/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        poll: pollId,
        category: categoryId
      })
    });
    return await res.json();
  }
}
