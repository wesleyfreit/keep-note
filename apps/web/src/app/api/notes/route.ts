import { serverApi } from '@/services/axios';
import { NextRequest } from 'next/server';

export async function GET() {
  const response = await serverApi.get('/notes');

  return Response.json(response.data);
}

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const response = await serverApi.post('/notes', { content });

  return Response.json(response.data);
}

export async function DELETE(req: NextRequest) {
  console.log(req);

  // const response = await api.delete(`/notes/${id}`);

  // return Response.json(response.data);
  return '';
}
