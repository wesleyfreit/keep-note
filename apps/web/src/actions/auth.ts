'use server';

import { api } from '@/lib/api';
import { cookies } from 'next/headers';

export const hasAuthToken = async () => {
  return (await cookies()).has('keep_note.auth');
};

export const getAuthToken = async () => {
  return (await cookies()).get('keep_note.auth')?.value;
};

export const setAuthToken = async (token: string) => {
  (await cookies()).set('keep_note.auth', `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1, // 1h
  });
};

export const deleteAuthToken = async () => {
  api.defaults.headers.Authorization = '';
  (await cookies()).delete('keep_note.auth');
};
