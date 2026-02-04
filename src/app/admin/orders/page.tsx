import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Ödənilib',
  PENDING: 'Gözlənilir',
  CANCELLED: 'Ləğv edilib',
  SHIPPED: 'Göndərilib',
  DELIVERED: 'Çatdırılıb',
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sifarişlər</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Sifariş #</th>
                  <th className="text-left p-4">Müştəri</th>
                  <th className="text-left p-4">Məhsul sayı</th>
                  <th className="text-right p-4">Cəmi</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-left p-4">Tarix</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4">
                      <div className="font-semibold">{order.orderNumber}</div>
                    </td>
                    <td className="p-4">
                      <div>{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="p-4 text-sm">{order.orderItems.length} məhsul</td>
                    <td className="p-4 text-right font-semibold">{formatPrice(order.total)}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
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
