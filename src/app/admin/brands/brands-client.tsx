'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Trash, Plus, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RevEngine, StaggerContainer, StaggerItem } from '@/components/animations';

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
    if (!confirm(`"${brandName}" markasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
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
        alert(data.error || 'Marka silinemedi');
      }
    } catch (error) {
      alert('Marka silinirken hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Markalar
          </h1>
          <p className="text-muted-foreground mt-1">Tüm araç parça markalarını yönetin</p>
        </div>
        <RevEngine>
          <Link href="/admin/brands/new">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4" />
              Yeni Marka
            </Button>
          </Link>
        </RevEngine>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <tr>
                  <th className="text-left p-4 font-semibold">Marka Adı</th>
                  <th className="text-left p-4 font-semibold">Slug</th>
                  <th className="text-left p-4 font-semibold">Ürün Sayısı</th>
                  <th className="text-center p-4 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <StaggerContainer>
                  {brands.map((brand) => (
                    <StaggerItem key={brand.id}>
                      <tr className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-semibold text-lg">{brand.name}</td>
                        <td className="p-4 text-sm text-muted-foreground font-mono">{brand.slug}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{brand._count.products}</span>
                          </div>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <Link href={`/admin/brands/${brand.id}/edit`}>
                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDelete(brand.id, brand.name)}
                            disabled={deleting === brand.id}
                          >
                            {deleting === brand.id ? (
                              <span className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
