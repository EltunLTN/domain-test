'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, Trash, Plus, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RevEngine, StaggerContainer, StaggerItem } from '@/components/animations';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`"${categoryName}" kateqoriyasını silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) {
      return;
    }

    setDeleting(categoryId);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Kateqoriya silinə bilmədi');
      }
    } catch (error) {
      alert('Kateqoriya silinərkən xəta baş verdi');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Kateqoriyalar
          </h1>
          <p className="text-muted-foreground mt-1">Bütün məhsul kateqoriyalarını idarə edin</p>
        </div>
        <RevEngine>
          <Link href="/admin/categories/new">
            <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="h-4 w-4" />
              Yeni kateqoriya
            </Button>
          </Link>
        </RevEngine>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-blue-50 border-b-2">
                <tr>
                  <th className="text-left p-4 font-semibold">Kateqoriya adı</th>
                  <th className="text-left p-4 font-semibold">Slug</th>
                  <th className="text-left p-4 font-semibold">Məhsul sayı</th>
                  <th className="text-center p-4 font-semibold">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                <StaggerContainer>
                  {categories.map((category) => (
                    <StaggerItem key={category.id}>
                      <tr className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-semibold text-lg">{category.name}</td>
                        <td className="p-4 text-sm text-muted-foreground font-mono">{category.slug}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{category._count.products}</span>
                          </div>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={deleting === category.id}
                          >
                            {deleting === category.id ? (
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
