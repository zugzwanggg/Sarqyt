import { api } from "../App";


export const getUserFavorites =async () => {
  const res = await api.get('/api/favorites');
  return res.data;
}

export const getUserOrder =async () => {
  const res = await api.get('/api/orders');
  return res.data;
}