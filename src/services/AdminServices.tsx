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