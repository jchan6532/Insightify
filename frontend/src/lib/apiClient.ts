import axios from 'axios';

// Point this to your FastAPI dev URL
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: false,
});

// Optional: simple token setter for when you add real auth
let _token: string | null = null;
export function setAuthToken(token: string | null) {
  _token = token;
}

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});
