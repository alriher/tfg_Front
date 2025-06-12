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
  isSlotBased: boolean
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
  });
  return response.data;
}
