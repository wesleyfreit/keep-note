'use server';
import { NoteDTO } from '@/dtos/NoteDTO';
import { NoteIdDTO } from '@/dtos/NoteIdDTO';
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

export const getNote = async (id: string) => {
  try {
    const response = await api.get<{ note: NoteDTO }>(`/notes/${id}`);
    return response.data.note;
  } catch (error) {
    throw new Error('Error fetching note');
  }
};

export const saveNote = async (value: string, name: string) => {
  const { title, content } =
    name === 'title' ? { title: value, content: '' } : { title: '', content: value };

  try {
    const response = await api.post<NoteIdDTO>('/notes', { title, content });

    const id = response.data.id;

    revalidatePath('/');

    return id;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error saving note');
  }
};

export const modifyNote = async (value: string, name: string, id: string) => {
  const modified = name === 'title' ? { title: value } : { content: value };

  try {
    await api.put(`/notes/${id}`, { ...modified });

    revalidatePath('/');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error modifying note');
  }
};

export const deleteNote = async (id: string) => {
  try {
    await api.delete(`/notes/${id}`);

    revalidatePath('/');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error modifying note');
  }
};
