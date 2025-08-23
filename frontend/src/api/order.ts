import { api } from "../App";


export const getOrderById =async (id:number|string) => {
  const res = await api.get(`/api/orders/${id}`);
  return res.data;
}