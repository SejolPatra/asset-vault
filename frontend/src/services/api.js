import axios from 'axios';

// Dynamically use Vercel env variable or default to local backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

// Interceptor to attach JWT token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Endpoints
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);

// Asset Endpoints
export const getAssets = () => API.get('/assets');
export const createAsset = (assetData) => API.post('/assets', assetData);
export const updateAsset = (id, assetData) => API.put(`/assets/${id}`, assetData);
export const deleteAsset = (id) => API.delete(`/assets/${id}`);

export default API;