export type NoteDTO = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteUpdateDTO = {
  updatedAt: Date;
};
