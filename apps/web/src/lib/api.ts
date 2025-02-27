'use server';

import { deleteAuthToken, getAuthToken } from '@/actions/auth';
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
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

      if (['Unauthorized'].includes(message)) {
        api.defaults.headers.Authorization = '';
        await deleteAuthToken();
      }
    }

    return Promise.reject(error);
  },
);

export { api };
