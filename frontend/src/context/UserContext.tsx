import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTelegramLogin } from "../hooks/useTelegramLogin";
import { getMe } from "../api/auth";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: initialUser, loading: initialLoading } = useTelegramLogin();
  const [user, setUser] = useState<any>(initialUser);
  const [loading, setLoading] = useState(initialLoading);
  const [isSelectLocation, setIsSelectLocation] = useState(false);

  useEffect(() => {
    if (!initialLoading) {
      setUser(initialUser);
      setLoading(false);
    }
  }, [initialUser, initialLoading]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, isSelectLocation, setIsSelectLocation }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);