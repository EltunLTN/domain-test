import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return Response.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return Response.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
