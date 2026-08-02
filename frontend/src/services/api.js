import axios from 'axios';

// Set up base URL for local development
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Interceptor: Attach JWT token to every request if available in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Register new user
export const registerUser = (userData) => API.post('/auth/register', userData);

// Login existing user
export const loginUser = (userData) => API.post('/auth/login', userData);

// ==========================================
// ASSET ENDPOINTS (Protected Routes)
// ==========================================

// Fetch all assets for logged-in user
export const getAssets = () => API.get('/assets');

// Create a new asset
export const createAsset = (assetData) => API.post('/assets', assetData);

// Update an existing asset by ID
export const updateAsset = (id, assetData) => API.put(`/assets/${id}`, assetData);

// Delete an asset by ID
export const deleteAsset = (id) => API.delete(`/assets/${id}`);

export default API;