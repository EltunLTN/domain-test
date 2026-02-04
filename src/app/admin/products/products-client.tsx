'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Edit, Trash, Plus, Package2, Tag, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RevEngine, StaggerContainer, StaggerItem } from '@/components/animations';
import Image from 'next/image';
import { getProductImage } from '@/lib/product-images';

interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string | null;
  price: number;
  discount: number;
  stock: number;
  isActive: boolean;
  mainImage: string | null;
  category: { name: string };
  brand: { name: string };
}

export function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`"${productTitle}" məhsulunu silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
      return;
    }

    setDeleting(productId);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Məhsul silinə bilmədi');
      }
    } catch (error) {
      alert('Məhsul silinərkən xəta baş verdi');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Məhsullar
          </h1>
          <p className="text-muted-foreground mt-1">Bütün avtomobil ehtiyat hissələrini idarə edin</p>
        </div>
        <RevEngine>
          <Link href="/admin/products/new">
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4" />
              Yeni məhsul
            </Button>
          </Link>
        </RevEngine>
      </div>

      <div className="grid gap-4">
        <StaggerContainer>
          {products.map((product) => {
            const finalPrice = product.discount > 0 
              ? product.price - (product.price * product.discount) / 100 
              : product.price;
            const imageUrl = getProductImage(product.title, product.mainImage);

            return (
              <StaggerItem key={product.id}>
                <Card className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {product.brand.name}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Package2 className="h-3 w-3" />
                                {product.category.name}
                              </span>
                              {product.sku && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-xs">SKU: {product.sku}</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 flex-wrap">
                              {/* Price */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatPrice(finalPrice)}
                                </span>
                                {product.discount > 0 && (
                                  <>
                                    <span className="text-sm line-through text-muted-foreground">
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                                      -{product.discount}%
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Stock */}
                              <div className={`text-sm px-2 py-1 rounded-full font-medium ${
                                product.stock > 10 
                                  ? 'bg-green-100 text-green-700' 
                                  : product.stock > 0 
                                  ? 'bg-orange-100 text-orange-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                Stok: {product.stock}
                              </div>

                              {/* Status */}
                              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                product.isActive 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {product.isActive ? 'Aktiv' : 'Passiv'}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDelete(product.id, product.title)}
                              disabled={deleting === product.id}
                            >
                              {deleting === product.id ? (
                                <span className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
