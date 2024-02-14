'use server';
import { NoteDTO, NoteUpdateDTO } from '@/dtos/NoteDTO';
import { AxiosError } from 'axios';
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
    const response = await api.post<{ note: NoteDTO }>('/notes', { title, content });

    return response.data.note;
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
    const response = await api.put<NoteUpdateDTO>(`/notes/${id}`, { ...modified });

    const updatedAt = response.data.updatedAt;

    return updatedAt;
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
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error modifying note');
  }
};
