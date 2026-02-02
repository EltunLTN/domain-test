import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories - CarParts',
  description: 'Browse car parts by category',
};

async function getCategories() {
  return prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop by Category</h1>
        <p className="text-muted-foreground">
          Find the perfect parts for your vehicle organized by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group"
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Package2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category._count.products} products
                    </p>
                  </div>
                </div>
              </CardHeader>
              {category.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <Package2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            Categories will appear here once they are added.
          </p>
        </div>
      )}
    </div>
  );
}
