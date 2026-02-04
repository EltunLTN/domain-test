import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, ShieldCheck, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Hesabım - CarParts',
  description: 'Hesabınızı və sifarişlərinizi idarə edin',
};

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Ödənilib',
  PENDING: 'Gözlənilir',
  CANCELLED: 'Ləğv edilib',
  SHIPPED: 'Göndərilib',
  DELIVERED: 'Çatdırılıb',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  USER: 'İstifadəçi',
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const orders = await prisma.order.findMany({
    where: { userId: user!.id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Hesabım</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil məlumatları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ad</p>
              <p className="font-medium">{user?.name || 'Təyin edilməyib'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                E-poçt
              </p>
              <p className="font-medium text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Rol
              </p>
              <p className="font-medium">
                <span className={`inline-flex px-2 py-1 rounded text-xs ${
                  user?.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {ROLE_LABELS[user?.role || ''] ?? user?.role}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Qeydiyyat tarixi</p>
              <p className="font-medium">
                {new Date(user!.createdAt).toLocaleDateString('az-AZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Son sifarişlər
              </CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Hamısına bax
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => {
                  const totalAmount = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                  return (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">Sifariş #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(totalAmount)}</p>
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'DELIVERED'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{order.orderItems.length} məhsul</span>
                      {order.shippingAddress && (
                        <>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">
                            {JSON.parse(order.shippingAddress).city}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">Hələ sifariş yoxdur</p>
                <Link href="/shop">
                  <Button>Alış-verişə başla</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
