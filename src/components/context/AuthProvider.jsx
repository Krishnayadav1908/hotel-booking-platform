import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(parsedUser.isLoggedIn);
    }
    setIsLoading(false);
  }, []);

  function login(userData) {
    const userWithAuth = { ...userData, isLoggedIn: true };
    localStorage.setItem("user", JSON.stringify(userWithAuth));
    setUser(userWithAuth);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }

  function updateUser(updates) {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
