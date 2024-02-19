'use server';
import { IUser } from '@/dtos/user';
import { AxiosError } from 'axios';
import { api } from '../services/api';
import { setAuthToken } from './auth';

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
    const response = await api.post<{ user: IUser; token: string }>('/signin', {
      email,
      password,
    });

    const token = response.data.token;

    await setAuthToken(token);

    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;
      switch (errorMessage) {
        case 'Email is not verified':
          throw new Error('Email não verificado');
        case 'User does not exist':
          throw new Error('Usuário não encontrado');
        case 'Invalid credentials':
          throw new Error('Credenciais inválidas');
        case 'Too many requests':
          throw new Error('Muitas tentativas, tente novamente mais tarde');
        default:
          throw new Error('Erro ao logar usuário');
      }
    }
  }
};

export const getUser = async () => {
  try {
    const response = await api.get<{ user: IUser; token: string }>('/user');

    const token = response.data.token;

    await setAuthToken(token);

    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;
      if (errorMessage === 'Unauthorized') {
        return undefined;
      } else {
        throw new Error('Error loging user');
      }
    }
  }
};
