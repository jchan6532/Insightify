import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function createApi(prefix: string) {
  const instance = axios.create({
    baseURL: `${BASE_URL}${prefix}`,
  });

  instance.interceptors.request.use((config) => {
    if (_token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${_token}`;
    }
    return config;
  });

  return instance;
}
