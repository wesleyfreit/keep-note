export type INote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type INoteUpdated = {
  updatedAt: Date;
};
