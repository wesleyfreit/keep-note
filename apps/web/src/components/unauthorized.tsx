'use client';

import { deleteAuthToken } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export const Unauthorized = () => {
  const handleUnauthorizeUser = useCallback(async () => {
    await deleteAuthToken();

    toast.error('Sessão expirada, faça login novamente.');

    redirect('/login');
  }, []);

  useEffect(() => {
    handleUnauthorizeUser();
  }, [handleUnauthorizeUser]);

  return null;
};
