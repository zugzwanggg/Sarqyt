import { useEffect, useState } from 'react';
import { telegramAuth, getMe } from '../api/auth';

declare global {
  interface Window {
    Telegram: any;
  }
}

export function useTelegramLogin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    const initData = tg.initData;

    if (initData) {
      telegramAuth(initData)
        .then((res) =>{
              localStorage.setItem('authToken', res.token);
              return getMe(res?.token)
            }
          )
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => {
          console.error('Telegram login error:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}