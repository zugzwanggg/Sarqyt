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

export const getDashboardData = async (shopId:number|string, filter:string|null) => {
  const res = await api.get(`/api/dashboard/${shopId}?filter=${filter}`);
  return res.data;
}

export const getRecentOrders =async (shopId:number|string, limit?:number, day?:string|null, status?:string|null) => {
  const res = await api.get(`/api/seller/${shopId}/orders?limit=${limit}&filter=${day}&status=${status}`);
  return res.data;
}

export const getSellerProducts =async (shopId:number|string) => {
  const res = await api.get(`/api/seller/${shopId}/products`);
  return res.data;
}

export const getSellerProductById =async (shopId:number|string, productId:number|string) => {
  const res = await api.get(`/api/seller/${shopId}/products/${productId}`);
  return res.data;
}


export const getSellerProductSarqyts =async (shopId:number|string, productId:number|string) => {
  const res = await api.get(`/api/seller/${shopId}/products/${productId}/sarqyts`);
  return res.data;
}

export const createProduct =async (shopId:number|string, formData:FormData) => {
  const res = await api.post(`/api/seller/${shopId}/products`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

export const createSarqyt = async (shopId:number|string, data:any) => {
  const res = await api.post(`/api/seller/${shopId}/products/sarqyt`, {data});
  return res.data;
}