import { createContext, useContext, useEffect, useState } from "react";
import {
  signupUser,
  loginUser,
  logoutUser,
  onAuthChange,
} from "../../services/firebase"; //firebase functions
import toast from "react-hot-toast";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signup(name, email, password) {
    try {
      await signupUser(email, password, name);
      toast.success("Account created! 🎉");
      return true;
    } catch (error) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "Email already registered!"
          : error.message;
      toast.error(message);
      return false;
    }
  }

  async function login(email, password) {
    try {
      await loginUser(email, password);
      toast.success("Welcome back! 👋");
      return true;
    } catch (error) {
      toast.error("Invalid email or password!");
      return false;
    }
  }

  async function logout() {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed!");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
