import { useAuth } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import api from "./JwtService";

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

export function RequireSpaceAdminOrAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // No logueado: redirige a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isSpaceAdmin && !user.isAdmin) {
    // Logueado pero no space admin ni admin: redirige a home
    return <Navigate to="/home" replace />;
  }

  // Es space admin o admin: muestra el contenido protegido
  return children;
}

// Subida de imagen a Cloudinary
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const url = "https://api.cloudinary.com/v1_1/dpot32ylv/image/upload"; // Sustituye <tu_cloud_name>
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "TFGBookings"); // Sustituye <tu_upload_preset>
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
}

// Crear espacio (envía la URL de la imagen, no el archivo)
export async function createSpace(
  name: string,
  description: string,
  address: string,
  provincia: string,
  localidad: string,
  capacity: number,
  lat: number,
  lon: number,
  img: string,
  isSlotBased: boolean,
  user_id: number // nuevo parámetro
) {
  const response = await api.post("/spaces", {
    name,
    description,
    address,
    provincia,
    localidad,
    capacity,
    lat,
    lon,
    img,
    isSlotBased,
    user_id, // incluir en el body
  });
  return response.data;
}

// Obtener los espacios creados por un usuario (admin de espacios) con paginación
export async function getSpacesByUserId(user_id: number, page = 1, pageSize = 15) {
  const response = await api.get(`/spaces/user/${user_id}?page=${page}&pageSize=${pageSize}`);
  return response.data; // { total, page, pageSize, spaces }
}

// Obtener reservas de un espacio con paginación (para administradores)
export const getBookingsBySpaceIdPaginated = async (spaceId: number, page = 1, pageSize = 15) => {
  const response = await api.get(`/bookings/space/${spaceId}?page=${page}&pageSize=${pageSize}`);
  return response.data; // { total, page, pageSize, bookings }
}

// Actualizar espacio (edición)
export async function updateSpace(
  id: number,
  name: string,
  description: string,
  address: string,
  provincia: string,
  localidad: string,
  capacity: number,
  lat: number,
  lon: number,
  img: string | null,
  isSlotBased: boolean,
  user_id?: number // opcional, por seguridad
) {
  const response = await api.put(`/spaces/${id}`, {
    name,
    description,
    address,
    provincia,
    localidad,
    capacity,
    lat,
    lon,
    img,
    isSlotBased,
    user_id,
  });
  return response.data;
}

// Eliminar espacio
export async function deleteSpace(id: number, user_id?: number) {
  // Si el backend requiere user_id, pásalo como query param o en el body
  const response = await api.delete(`/spaces/${id}` + (user_id ? `?user_id=${user_id}` : ''));
  return response.data;
}
