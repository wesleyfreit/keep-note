import { env } from '@/env';
import axios from 'axios';

export const serverApi = axios.create({
  baseURL: env.NEXT_PRIVATE_API_URL,
});

export const appApi = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});
