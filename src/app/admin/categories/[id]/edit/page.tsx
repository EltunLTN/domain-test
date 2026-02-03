import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const role = (session.user?.role || '').toUpperCase();
  if (role !== 'ADMIN') {
    redirect('/');
  }
}

async function updateCategory(id: string, formData: FormData) {
  'use server';
  await requireAdmin();

  const name = (formData.get('name') || '').toString().trim();
  const slugInput = (formData.get('slug') || '').toString().trim();
  const description = (formData.get('description') || '').toString().trim();
  const image = (formData.get('image') || '').toString().trim();

  if (!name) {
    throw new Error('Name is required');
  }

  const slug = slugInput || slugify(name);

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      image: image || null,
    },
  });

  redirect('/admin/categories');
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    redirect('/admin/categories');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Kategori Düzenle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Kategori Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateCategory.bind(null, category.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad *</Label>
              <Input id="name" name="name" defaultValue={category.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={category.slug} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input id="description" name="description" defaultValue={category.description || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Görsel URL</Label>
              <Input id="image" name="image" defaultValue={category.image || ''} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Kaydet</Button>
              <Link href="/admin/categories">
                <Button type="button" variant="outline">İptal</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
