'use client';
import { deleteAuthToken, hasAuthToken } from '@/actions/auth';
import { getUser } from '@/actions/users';
import { IUser } from '@/dtos/user';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';

export interface AuthContextProps {
  user: IUser | undefined;
  setUser: (user: IUser) => void;
  isLoadingUserData: boolean;
  removeUserAndToken: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const router = useRouter();

  const removeUserAndToken = useCallback(async () => {
    await deleteAuthToken();
    router.push('/login');

    setUser({} as IUser);
  }, [router]);

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
