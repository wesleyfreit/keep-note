import { deleteAuthToken, getAuthToken } from '@/actions/auth';
import axios, { AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error instanceof AxiosError) {
      const message = error.response?.data.error;

      if (message === 'Unauthorized' && !isServer) {
        await deleteAuthToken();
      }
    }

    return Promise.reject(error);
  },
);

export { api };
