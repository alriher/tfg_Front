import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACK_URL;

export const getSpaces = async () => {
  const response = await axios.get(`${BACKEND_URL}/spaces`);
  return response.data;
};