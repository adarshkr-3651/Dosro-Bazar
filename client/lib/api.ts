import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // axios automatically parses JSON
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
}

export async function signUpUser(username:string, email:string, password:string) {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data; // axios automatically parses JSON
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else {
      throw new Error(error.message || 'Registration failed');
    }
}
}

export async function logoutUser() {
  try {
  localStorage.removeItem("token");
  window.location.reload();
} catch (error: any) {
  throw new Error('Logout failed');
}}


// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  products: {
    list: '/products',
    detail: (id: string | number) => `/products/${id}`,
    create: '/products',
    update: (id: string | number) => `/products/${id}`,
    delete: (id: string | number) => `/products/${id}`,
  },
};

export default api;
