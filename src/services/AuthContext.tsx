import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { loginVoter } from "./authService";

interface User {
  id: string;
  voterId: string;
  fullName: string;
  faceDescriptor?: number[] | null;
}

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  login: (voterId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Use "initialized" flag to indicate that the AuthContext has rehydrated from localStorage.
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("User loaded from localStorage:", parsedUser);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    } else {
      console.log("No user found in localStorage");
    }
    setInitialized(true);
  }, []);

  const login = async (voterId: string, password: string): Promise<boolean> => {
    try {
      const result = await loginVoter(voterId, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log("User logged in:", result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, initialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
