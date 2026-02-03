import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { CategoriesClient } from './categories-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <CategoriesClient categories={categories} />;
}
