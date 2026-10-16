import axios from "axios";

const apiBaseURL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;