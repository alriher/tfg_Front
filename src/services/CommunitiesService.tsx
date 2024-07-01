import api from "./JwtService";

export const getSpaces = async () => {
  const response = await api.get(`/spaces`);
  return response.data;
};

export const getSpaceById = async (id: string) => {
  const response = await api.get(`/spaces/${id}`);
  return response.data;
};
