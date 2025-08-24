import { api } from "../App";

export const getSarqyts = async (categories:number[]|null) => {
  
  let res;
  if (categories === null) {
    res = await api.get(`/api/sarqyts`);
  } else {
    res = await api.get(`/api/sarqyts?categories=${categories}`);
  }

  return res.data;
}

export const getNewestSarqyts = async (limit:number, categories:number[]|null) => {
  let res;
  if (categories === null) {
    res = await api.get(`/api/sarqyts/new?limit=${limit}`);
  } else {
    res = await api.get(`/api/sarqyts/new?limit=${limit}&categories=${categories}`);
  }
  return res.data;
}

export const getSarqytById = async (id:number|string) => {
  const res = await api.get(`/api/sarqyts/${id}`);
  return res.data;
}

export const getSarqytCategories = async () => {
  const res = await api.get(`/api/categories`);
  return res.data;
}



export const addSarqytToFavorites = async (sarqytId:number|string) => {
  const res = await api.post('/api/favorites', {sarqytId});
  return res.data;
}

export const removeSarqytFromFavorites = async (sarqytId:number|string) => {
  const res = await api.delete(`/api/favorites/${sarqytId}`);
  return res.data;
}


export const reserveSarqyt = async (sarqyt_id:string|number,shop_id:number, quantity:number) => {
  const res = await api.post('/api/reserve', {sarqyt_id, shop_id, quantity});
  return res.data;
}

export const cancelReservation =async (order_id:number|string) => {
  const res = await api.patch('/api/reserve', {order_id});
  return res.data;
}