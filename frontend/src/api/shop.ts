import { api } from "../App";
import type { IShop } from "../types";


export const getShopById =async (id:number|string) => {
  const res = await api.get(`/api/shops/${id}`);
  return res.data;
}

export const getShopSarqytsByShopId =async (shopId:number|string) => {
  const res = await api.get(`/api/shops/${shopId}/sarqyts`);
  return res.data;
}

export const editShop =async (data:IShop) => {
  const res = await api.put(`/api/shops/`, {data});
  return res.data;
}