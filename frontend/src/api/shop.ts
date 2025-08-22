import { api } from "../App";


export const getShopById =async (id:number|string) => {
  const res = await api.get(`/api/shops/${id}`);
  return res.data;
}