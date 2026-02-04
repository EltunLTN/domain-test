import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { requireAdmin } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: { in: ['PAID', 'DELIVERED'] },
      },
    }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: recentOrders._sum.total || 0,
  };
}

export default async function AdminPage() {
  // This will redirect if not authenticated or not admin
  await requireAdmin();

  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ümumi məhsullar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ümumi sifarişlər</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ümumi istifadəçilər</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gəlir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} AZN</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sürətli əməliyyatlar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/products/new" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Yeni məhsul əlavə et</h3>
            <p className="text-sm text-muted-foreground">Yeni məhsul elanını yaradın</p>
          </a>
          <a href="/admin/orders" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Sifarişləri idarə et</h3>
            <p className="text-sm text-muted-foreground">Sifarişlərə baxın və yeniləyin</p>
          </a>
          <a href="/admin/categories" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Kateqoriyaları idarə et</h3>
            <p className="text-sm text-muted-foreground">Məhsul kateqoriyalarını təşkil edin</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
