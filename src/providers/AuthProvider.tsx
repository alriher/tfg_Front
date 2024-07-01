import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import api from "../services/JwtService";
import { IUser } from "../interfaces/user";

export interface IAuthContext {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: IUser | null;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    const userData = response.data;
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    sessionStorage.removeItem("user");
    await api.post("/logout");
  };

  const register = async (email: string, password: string) => {
    await api.post("/register", { email, password });
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within an AuthProvider");

  return authContext;
};
