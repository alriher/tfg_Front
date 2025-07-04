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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: IUser | null;
  setUser?: (user: IUser) => void;
  register: (
    email: string,
    password: string,
    username: string,
    name: string,
    lastName: string,
    birthdate: string,
    address: string,
    phone: string
  ) => Promise<void>;
}
// Birthdate deberia ser string, tengo que hacer la conversion. Lo mismo para el metodo register mas abajo

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

  const register = async (
    email: string,
    password: string,
    username: string,
    name: string,
    lastName: string,
    birthdate: string,
    address: string,
    phone: string
  ) => {
    const response = await api.post("/register", { 
      // Probablemente sea /users/register porque en el backend la creación de usuarios se monta en /users. 
      // La ruta del createUser es /users/, habria que cambiarla en el backend a /users/register
      email,
      password,
      username,
      name,
      lastName,
      birthdate,
      address,
      phone,
    });
    const userData = response.data;
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within an AuthProvider");

  return authContext;
}
