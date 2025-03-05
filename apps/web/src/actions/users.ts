import type { IUser } from '@/dtos/user';
import { ApiError } from '@/lib/api-error';
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
          throw new ApiError('Este email já está cadastrado.', ['email']);
        case 'Invalid email':
          throw new ApiError('O email inserido é inválido!', ['email']);
        default:
          throw new ApiError('Erro ao criar a conta, tente novamente!', ['email']);
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
        case 'Email verification resent':
          throw new ApiError(
            'Email não verificado, um novo link de confirmação foi enviado.',
          );
        case 'Invalid credentials':
          throw new ApiError('Credenciais Inválidas.', ['email', 'password']);
        default:
          throw new ApiError('Erro ao logar usuário, tente novamente!');
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
        throw new ApiError('Usuário não autorizado!');
      } else {
        throw new ApiError('Erro ao buscar usuário!');
      }
    }
  }
};
