import api from "./JwtService";

export const getSpaces = async (page = 1, pageSize = 15) => {
  const response = await api.get(`/spaces?page=${page}&pageSize=${pageSize}`);
  return response.data; // { total, page, pageSize, spaces }
};

export const getSpaceById = async (id: string) => {
  const response = await api.get(`/spaces/${id}`);
  return response.data;
};
