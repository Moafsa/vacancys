import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { name: string; action: string } }
) {
  // Remover checagem de sessão NextAuth
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.isAdmin) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  const { name, action } = params;
  if (!['activate', 'deactivate'].includes(action)) {
    return new NextResponse('Invalid action', { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.CORE_API_URL}/modules/${name}/${action}`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CORE_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} module`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error ${action}ing module:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 