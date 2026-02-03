'use client';

import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Trash, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

export function BrandsClient({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(brandId);
    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete brand');
      }
    } catch (error) {
      alert('Error deleting brand');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Brands</h1>
        <Link href="/admin/brands/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Slug</th>
                  <th className="text-left p-4">Products</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-t">
                    <td className="p-4 font-semibold">{brand.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{brand.slug}</td>
                    <td className="p-4">{brand._count.products}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <Link href={`/admin/brands/${brand.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(brand.id, brand.name)}
                        disabled={deleting === brand.id}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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
