import { api } from "../App";

export const completeOrder = async (id:number|string, pickup_code:string) => {
  const res = await api.patch(`/api/scan/${id}`, {pickup_code});
  return res.data;
}

export const getScanData =async (id:number|string) => {
  const res = await api.get(`/api/scan/${id}`);
  return res.data;
}