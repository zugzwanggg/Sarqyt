import { api } from "../App";


export const getShopById =async (id:number|string) => {
  const res = await api.get(`/api/shops/${id}`);
  return res.data;
}

export const getShopSarqytsByShopId =async (shopId:number|string) => {
  const res = await api.get(`/api/shops/${shopId}/sarqyts`);
  return res.data;
}