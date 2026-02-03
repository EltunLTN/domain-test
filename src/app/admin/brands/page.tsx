import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { BrandsClient } from './brands-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBrandsPage() {
  await requireAdmin();

  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <BrandsClient brands={brands} />;
}
