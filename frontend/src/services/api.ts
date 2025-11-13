import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clinic_inventory_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clinic_inventory_token');
      localStorage.removeItem('clinic_inventory_user');
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
