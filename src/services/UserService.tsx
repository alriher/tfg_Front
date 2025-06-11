import api from "./JwtService";

export async function updateUserProfile(userId: string, data: any) {
  // data puede contener: name, lastName, birthdate, address, phone
  // El backend debe aceptar un PATCH a /users/:id
  const response = await api.patch(`/users/profile/${userId}`, data);
  return response.data;
}

export async function changeUserPassword(userId: number, currentPassword: string, newPassword: string) {
  return api.post(`/users/${userId}/change-password`, { currentPassword, newPassword });
}
