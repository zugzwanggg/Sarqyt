import { api } from "../App";


export const getUserFavorites =async () => {
  const res = await api.get('/api/favorites');
  return res.data;
}