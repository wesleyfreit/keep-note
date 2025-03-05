import type { INote, INoteUpdated } from '@/dtos/note';
import { ApiError } from '@/lib/api-error';
import { AxiosError } from 'axios';
import { api } from '../lib/api';

export const getAllNotes = async () => {
  try {
    const response = await api.get<{ notes: INote[] }>('/notes');

    return {
      ...response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      if (errorMessage === 'Unauthorized') {
        throw new ApiError('Você não está autenticado');
      }
    }
    throw new ApiError('Erro ao buscar notas');
  }
};

export const getNote = async (id: string) => {
  try {
    const response = await api.get<{ note: INote }>(`/notes/${id}`);
    return response.data.note;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      if (errorMessage === 'Unauthorized') {
        throw new ApiError('Você não está autenticado');
      }
    }
    throw new ApiError('Erro ao buscar a nota');
  }
};

export const saveNote = async (value: string, name: string) => {
  const { title, content } =
    name === 'title' ? { title: value, content: '' } : { title: '', content: value };

  try {
    const response = await api.post<{ note: INote }>('/notes', { title, content });

    return response.data.note;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      if (errorMessage === 'Unauthorized') {
        throw new ApiError('Você não está autenticado');
      }
    }
    throw new ApiError('Erro ao salva a nota');
  }
};

export const modifyNote = async (value: string, name: string, id: string) => {
  const modified = name === 'title' ? { title: value } : { content: value };

  try {
    const response = await api.put<INoteUpdated>(`/notes/${id}`, { ...modified });

    const updatedAt = response.data.updatedAt;

    return updatedAt;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      if (errorMessage === 'Unauthorized') {
        throw new ApiError('Você não está autenticado');
      }
    }
    throw new ApiError('Erro ao modificar a nota');
  }
};

export const deleteNote = async (id: string) => {
  try {
    await api.delete(`/notes/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.error;

      if (errorMessage === 'Unauthorized') {
        throw new ApiError('Você não está autenticado');
      }
    }
    throw new ApiError('Erro ao deletar a nota');
  }
};
