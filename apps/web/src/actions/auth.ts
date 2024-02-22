'use server';

import { api } from '@/lib/api';
import { cookies } from 'next/headers';

export const hasAuthToken = async () => {
  return cookies().has('keep_note.auth');
};

export const getAuthToken = async () => {
  return cookies().get('keep_note.auth')?.value;
};

export const setAuthToken = async (token: string) => {
  cookies().set('keep_note.auth', `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1, // 1h
  });
};

export const deleteAuthToken = async () => {
  cookies().delete('keep_note.auth');
  api.defaults.headers.Authorization = '';
};
