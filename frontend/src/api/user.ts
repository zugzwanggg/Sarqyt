import { api } from "../App";


export const getSarqyts = async (categoryId:number|string|null) => {
  const res = await api.get(`/api/sarqyts?categoryId=${categoryId}`);
  return res.data;
}