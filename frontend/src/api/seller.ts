import { api } from "../App";

export const completeOrder = async (id:number|string) => {
  const res = await api.patch(`/api/scan/${id}`);
  return res.data;
}

export const getScanData =async (id:number|string) => {
  const res = await api.get(`/api/scan/${id}`);
  return res.data;
}

export const getSellerShopData =async () => {
  const res = await api.get(`/api/seller/`);
  return res.data;
}

export const getDashboardData = async (shopId:number|string) => {
  const res = await api.get(`/api/dashboard/${shopId}`);
  return res.data;
}

export const getRecentOrders =async (shopId:number|string, limit?:number, day?:string|null, status?:string|null) => {
  const res = await api.get(`/api/seller/${shopId}/orders?limit=${limit}&filter={${day}}&status=${status}`);
  return res.data;
}