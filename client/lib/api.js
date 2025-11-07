import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // axios automatically parses JSON
  } catch (error) {
    // Optional: customize error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      // Network or other errors
      throw new Error(error.message || 'Login failed');
    }
  }
}


// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
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
    detail: (id) => `/products/${id}`,
    create: '/products',
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
  },
  // Add more endpoints as needed
};

export default api;