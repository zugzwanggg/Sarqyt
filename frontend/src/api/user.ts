import { api } from "../App";

export const getSarqyts = async (categoryId:number|string|null) => {
  const res = await api.get(`/api/sarqyts?categoryId=${categoryId}`);
  return res.data;
}

export const getSarqytById = async (id:number) => {
  const res = await api.get(`/api/sarqyts/${id}`);
  return res.data;
}