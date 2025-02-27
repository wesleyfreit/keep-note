import type { AuthContextProps } from '@/contexts/auth-context';
import { AuthContext } from '@/contexts/auth-context';
import { useContext } from 'react';

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  return context;
};
