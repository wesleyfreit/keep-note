import axios from 'axios';

const privateApiUrl = process.env.NEXT_PRIVATE_API_URL;
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const serverApi = axios.create({
  baseURL: privateApiUrl,
});

export const appApi = axios.create({
  baseURL: publicApiUrl,
});
