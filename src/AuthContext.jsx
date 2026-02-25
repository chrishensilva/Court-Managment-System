import { createContext, useState, useContext, useEffect } from "react";
import API_BASE_URL from "./config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedIn = !!user;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/verifyToken`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.status === 'success') {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const updateAuth = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: 'include'
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
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
        credentials: 'include',
        body: JSON.stringify({ username: user.username, action, details }),
      });
    } catch (err) {
      console.error("Failed to log action:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ loggedIn, user, setAuth: updateAuth, logout, hasPermission, logAction, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
