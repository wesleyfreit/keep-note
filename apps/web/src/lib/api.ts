'use server';
import { getAuthToken } from '@/actions/auth';
import { env } from '@/env';
import axios from 'axios';

const api = axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export { api };
