import { api } from "../App";

export const getShopById =async (id:number|string) => {
  const res = await api.get(`/api/shops/${id}`);
  return res.data;
}

export const getShopSarqytsByShopId =async (shopId:number|string) => {
  const res = await api.get(`/api/shops/${shopId}/sarqyts`);
  return res.data;
}

export const editShop =async (data:FormData) => {
  const res = await api.put(`/api/shops/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}