import { api } from "../App"

export async function telegramAuth(initData: string) {
  const res = await api.post('/api/auth/telegram', { initData });
  return res.data; 
}

export const getMe =async () => {
  const res = await api.get('/api/user');
  return res.data;
}