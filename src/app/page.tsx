import { prisma } from '@/lib/prisma';
import { HomeClient } from '@/components/home-client';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    take: 8,
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: {
      parentId: null,
    },
    take: 6,
  });
}

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />;
}
