import axios from "axios";
import { convertDates } from "../utils/convertDates";

const BACKEND_URL = import.meta.env.VITE_BACK_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => Promise<void>)[] = [];

function onRefreshed() {
  refreshSubscribers.map((callback: () => Promise<void>) => callback());
}

function addRefreshSubscriber(callback: () => void) {
  refreshSubscribers.push(() => Promise.resolve(callback()));
}

// Request Interceptor

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    response.data = convertDates(response.data);
    return response;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.post("/token");
          isRefreshing = false;
          onRefreshed();
          refreshSubscribers = [];
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          originalRequest._retry = true;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
