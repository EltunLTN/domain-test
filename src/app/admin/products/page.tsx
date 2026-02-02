import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">SKU</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Brand</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Stock</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{product.title}</div>
                        <div className="text-sm text-muted-foreground">{product.slug}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{product.sku || 'N/A'}</td>
                    <td className="p-4 text-sm">{product.category.name}</td>
                    <td className="p-4 text-sm">{product.brand.name}</td>
                    <td className="p-4 text-right">
                      {product.discount > 0 ? (
                        <div>
                          <div className="font-semibold">
                            {formatPrice(product.price - (product.price * product.discount) / 100)}
                          </div>
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      ) : (
                        <div className="font-semibold">{formatPrice(product.price)}</div>
                      )}
                    </td>
                    <td className="p-4 text-right">{product.stock}</td>
                    <td className="p-4 text-center">
                      {product.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
