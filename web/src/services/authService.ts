import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    const url = config.url || '';
    const requestPath = new URL(url, 'http://localhost').pathname;

    if (requestPath.includes('/staff/') || requestPath.includes('/reports/')) {
      if (state?.staffAuth?.token) {
        config.headers.Authorization = `Bearer ${state.staffAuth.token}`;
      }
    } else if (state?.userAuth?.token) {
      config.headers.Authorization = `Bearer ${state.userAuth.token}`;
    }
  }
  return config;
});

export const authService = {
  async login(credentials: { username: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  async staffLogin(credentials: { email: string; password: string }) {
    const response = await api.post('/staff/login', credentials);
    return response.data;
  },
  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },
  async signup(userData: { username: string; password: string; fullName: string; email: string }) {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

export default api;
