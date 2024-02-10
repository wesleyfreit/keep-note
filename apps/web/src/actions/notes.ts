'use server';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { api } from '../services/api';

export const saveNote = async (formData: FormData) => {
  const content = formData.get('content') as string;

  try {
    await api.post('/notes', { content });

    revalidatePath('/');
  } catch (error) {
    if (error instanceof AxiosError) {
      return new Error(error.response?.data.message);
    }
    throw new Error('Error saving note');
  }
};
