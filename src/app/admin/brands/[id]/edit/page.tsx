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

async function updateBrand(id: string, formData: FormData) {
  'use server';
  await requireAdmin();

  const name = (formData.get('name') || '').toString().trim();
  const slugInput = (formData.get('slug') || '').toString().trim();
  const description = (formData.get('description') || '').toString().trim();
  const logo = (formData.get('logo') || '').toString().trim();

  if (!name) {
    throw new Error('Name is required');
  }

  const slug = slugInput || slugify(name);

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      logo: logo || null,
    },
  });

  redirect('/admin/brands');
}

export default async function EditBrandPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
  });

  if (!brand) {
    redirect('/admin/brands');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Marka Düzenle</h1>

      <Card>
        <CardHeader>
          <CardTitle>Marka Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateBrand.bind(null, brand.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad *</Label>
              <Input id="name" name="name" defaultValue={brand.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={brand.slug} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input id="description" name="description" defaultValue={brand.description || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" name="logo" defaultValue={brand.logo || ''} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Kaydet</Button>
              <Link href="/admin/brands">
                <Button type="button" variant="outline">İptal</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
