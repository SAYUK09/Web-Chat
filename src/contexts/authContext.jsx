import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage && localStorage.getItem("auth");
    try {
      return localUser ? JSON.parse(localUser) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
