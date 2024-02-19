import { AuthContext, AuthContextProps } from '@/contexts/auth';
import { useContext } from 'react';

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  return context;
};
