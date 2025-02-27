'use client';

import type { IUser } from '@/dtos/user';
import { createContext } from 'react';

export interface AuthContextProps {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
  isLoadingUserData: boolean;
  removeUserAndToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
