import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

export async function GET() {
  // Remover checagem de sessão NextAuth
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.isAdmin) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const response = await fetch(`${process.env.CORE_API_URL}/modules`, {
      headers: {
        'x-api-key': process.env.CORE_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch modules from core');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 