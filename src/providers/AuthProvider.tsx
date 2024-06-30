// AuthProvider.tsx
import { createContext, useState, ReactNode, useContext } from "react";
import api from "../services/JwtService";
import { IUser } from "../interfaces/user";

export interface IAuthContext {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: IUser | null;
}

export interface IUserFormInput {
  email: string;
  password: string;
}

const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      setUser(response.data);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within an AuthProvider");

  return authContext;
};

export default AuthProvider;