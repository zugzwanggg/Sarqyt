import { createContext, useContext } from "react";
import { useTelegramLogin } from "../hooks/useTelegramLogin";

const UserContext = createContext<any>(null);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useTelegramLogin();

  console.log(user);
  
  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);