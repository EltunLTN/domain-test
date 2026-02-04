import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function createCategory(formData: FormData) {
  'use server';
  await requireAdmin();

  const name = (formData.get('name') || '').toString().trim();
  const slugInput = (formData.get('slug') || '').toString().trim();
  const description = (formData.get('description') || '').toString().trim();
  const image = (formData.get('image') || '').toString().trim();

  if (!name) {
    throw new Error('Ad tələb olunur');
  }

  const slug = slugInput || slugify(name);

  await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      image: image || null,
    },
  });

  redirect('/admin/categories');
}

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Yeni kateqoriya</h1>

      <Card>
        <CardHeader>
          <CardTitle>Kateqoriya məlumatları</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad *</Label>
              <Input id="name" name="name" required placeholder="Məs: Əyləc" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Qısa ad (slug)</Label>
              <Input id="slug" name="slug" placeholder="məs: fren" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Təsvir</Label>
              <Input id="description" name="description" placeholder="Kateqoriya təsviri" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Şəkil URL</Label>
              <Input id="image" name="image" placeholder="https://..." />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Yadda saxla</Button>
              <Link href="/admin/categories">
                <Button type="button" variant="outline">Ləğv et</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
