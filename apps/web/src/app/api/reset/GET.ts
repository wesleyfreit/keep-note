import { deleteAuthToken, hasAuthToken } from '@/actions/auth';
import { redirect } from 'next/navigation';

export async function GET() {
  const authToken = await hasAuthToken();

  if (authToken) {
    await deleteAuthToken();
  }

  redirect('/login');
}
