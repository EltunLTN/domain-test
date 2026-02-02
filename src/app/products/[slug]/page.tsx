import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductImage } from '@/lib/product-images';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      brand: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Increment view count
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  const finalPrice = calculateDiscount(product.price, product.discount);
  const attributes = product.attributes as any;
  const imageUrl = getProductImage(product.title, product.mainImage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="aspect-square relative bg-muted rounded overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link href={`/shop?brand=${product.brand.slug}`} className="text-sm text-muted-foreground hover:text-primary">
              {product.brand.name}
            </Link>
            <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            {product.discount > 0 ? (
              <>
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">SKU:</span> {product.sku || 'N/A'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Condition:</span>{' '}
              <span className="capitalize">{product.condition.toLowerCase()}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Availability:</span>{' '}
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Compatibility */}
          {(product.carMake || product.carModel) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Compatibility</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {product.carMake && (
                    <div>
                      <span className="text-muted-foreground">Make:</span> {product.carMake}
                    </div>
                  )}
                  {product.carModel && (
                    <div>
                      <span className="text-muted-foreground">Model:</span> {product.carModel}
                    </div>
                  )}
                  {product.yearFrom && (
                    <div>
                      <span className="text-muted-foreground">Year:</span> {product.yearFrom}
                      {product.yearTo && ` - ${product.yearTo}`}
                    </div>
                  )}
                  {product.engine && (
                    <div>
                      <span className="text-muted-foreground">Engine:</span> {product.engine}
                    </div>
                  )}
                  {product.gearbox && (
                    <div>
                      <span className="text-muted-foreground">Gearbox:</span> {product.gearbox}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attributes */}
          {attributes && Object.keys(attributes).length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
