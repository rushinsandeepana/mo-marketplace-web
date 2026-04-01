import axios from 'axios';
import { authStore } from '../store/auth.store';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// attach JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('mo_auth'); // 🔥 DIRECT READ

  if (token) {
    const parsed = JSON.parse(token);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

// redirect to login on 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.clearAuth();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default client;