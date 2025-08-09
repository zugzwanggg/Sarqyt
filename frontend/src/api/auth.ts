import { api } from "../App"

export async function telegramAuth(initData: string) {
  const res = await api.post('/auth/telegram', { initData });
  return res.data; 
}

export const getMe =async () => {
  const res = await api.get('/user');

  return res.data;
}