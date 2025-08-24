import { api } from "../App";


export const getUserFavorites =async () => {
  const res = await api.get('/api/favorites');
  return res.data;
}

export const getUserOrders =async () => {
  const res = await api.get('/api/orders');
  return res.data;
}

export const search =async (query:string) => {
  const res = await api.get(`/api/search?q=${query}`);
  return res.data;
}