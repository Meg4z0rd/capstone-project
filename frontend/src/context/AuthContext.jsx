import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lumiskin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("lumiskin_token") || null,
  );

  // useCallback agar referensi login/logout stabil antar render
  // → tidak trigger ulang useEffect yang bergantung padanya
  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    localStorage.setItem("lumiskin_user", JSON.stringify(userData));
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("lumiskin_token", jwtToken);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lumiskin_user");
    localStorage.removeItem("lumiskin_token");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
