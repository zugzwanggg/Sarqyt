import { api } from "../App"

export async function telegramAuth(initData: string) {
  const res = await api.post('/api/auth/telegram', { initData });
  return res.data; 
}

export const getMe = async (token?: string) => {
  const authToken = token || localStorage.getItem('authToken');
  const res = await api.get('/api/user', {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  return res.data;
}