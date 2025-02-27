'use client';
import { deleteAuthToken, hasAuthToken } from '@/actions/auth';
import { getUser } from '@/actions/users';
import type { IUser } from '@/dtos/user';
import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface AuthContextProps {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
  isLoadingUserData: boolean;
  removeUserAndToken: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const removeUserAndToken = useCallback(async () => {
    await deleteAuthToken();
    setUser({} as IUser);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const authToken = await hasAuthToken();

      if (authToken) {
        const userLogged = await getUser();

        if (!userLogged) {
          removeUserAndToken();
          return;
        }

        setUser(userLogged);
      }
    } catch (error) {
      if (error instanceof Error) {
        removeUserAndToken();
      }
    } finally {
      setIsLoadingUserData(false);
    }
  }, [removeUserAndToken]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserData,
        removeUserAndToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
