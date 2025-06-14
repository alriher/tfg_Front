import api from "./JwtService";

export const getSpaces = async (
  page = 1,
  pageSize = 15,
  filters?: {
    name?: string;
    username?: string;
    provincia?: string;
    localidad?: string;
  }
) => {
  let query = `?page=${page}&pageSize=${pageSize}`;
  if (filters) {
    if (filters.name)
      query += `&name=${encodeURIComponent(filters.name)}`;
    if (filters.username)
      query += `&username=${encodeURIComponent(filters.username)}`;
    if (filters.provincia)
      query += `&provincia=${encodeURIComponent(filters.provincia)}`;
    if (filters.localidad)
      query += `&localidad=${encodeURIComponent(filters.localidad)}`;
  }
  const response = await api.get(`/spaces${query}`);
  return response.data; // { total, page, pageSize, spaces }
};

export const getSpaceById = async (id: string) => {
  const response = await api.get(`/spaces/${id}`);
  return response.data;
};
