import { api } from "../App";

export const getSarqyts = async (categoryId:number|string|null) => {
  
  let res;
  if (categoryId === null) {
    res = await api.get(`/api/sarqyts`);
  } else {
    res = await api.get(`/api/sarqyts?categoryId=${categoryId}`);
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