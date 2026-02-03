import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Brands - CarParts',
  description: 'Shop by premium automotive brands',
};

async function getBrands() {
  return prisma.brand.findMany({
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

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop by Brand</h1>
        <p className="text-muted-foreground">
          {"Discover products from the world's leading automotive brands"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/shop?brand=${brand.slug}`}
            className="group"
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-full h-24 flex items-center justify-center bg-muted/30 rounded-lg p-4">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={100}
                        height={60}
                        className="object-contain max-w-full max-h-full"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {brand.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center">
                  {brand._count.products} products available
                </p>
                {brand.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 text-center">
                    {brand.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No brands found</h3>
          <p className="text-muted-foreground">
            Brands will appear here once they are added.
          </p>
        </div>
      )}
    </div>
  );
}
