import { createContext, useState, useContext } from "react";
import API_BASE_URL from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const loggedIn = !!user;

  const updateAuth = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  const logAction = async (action, details = "") => {
    if (!user) return;
    try {
      await fetch(`${API_BASE_URL}/logAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, action, details }),
      });
    } catch (err) {
      console.error("Failed to log action:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ loggedIn, user, setAuth: updateAuth, hasPermission, logAction }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
