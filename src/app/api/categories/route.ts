import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      { error: 'Kateqoriyalar yüklənmədi' },
      { status: 500 }
    );
  }
}
