'use server';
import { NoteDTO } from '@/dtos/NoteDTO';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { api } from '../services/api';

export const getAllNotes = async () => {
  try {
    const response = await api.get<{ notes: NoteDTO[] }>('/notes');
    return response.data.notes;
  } catch (error) {
    throw new Error('Error fetching notes');
  }
};

export const saveNote = async (title: string, content: string) => {
  try {
    await api.post('/notes', { title, content });
    revalidatePath('/');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error saving note');
  }
};
