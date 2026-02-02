import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

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
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} AZN</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/products/new" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Add New Product</h3>
            <p className="text-sm text-muted-foreground">Create a new product listing</p>
          </a>
          <a href="/admin/orders" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Manage Orders</h3>
            <p className="text-sm text-muted-foreground">View and update orders</p>
          </a>
          <a href="/admin/categories" className="p-4 border rounded-lg hover:bg-accent">
            <h3 className="font-semibold">Manage Categories</h3>
            <p className="text-sm text-muted-foreground">Organize product categories</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
