import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  // save login state whenever it changes
  const updateLogin = (value) => {
    setLoggedIn(value);
    localStorage.setItem("loggedIn", value);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn: updateLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
