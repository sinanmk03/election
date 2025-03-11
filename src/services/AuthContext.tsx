import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { loginVoter } from "./authService";
// If you want to call registerVoter, you can import that here as well.

interface User {
  id: string;
  voterId: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (voterId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user data is in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * login function calls your Firestore-based login logic (loginVoter).
   * If successful, store the user in localStorage and in state.
   */
  const login = async (voterId: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await loginVoter(voterId, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * logout function clears localStorage and resets state.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Convenience hook for consuming the AuthContext.
 */
export function useAuth() {
  return useContext(AuthContext);
}
