import { useAuth } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import api from "./JwtService";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // No logueado: redirige a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isAdmin) {
    // Logueado pero no admin: redirige a home
    return <Navigate to="/home" replace />;
  }

  // Es admin: muestra el contenido protegido
  return children;
}

export async function getAllUsers(page = 1, pageSize = 15, search?: string) {
  const params: any = { page, pageSize };
  if (search && search.trim() !== "") {
    params.search = search;
  }
  const response = await api.get("/users", { params });
  return response.data;
}

export async function updateUserSpaceAdmin(userId: string, isSpaceAdmin: boolean) {
  // Suponiendo que tu backend espera un PATCH a /users/:id con { isSpaceAdmin }
  const response = await api.patch(`/users/${userId}`, { isSpaceAdmin });
  return response.data;
}

export async function deleteUser(userId: string) {
  // Suponiendo que tu backend espera un DELETE a /users/:id
  const response = await api.delete(`/users/${userId}`);
  return response.data;
}