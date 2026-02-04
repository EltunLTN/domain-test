import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { getProductImage } from '@/lib/product-images';

interface ShopPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    search?: string;
    q?: string; // Add query parameter support
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    sort?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const where: any = {
    isActive: true,
  };

  if (searchParams.category) {
    const category = await prisma.category.findUnique({
      where: { slug: searchParams.category },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (searchParams.brand) {
    const brand = await prisma.brand.findUnique({
      where: { slug: searchParams.brand },
    });
    if (brand) {
      where.brandId = brand.id;
    }
  }

  // Handle both 'search' and 'q' parameters
  const searchTerm = searchParams.search || searchParams.q;
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { sku: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) {
      where.price.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseFloat(searchParams.maxPrice);
    }
  }

  if (searchParams.condition) {
    where.condition = searchParams.condition;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (searchParams.sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (searchParams.sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (searchParams.sort === 'popular') {
    orderBy = { views: 'desc' };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      brand: true,
    },
    orderBy,
    take: 24,
  });

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null } }),
    prisma.brand.findMany({ take: 20, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ehtiyat hissələri mağazası</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Kateqoriyalar</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`block text-sm hover:text-primary ${
                    searchParams.category === cat.slug ? 'text-primary font-semibold' : ''
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Markalar</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${brand.slug}`}
                  className={`block text-sm hover:text-primary ${
                    searchParams.brand === brand.slug ? 'text-primary font-semibold' : ''
                  }`}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sıralama</h3>
            <select className="w-full p-2 border rounded-md text-sm">
              <option value="">Ən yeni</option>
              <option value="price-asc">Qiymət: aşağıdan yuxarı</option>
              <option value="price-desc">Qiymət: yuxarıdan aşağı</option>
              <option value="popular">Ən populyar</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-muted-foreground">{products.length} məhsul tapıldı</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const finalPrice = calculateDiscount(product.price, product.discount);
              const imageUrl = getProductImage(product.title, product.mainImage);
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square relative bg-muted">
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.brand.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {product.stock > 0 ? `Anbarda ${product.stock} ədəd` : 'Stokda yoxdur'}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <AddToCartButton product={product} />
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Məhsul tapılmadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
