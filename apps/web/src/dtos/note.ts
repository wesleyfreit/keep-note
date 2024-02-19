export type INote = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type INoteUpdated = {
  updatedAt: Date;
};
