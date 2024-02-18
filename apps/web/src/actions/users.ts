'use server';
import { IUser } from '@/dtos/user';
import { AxiosError } from 'axios';
import { api } from '../services/api';

export const signUp = async (name: string, email: string, password: string) => {
  try {
    await api.post('/signup', { name, email, password });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Error creating user');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post<IUser>('/signin', { email, password });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Error loging user');
  }
};
