import axios from "axios";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachAuthToken = (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleUnauthorized = (error) => {
  if (error.response?.status === 401) {
    const hadToken = Boolean(useAuthStore.getState().token);
    if (hadToken) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }
  return Promise.reject(error);
};

axiosAuth.interceptors.request.use(attachAuthToken);
axiosApi.interceptors.request.use(attachAuthToken);

axiosAuth.interceptors.response.use((response) => response, handleUnauthorized);
axiosApi.interceptors.response.use((response) => response, handleUnauthorized);

export { axiosAuth, axiosApi };
