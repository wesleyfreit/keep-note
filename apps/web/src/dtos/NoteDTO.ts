export type NoteDTO = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
};

export type NoteUpdateDTO = {
  updatedAt: Date;
};
