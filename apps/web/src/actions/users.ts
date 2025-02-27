'use server';
import type { IUser } from '@/dtos/user';
import { AxiosError } from 'axios';
import { api } from '../lib/api';
import { setAuthToken } from './auth';

export const signUp = async (name: string, email: string, password: string) => {
  try {
    await api.post('/signup', { name, email, password });
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      switch (errorMessage) {
        case 'User already exists':
          throw new Error('Este email já está cadastrado.');
        case 'Invalid email':
          throw new Error('O email inserido é inválido!');
        default:
          throw new Error('Erro ao criar a conta!');
      }
    }
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
          throw new Error(
            'Email não verificado, um novo link de confirmação foi enviado.',
          );
        case 'User does not exist':
          throw new Error('Usuário não encontrado!');
        case 'Invalid credentials':
          throw new Error('Credenciais inválidas!');
        default:
          throw new Error('Erro ao logar usuário!');
      }
    }
  }
};

export const verifyEmail = async (code: string) => {
  try {
    await api.post(
      '/verify-email',
      {},
      {
        headers: {
          Authorization: `Bearer ${code}`,
        },
      },
    );

    return { message: 'Email verificado com sucesso!', code: 200 };
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      switch (errorMessage) {
        case 'Email already verified':
          return { message: 'Email já verificado!', code: 400 };
        case 'Unauthorized':
          return { message: 'Código de verificação inválido ou expirado!', code: 401 };
        case 'User does not exist':
          return { message: 'Conta não encontrada!', code: 404 };
        default:
          return { message: 'Erro ao verificar email!', code: 500 };
      }
    }
    return { message: 'Erro ao verificar email!', code: 500 };
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
