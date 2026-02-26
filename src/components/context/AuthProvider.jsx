import { createContext, useContext, useEffect, useState } from "react";
import {
  signupUser,
  loginUser,
  logoutUser,
  onAuthChange,
} from "../../services/firebase"; //firebase functions
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user doc from Firestore to check banned status
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const banned = userDoc.exists() ? userDoc.data().banned : false;
          const role = userDoc.exists()
            ? userDoc.data().role || "user"
            : "user";
          if (banned) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            await logoutUser();
            toast.error("Your account is banned.");
            return;
          }
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            banned: banned,
            role: role,
          });
          setIsAuthenticated(true);
        } catch (err) {
          setUser(null);
          setIsAuthenticated(false);
          toast.error("Failed to check user status.");
        }
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
      const firebaseUser = await loginUser(email, password);
      // Fetch user doc from Firestore to check banned status
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const banned = userDoc.exists() ? userDoc.data().banned : false;
      const role = userDoc.exists() ? userDoc.data().role || "user" : "user";
      if (banned) {
        await logoutUser();
        toast.error("Your account is banned.");
        return false;
      }
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        banned: banned,
        role: role,
      });
      setIsAuthenticated(true);
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
    <AuthContext.Provider
      value={{ user, isAuthenticated, signup, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
