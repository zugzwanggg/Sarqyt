import { api } from "../App";

export const acceptOrder = async (id:number|string) => {
  const res = await api.patch(`/api/scan/${id}`);
  return res.data;
}

export const getScanData =async (id:number|string) => {
  const res = await api.get(`/api/scan/${id}`);
  return res.data;
}