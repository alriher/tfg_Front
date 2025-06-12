import { useAuth } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export function RequireSpaceAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // No logueado: redirige a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isSpaceAdmin) {
    // Logueado pero no space admin: redirige a home
    return <Navigate to="/home" replace />;
  }

  // Es space admin: muestra el contenido protegido
  return children;
}
